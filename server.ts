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
const CONTACT_TO   = process.env.CONTACT_TO_EMAIL   ?? 'stevelegg2000@gmail.com';

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
      "script-src 'self' https://translate.google.com https://translate.googleapis.com",
      // 'unsafe-inline' kept for the small page-scoped <style> block in
      // misc.html (the frog-slideshow styles). Same-origin otherwise.
      "style-src 'self' 'unsafe-inline'",
      // data: kept for inline SVG icons on the About page.
      // translate.googleapis.com + gstatic.com for the translate widget's assets.
      "img-src 'self' data: https://translate.googleapis.com https://www.gstatic.com",
      "font-src 'self' data:",
      "connect-src 'self' https://translate.googleapis.com",
      // Allow embedding YouTube's privacy-enhanced player on the Guitar page.
      "frame-src https://www.youtube-nocookie.com",
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

// Serve static assets with conservative cache headers.
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
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

// ─────────────────────────────────────────────────────────────────────────────
// DB BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

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

      if (resend) {
        const { error } = await resend.emails.send({
          from:    CONTACT_FROM,
          to:      CONTACT_TO,
          subject: `New message from ${name}`,
          // Plain text only — no untrusted HTML.
          text:    `New contact form submission.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });
        if (error) console.error('Resend error:', error);
      } else {
        console.warn('RESEND_API_KEY not set — email notification skipped.');
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

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK + ERROR HANDLING
// ─────────────────────────────────────────────────────────────────────────────

// Generic fallback — JSON 404 for unknown API routes (everything else is static).
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
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

initDB()
  .then(() => {
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
