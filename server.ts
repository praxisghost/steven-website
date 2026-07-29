/**
 * server.ts — Express + PostgreSQL + Resend
 *
 * Serves the static site and three lightweight write endpoints:
 *   • POST /api/views      — page-view counter
 *   • POST /api/contact    — contact form (stores message + emails a copy)
 *   • POST /api/newsletter — newsletter signup
 *
 * Hardened for production: security headers, rate limiting, strict input
 * validation, body size limits, and graceful shutdown.
 *
 * Run:  npm run dev   (auto-reload)
 *       npm start     (production)
 */

import express, { Request, Response, NextFunction } from 'express';
import { Pool }                                     from 'pg';
import path                                         from 'path';
import dotenv                                       from 'dotenv';
import { Resend }                                   from 'resend';
import * as ftp                                    from 'basic-ftp';
import net                                          from 'net';
import { Readable, Writable }                       from 'stream';
import { blogRouter }                               from './sanity/routes';
import { renderNotFound }                           from './sanity/render';

dotenv.config();

const app  = express();
const port = Number(process.env.PORT ?? 3000);

// Behind Railway/Render/etc. — trust the first hop so req.ip reflects the
// original client IP from X-Forwarded-For instead of the proxy address.
// Restrict to a single hop to avoid header-spoofing risks.
app.set('trust proxy', 1);

// ── Resend email client (optional — only active if API key is set) ─
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const CONTACT_FROM = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';
const CONTACT_TO   = process.env.CONTACT_TO_EMAIL   ?? '';

// Minecraft access is intentionally configured only through deployment
// environment variables. Do not put the server address, FTP login, Turnstile
// secret, or email-provider credentials in public/ or in Git.
const TURNSTILE_SITE_KEY          = process.env.TURNSTILE_SITE_KEY ?? '';
const TURNSTILE_SECRET_KEY        = process.env.TURNSTILE_SECRET_KEY ?? '';
const TURNSTILE_EXPECTED_HOSTNAME = process.env.TURNSTILE_EXPECTED_HOSTNAME ?? '';
const MINECRAFT_SERVER_ADDRESS    = process.env.MINECRAFT_SERVER_ADDRESS ?? '';
const MINECRAFT_FTP_HOST          = process.env.MINECRAFT_FTP_HOST ?? '';
const MINECRAFT_FTP_PORT          = Number(process.env.MINECRAFT_FTP_PORT ?? 21);
const MINECRAFT_FTP_USERNAME      = process.env.MINECRAFT_FTP_USERNAME ?? '';
const MINECRAFT_FTP_PASSWORD      = process.env.MINECRAFT_FTP_PASSWORD ?? '';
const MINECRAFT_FTP_SECURE        = process.env.MINECRAFT_FTP_SECURE === 'true';
const MINECRAFT_WHITELIST_PATH    = process.env.MINECRAFT_WHITELIST_PATH ?? 'whitelist.json';
const MINECRAFT_STATUS_HOST       = process.env.MINECRAFT_STATUS_HOST ?? '';
const MINECRAFT_STATUS_PORT       = Number(process.env.MINECRAFT_STATUS_PORT ?? 25565);
const MINECRAFT_STATUS_INTERVAL_MS = Math.max(
  Number(process.env.MINECRAFT_STATUS_INTERVAL_MS ?? 120_000),
  60_000,
);

// ── PostgreSQL connection ──────────────────────────────────────
const pool = new Pool({
  connectionString:    process.env.DATABASE_URL,
  // SSL is required in production hosting (Railway, Render, etc.).
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  // Defensive defaults — avoid hanging the event loop indefinitely.
  max:                  10,
  idleTimeoutMillis:    30_000,
  connectionTimeoutMillis: 5_000,
});

// An idle client dropping its connection emits 'error' on the pool. Without a
// listener Node treats that as an unhandled error event and crashes the
// process — so swallow it here and let the next query retry the connection.
pool.on('error', (err) => {
  console.error('[db] idle client error:', err instanceof Error ? err.message : err);
});

pool.on('error', (err) => {
  // Pool-level errors (lost connection, etc.) should never crash the server.
  console.error('Unexpected PG pool error:', err);
});

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Manually set common security headers (Helmet-equivalent, no extra dep).
 *  • Content-Security-Policy locks every asset to same-origin. Typography
 *    is now Times New Roman (system serif, no web font) and frog photos
 *    are self-hosted, so no third-party origins are needed at all.
 *  • X-Frame-Options blocks clickjacking via iframe embedding.
 *  • Referrer-Policy avoids leaking the full URL on outbound clicks.
 *  • Permissions-Policy disables unused powerful APIs.
 */
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Scripts are same-origin by default. The Google Translate domains are
      // added so the language-switcher dropdown can inject the translation
      // widget on demand. The script is only loaded when the user explicitly
      // selects a translated language — default English visits are unaffected.
      "script-src 'self' https://translate.google.com https://translate.googleapis.com https://challenges.cloudflare.com",
      // 'unsafe-inline' kept for the small page-scoped <style> block in
      // misc.html (the frog-slideshow styles). Same-origin otherwise.
      "style-src 'self' 'unsafe-inline'",
      // data: kept for inline SVG icons on the About page.
      // translate.googleapis.com + gstatic.com for the translate widget's assets.
      // cdn.sanity.io serves blog images uploaded through the Sanity Studio.
      "img-src 'self' data: https://cdn.sanity.io https://translate.googleapis.com https://www.gstatic.com",
      "font-src 'self' data:",
      "connect-src 'self' https://translate.googleapis.com https://challenges.cloudflare.com https://api.minecraftservices.com",
      // Allow embedding YouTube's privacy-enhanced player on the Guitar page.
      "frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options',        'DENY');
  res.setHeader('Referrer-Policy',        'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy',     'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-XSS-Protection',       '0'); // modern best practice: rely on CSP
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Cap JSON body size — protects against memory-exhaustion attacks.
app.use(express.json({ limit: '32kb' }));

// ─────────────────────────────────────────────────────────────────────────────
// BLOG (Sanity-backed)
// ─────────────────────────────────────────────────────────────────────────────
// Mounted *before* express.static, deliberately. public/blog/ is a real
// directory, so serve-static would answer a request for /blog with a 301 to
// /blog/ and never let the router run.
//
// The router only claims slug-shaped paths. Anything that looks like a file —
// /blog/my-post.html — is passed straight through to express.static below, so
// the hand-written posts keep working untouched.
app.use(blogRouter);

// ─────────────────────────────────────────────────────────────────────────────
// STATIC PAGES — clean URLs
// ─────────────────────────────────────────────────────────────────────────────
// Mapped explicitly rather than left to express.static's `extensions` option.
// public/projects/ is a real directory, so serve-static would answer /projects
// with a 301 to /projects/ and never reach the page. Naming each route removes
// that ambiguity entirely.
const PAGES: Record<string, string> = {
  '/about':    'about.html',
  '/projects': 'projects.html',
  '/contact':  'contact.html',
};
for (const [route, file] of Object.entries(PAGES)) {
  app.get(route, (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', file));
  });
}

// Serve static assets with conservative cache headers.
//
// `extensions: ['html']` lets /about resolve to public/about.html, so the
// static pages get the same clean, extension-less URLs as the blog routes.
// `index: false` keeps express.static away from "/" — the blog router owns it.
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  extensions: ['html'],
  index: false,
  setHeaders: (res) => {
    // HTML should always be revalidated so updates land immediately.
    res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// SIMPLE IN-MEMORY RATE LIMITER
// ─────────────────────────────────────────────────────────────────────────────
// Avoid abuse of write endpoints (contact, newsletter). Resets every window.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimit(opts: { windowMs: number; max: number; key?: (r: Request) => string }) {
  const keyFn = opts.key ?? ((req: Request) =>
    // Prefer the first proxy-forwarded IP (Railway sets this).
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim()
    || req.ip
    || 'unknown'
  );

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const k   = `${req.path}::${keyFn(req)}`;
    let b     = buckets.get(k);

    if (!b || b.resetAt < now) {
      b = { count: 0, resetAt: now + opts.windowMs };
      buckets.set(k, b);
    }
    b.count++;
    if (b.count > opts.max) {
      res.status(429).json({ error: 'Too many requests. Please try again later.' });
      return;
    }
    next();
  };
}

// Periodically prune stale buckets so the map can't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
}, 60_000).unref?.();

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Reasonable RFC-5322-style email check (intentionally not exhaustive). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Strip control characters but keep newlines/tabs; trim whitespace. */
function sanitize(s: unknown, max: number): string {
  if (typeof s !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').trim().slice(0, max);
}

const MINECRAFT_USERNAME_RE = /^[A-Za-z0-9_]{3,16}$/;

type TurnstileResult = {
  success?: boolean;
  hostname?: string;
  action?: string;
};

type MinecraftProfile = {
  id?: string;
  name?: string;
};

type WhitelistEntry = {
  uuid: string;
  name: string;
};

function clientIp(req: Request): string {
  return (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim()
    || req.ip
    || '';
}

function minecraftAccessConfigured(): boolean {
  return Boolean(
    TURNSTILE_SITE_KEY
    && TURNSTILE_SECRET_KEY
    && MINECRAFT_SERVER_ADDRESS
    && MINECRAFT_FTP_HOST
    && MINECRAFT_FTP_USERNAME
    && MINECRAFT_FTP_PASSWORD,
  ) && Number.isInteger(MINECRAFT_FTP_PORT) && MINECRAFT_FTP_PORT > 0 && MINECRAFT_FTP_PORT < 65_536;
}

/**
 * A Turnstile widget is not proof by itself: the single-use token must be
 * redeemed here, with Cloudflare, before we look up a player or touch FTP.
 */
async function verifyTurnstile(token: string, remoteIp: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY || !token || token.length > 2048) return false;

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: remoteIp || undefined,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const result = await response.json() as TurnstileResult;
    return Boolean(
      response.ok
      && result.success
      && result.action === 'minecraft-access'
      && (!TURNSTILE_EXPECTED_HOSTNAME || result.hostname === TURNSTILE_EXPECTED_HOSTNAME),
    );
  } catch (err) {
    console.error('Turnstile verification failed:', err instanceof Error ? err.message : err);
    return false;
  }
}

/** Resolve a Java account UUID, which vanilla whitelist.json requires. */
async function resolveMinecraftProfile(username: string): Promise<{ uuid: string; username: string } | null> {
  try {
    const response = await fetch(
      `https://api.minecraftservices.com/minecraft/profile/lookup/name/${encodeURIComponent(username)}`,
      { signal: AbortSignal.timeout(10_000) },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`profile lookup returned ${response.status}`);
    const profile = await response.json() as MinecraftProfile;
    if (!profile.id || !/^[a-f0-9]{32}$/i.test(profile.id) || !profile.name) return null;
    return { uuid: profile.id.toLowerCase(), username: profile.name };
  } catch (err) {
    console.error('Minecraft profile lookup failed:', err instanceof Error ? err.message : err);
    throw new Error('Minecraft account lookup is temporarily unavailable.');
  }
}

async function downloadRemoteText(client: ftp.Client, remotePath: string): Promise<string> {
  const chunks: Buffer[] = [];
  const sink = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      callback();
    },
  });
  await client.downloadTo(sink, remotePath);
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Update exactly the configured standard Minecraft whitelist file. This is an
 * FTP operation, not client code, so hosting credentials never reach a browser.
 */
async function addToMinecraftWhitelist(entry: WhitelistEntry): Promise<void> {
  if (!MINECRAFT_FTP_HOST || !MINECRAFT_FTP_USERNAME || !MINECRAFT_FTP_PASSWORD) {
    throw new Error('Minecraft whitelist service is not configured.');
  }

  const client = new ftp.Client(15_000);
  client.ftp.verbose = false;
  try {
    await client.access({
      host: MINECRAFT_FTP_HOST,
      port: MINECRAFT_FTP_PORT,
      user: MINECRAFT_FTP_USERNAME,
      password: MINECRAFT_FTP_PASSWORD,
      secure: MINECRAFT_FTP_SECURE,
    });
    const text = await downloadRemoteText(client, MINECRAFT_WHITELIST_PATH);
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('Configured whitelist file is not a JSON array.');

    const entries = parsed.filter((item): item is WhitelistEntry => (
      typeof item === 'object'
      && item !== null
      && typeof (item as WhitelistEntry).uuid === 'string'
      && typeof (item as WhitelistEntry).name === 'string'
    ));
    if (entries.length !== parsed.length) {
      throw new Error('Configured whitelist file contains invalid entries.');
    }

    const match = entries.find((item) => item.uuid.toLowerCase() === entry.uuid);
    if (match) {
      match.name = entry.name; // preserve the current capitalization from Minecraft.
    } else {
      const nameConflict = entries.find((item) => item.name.toLowerCase() === entry.name.toLowerCase());
      if (nameConflict) throw new Error('A conflicting Minecraft name is already whitelisted.');
      entries.push(entry);
    }

    const upload = JSON.stringify(entries, null, 2) + '\n';
    await client.uploadFrom(Readable.from([upload]), MINECRAFT_WHITELIST_PATH);
  } finally {
    client.close();
  }
}

// Serialise read-modify-write FTP operations in this process so two approved
// joins cannot overwrite one another's whitelist entry.
let whitelistUpdateTail: Promise<void> = Promise.resolve();
function queueWhitelistUpdate(entry: WhitelistEntry): Promise<void> {
  const update = whitelistUpdateTail.then(() => addToMinecraftWhitelist(entry));
  whitelistUpdateTail = update.catch(() => undefined);
  return update;
}

// ─────────────────────────────────────────────────────────────────────────────
// DB BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Whether Postgres was reachable at boot.
 *
 * The static site and the Sanity-backed blog need no database at all, so a
 * missing or unreachable Postgres must not take the whole site down — it only
 * disables the handful of endpoints that genuinely persist something. In
 * production DATABASE_URL is always set, so this stays true and nothing about
 * the deployed behaviour changes.
 */
let dbReady = false;

/**
 * Guard for routes that cannot work without Postgres. Returns 503 rather than
 * letting the handler throw an opaque connection error.
 */
function requireDb(_req: Request, res: Response, next: NextFunction): void {
  if (!dbReady) {
    res.status(503).json({
      error: 'This feature is temporarily unavailable because the database is not connected.',
    });
    return;
  }
  next();
}

async function initDB(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS page_views (
      id         SERIAL PRIMARY KEY,
      visited_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL,
      sent_at    TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id            SERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS minecraft_access_members (
      minecraft_uuid     TEXT PRIMARY KEY,
      minecraft_username TEXT NOT NULL UNIQUE,
      email              TEXT NOT NULL,
      created_at         TIMESTAMP DEFAULT NOW(),
      updated_at         TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS minecraft_server_status (
      singleton  BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
      is_online  BOOLEAN NOT NULL,
      checked_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // ── Cleanup migration: remove the retired account system ──────────────────
  // The account/auth feature (user accounts, email verification, server-side
  // SRS progress, streaks, and saved guides) has been removed from the site.
  // SRS now runs entirely client-side via localStorage, so these tables are
  // no longer referenced by any route. Drop them if a previous deploy created
  // them. Safe and idempotent (IF EXISTS); CASCADE clears dependent rows.
  await pool.query(`DROP TABLE IF EXISTS srs_progress    CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS saved_guides    CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS pending_signups CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS users           CASCADE`);

  console.log('DB tables ready.');
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// View counter (light rate limit — 60 inserts per IP per minute is plenty).
app.post(
  '/api/views',
  rateLimit({ windowMs: 60_000, max: 60 }),
  async (_req: Request, res: Response) => {
    // Without a database there is nothing to count. Reply 200 with a null
    // count — script.js already hides the counter when it isn't a number, so
    // this degrades silently instead of logging an error on every page load.
    if (!dbReady) {
      res.json({ views: null });
      return;
    }
    try {
      await pool.query('INSERT INTO page_views DEFAULT VALUES');
      const { rows } = await pool.query('SELECT COUNT(*) AS views FROM page_views');
      res.json({ views: parseInt(rows[0].views, 10) });
    } catch (err) {
      console.error('views error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Contact form — strict validation, length caps, rate limited (10/hour/IP).
app.post(
  '/api/contact',
  requireDb,
  rateLimit({ windowMs: 60 * 60_000, max: 10 }),
  async (req: Request, res: Response) => {
    const name    = sanitize((req.body as Record<string, unknown>)?.name,    100);
    const email   = sanitize((req.body as Record<string, unknown>)?.email,   254);
    const message = sanitize((req.body as Record<string, unknown>)?.message, 5000);

    if (!name || !email || !message) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
    if (name.length < 1 || name.length > 100) {
      res.status(400).json({ error: 'Name must be 1–100 characters.' });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (message.length < 1 || message.length > 5000) {
      res.status(400).json({ error: 'Message must be 1–5000 characters.' });
      return;
    }

    try {
      // Save first — never lose a real message to a flaky email provider.
      await pool.query(
        'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
        [name, email, message],
      );

      if (resend && CONTACT_TO) {
        const { error } = await resend.emails.send({
          from:    CONTACT_FROM,
          to:      CONTACT_TO,
          subject: `New message from ${name}`,
          // Plain text only — no untrusted HTML.
          text:    `New contact form submission.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });
        if (error) console.error('Resend error:', error);
      } else {
        console.warn('Contact notification skipped: RESEND_API_KEY or CONTACT_TO_EMAIL is not configured.');
      }

      res.json({ ok: true });
    } catch (err) {
      console.error('contact error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Newsletter signup — strict email validation, rate limited.
app.post(
  '/api/newsletter',
  requireDb,
  rateLimit({ windowMs: 60 * 60_000, max: 10 }),
  async (req: Request, res: Response) => {
    const email = sanitize((req.body as Record<string, unknown>)?.email, 254);

    if (!email || !EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    try {
      await pool.query(
        `INSERT INTO newsletter_subscribers (email)
         VALUES ($1)
         ON CONFLICT (email) DO NOTHING`,
        [email],
      );
      res.json({ ok: true });
    } catch (err) {
      console.error('newsletter error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// The public key is safe to send to the browser; the Turnstile secret is never
// exposed. Keeping this endpoint separate lets the static page remain free of
// deployment-specific values.
app.get('/api/minecraft-access/config', (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    enabled: minecraftAccessConfigured(),
    turnstileSiteKey: TURNSTILE_SITE_KEY || null,
  });
});

app.get('/api/minecraft-status', async (_req: Request, res: Response) => {
  // "Unknown" is already a state the client understands, so a missing database
  // simply means we have nothing to report rather than being an error.
  if (!dbReady) {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ known: false });
    return;
  }
  try {
    const { rows } = await pool.query(
      'SELECT is_online, checked_at FROM minecraft_server_status WHERE singleton = TRUE',
    );
    res.setHeader('Cache-Control', 'no-store');
    if (!rows[0]) {
      res.json({ known: false });
      return;
    }
    res.json({ known: true, online: rows[0].is_online, checkedAt: rows[0].checked_at });
  } catch (err) {
    console.error('minecraft status error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Human-verified access request. The IP address is returned only after the
// Turnstile token, validated email, Java username lookup, and FTP whitelist
// write all succeed.
app.post(
  '/api/minecraft-access',
  requireDb,
  rateLimit({ windowMs: 60 * 60_000, max: 6 }),
  async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const email = sanitize(body.email, 254).toLowerCase();
    const requestedUsername = sanitize(body.minecraftUsername, 16);
    const turnstileToken = sanitize(body.turnstileToken, 2048);
    const honeypot = sanitize(body.website, 200);
    const acceptedPrivacy = body.privacyAccepted === true;

    if (honeypot) {
      res.status(400).json({ error: 'We could not process that request.' });
      return;
    }
    if (!minecraftAccessConfigured()) {
      res.status(503).json({ error: 'Server access requests are temporarily unavailable. Please try again later.' });
      return;
    }
    if (!email || !EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (!MINECRAFT_USERNAME_RE.test(requestedUsername)) {
      res.status(400).json({ error: 'Enter a valid Java Edition Minecraft username (3–16 letters, numbers, or underscores).' });
      return;
    }
    if (!acceptedPrivacy) {
      res.status(400).json({ error: 'Please confirm how your email will be used.' });
      return;
    }

    const human = await verifyTurnstile(turnstileToken, clientIp(req));
    if (!human) {
      res.status(400).json({ error: 'Human verification did not succeed. Please complete it again and retry.' });
      return;
    }

    try {
      const profile = await resolveMinecraftProfile(requestedUsername);
      if (!profile) {
        res.status(400).json({ error: 'That Java Edition Minecraft username could not be found. Please check the spelling.' });
        return;
      }

      await queueWhitelistUpdate({ uuid: profile.uuid, name: profile.username });
      await pool.query(
        `INSERT INTO minecraft_access_members (minecraft_uuid, minecraft_username, email)
         VALUES ($1, $2, $3)
         ON CONFLICT (minecraft_uuid) DO UPDATE
           SET minecraft_username = EXCLUDED.minecraft_username,
               email = EXCLUDED.email,
               updated_at = NOW()`,
        [profile.uuid, profile.username, email],
      );

      res.setHeader('Cache-Control', 'no-store');
      res.json({
        ok: true,
        serverAddress: MINECRAFT_SERVER_ADDRESS,
        message: `${profile.username} has been added to the server whitelist.`,
      });
    } catch (err) {
      console.error('minecraft access error:', err instanceof Error ? err.message : err);
      res.status(502).json({
        error: 'We could not update the server whitelist right now. Nothing has been revealed; please try again shortly.',
      });
    }
  },
);

function probeMinecraftServer(): Promise<boolean> {
  if (!MINECRAFT_STATUS_HOST || !Number.isInteger(MINECRAFT_STATUS_PORT)
    || MINECRAFT_STATUS_PORT < 1 || MINECRAFT_STATUS_PORT > 65_535) {
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: MINECRAFT_STATUS_HOST, port: MINECRAFT_STATUS_PORT });
    const finish = (online: boolean) => {
      socket.destroy();
      resolve(online);
    };
    socket.setTimeout(10_000);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

async function notifyMinecraftMembers(isOnline: boolean): Promise<void> {
  if (!resend) {
    console.warn('Minecraft status changed but RESEND_API_KEY is not configured.');
    return;
  }
  const { rows } = await pool.query<{ email: string }>('SELECT email FROM minecraft_access_members');
  const subject = isOnline ? 'Minecraft server is back online' : 'Minecraft server is down for maintenance';
  const text = isOnline
    ? 'The Minecraft server is back online. You can join again using the address from the server access page.'
    : 'The Minecraft server appears to be down for maintenance. We will email you again when it is back online.';

  let failures = 0;
  for (const { email } of rows) {
    const { error } = await resend.emails.send({ from: CONTACT_FROM, to: email, subject, text });
    if (error) failures++;
  }
  console.log(`Minecraft status notification sent to ${rows.length - failures}/${rows.length} members.`);
}

async function checkMinecraftStatus(): Promise<void> {
  if (!MINECRAFT_STATUS_HOST || !Number.isInteger(MINECRAFT_STATUS_PORT)
    || MINECRAFT_STATUS_PORT < 1 || MINECRAFT_STATUS_PORT > 65_535) return;
  const isOnline = await probeMinecraftServer();
  const { rows } = await pool.query<{ is_online: boolean }>(
    'SELECT is_online FROM minecraft_server_status WHERE singleton = TRUE',
  );

  if (!rows[0]) {
    // Establish a baseline without treating a deploy as a maintenance event.
    await pool.query(
      'INSERT INTO minecraft_server_status (singleton, is_online, checked_at) VALUES (TRUE, $1, NOW())',
      [isOnline],
    );
    return;
  }

  const changed = rows[0].is_online !== isOnline;
  await pool.query(
    'UPDATE minecraft_server_status SET is_online = $1, checked_at = NOW() WHERE singleton = TRUE',
    [isOnline],
  );
  if (changed) await notifyMinecraftMembers(isOnline);
}

function startMinecraftStatusMonitor(): void {
  if (!MINECRAFT_STATUS_HOST || !Number.isInteger(MINECRAFT_STATUS_PORT)
    || MINECRAFT_STATUS_PORT < 1 || MINECRAFT_STATUS_PORT > 65_535) {
    console.warn('Minecraft status monitor disabled: MINECRAFT_STATUS_HOST/PORT are not configured.');
    return;
  }
  checkMinecraftStatus().catch((err) => console.error('Initial Minecraft status check failed:', err));
  setInterval(() => {
    checkMinecraftStatus().catch((err) => console.error('Minecraft status check failed:', err));
  }, MINECRAFT_STATUS_INTERVAL_MS).unref?.();
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK + ERROR HANDLING
// ─────────────────────────────────────────────────────────────────────────────

// Generic fallback — JSON 404 for unknown API routes.
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Everything else that got this far is a genuine 404. Serve the styled page so
// mistyped URLs and dead inbound links land somewhere that looks like the site.
app.use((_req: Request, res: Response) => {
  res.status(404).type('html').send(renderNotFound());
});

// Final error handler — keep stack traces out of responses.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

// ─────────────────────────────────────────────────────────────────────────────
// STARTUP + GRACEFUL SHUTDOWN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Try to reach Postgres, but never let its absence stop the site from serving.
 * Sets dbReady so the DB-backed endpoints can answer 503 instead of throwing.
 */
async function connectDB(): Promise<void> {
  try {
    await initDB();
    dbReady = true;
    console.log('[db] connected — all endpoints available.');
  } catch (err) {
    dbReady = false;
    const detail = err instanceof Error ? err.message : String(err);
    console.warn(
      `\n[db] ⚠️  Postgres unavailable: ${detail}\n` +
      '[db] The site, the Sanity blog and all static pages will still serve.\n' +
      '[db] Disabled until a database is reachable: /api/contact, /api/newsletter,\n' +
      '[db] /api/minecraft-access, and the view counter.\n' +
      '[db] To enable them locally: run `createdb ' + (process.env.USER ?? 'yourname') +
      '`, or set DATABASE_URL in .env\n',
    );
  }
}

connectDB()
  .then(() => {
    // The status monitor writes to Postgres on every tick, so it only makes
    // sense to run when there is a database to write to.
    if (dbReady) startMinecraftStatusMonitor();

    const server = app.listen(port, () =>
      console.log(`Running on http://localhost:${port}`),
    );

    const shutdown = (signal: NodeJS.Signals) => {
      console.log(`\n${signal} received — shutting down gracefully.`);
      server.close(() => {
        pool.end().finally(() => process.exit(0));
      });
      // Force-exit if shutdown stalls (e.g., long-running request).
      setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.on('SIGINT',  shutdown);
    process.on('SIGTERM', shutdown);
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
