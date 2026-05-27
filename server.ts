/**
 * server.ts — Express + PostgreSQL + Resend
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
import bcrypt                                       from 'bcryptjs';
import jwt                                          from 'jsonwebtoken';
import { randomInt }                                from 'crypto';

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

// ── JWT configuration ──────────────────────────────────────────
// JWT_SECRET must be set in production — a long random string.
// Falls back to an insecure dev value; will warn on startup.
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-insecure-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET is not set — using insecure dev default. Set it in production.');
}
const JWT_EXPIRY     = '30d';   // token lifetime in the cookie
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const BCRYPT_ROUNDS  = 12;

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
// COOKIE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Minimal cookie header parser — avoids a cookie-parser dependency. */
function parseCookies(req: Request): Record<string, string> {
  const raw = req.headers.cookie ?? '';
  const result: Record<string, string> = {};
  for (const pair of raw.split(';')) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx < 1) continue;
    const k = pair.slice(0, eqIdx).trim();
    const v = pair.slice(eqIdx + 1).trim();
    try { result[k] = decodeURIComponent(v); } catch { result[k] = v; }
  }
  return result;
}

function setAuthCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieParts = [
    `auth=${encodeURIComponent(token)}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
  ];
  if (isProduction) cookieParts.push('Secure');
  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function clearAuthCookie(res: Response): void {
  res.setHeader('Set-Cookie', 'auth=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict');
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

interface JwtPayload {
  userId: number;
  email:  string;
}

/**
 * Reads the `auth` cookie, verifies the JWT, and attaches the decoded payload
 * to res.locals.auth. Returns 401 if missing or invalid.
 */
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const cookies = parseCookies(req);
  const token   = cookies['auth'];
  if (!token) { res.status(401).json({ error: 'Not authenticated.' }); return; }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    res.locals['auth'] = payload;
    next();
  } catch {
    clearAuthCookie(res);
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
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

  // ── User accounts ─────────────────────────────────────────────────────────
  // Completely separate from newsletter_subscribers. Creating an account
  // does NOT add the user to any mailing list. Emails here are used only
  // for authentication and account-initiated password reset.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id                   SERIAL PRIMARY KEY,
      email                TEXT NOT NULL UNIQUE,
      password_hash        TEXT NOT NULL,
      created_at           TIMESTAMP DEFAULT NOW(),
      reset_code           TEXT,
      reset_code_expires   TIMESTAMP
    );
  `);

  // ── SRS progress ──────────────────────────────────────────────────────────
  // Per-user, per-language-pair SM-2 state (JSON blob).
  // Falls back to localStorage when user is not logged in (client-side).
  await pool.query(`
    CREATE TABLE IF NOT EXISTS srs_progress (
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      pair       TEXT    NOT NULL,
      state_json TEXT    NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (user_id, pair)
    );
  `);

  // ── Saved guides ──────────────────────────────────────────────────────────
  // Bookmarked language guide URLs per user.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS saved_guides (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      guide_url  TEXT    NOT NULL,
      saved_at   TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, guide_url)
    );
  `);

  console.log('DB tables ready.');
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES — existing
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
// ROUTES — auth
// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Account creation is explicitly decoupled from the newsletter.
// None of these routes touch newsletter_subscribers. Signing up for an
// account does not subscribe the user to any mailing list.

// POST /api/auth/signup — create account
app.post(
  '/api/auth/signup',
  rateLimit({ windowMs: 60 * 60_000, max: 10 }),
  async (req: Request, res: Response) => {
    const email    = sanitize((req.body as Record<string, unknown>)?.email,    254);
    const password = sanitize((req.body as Record<string, unknown>)?.password, 128);

    if (!email || !EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (!password || password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }
    if (password.length > 128) {
      res.status(400).json({ error: 'Password must be 128 characters or fewer.' });
      return;
    }

    try {
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const { rows } = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
        [email.toLowerCase(), hash],
      );
      const user  = rows[0] as { id: number; email: string; created_at: string };
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
      setAuthCookie(res, token);
      res.json({ ok: true, email: user.email });
    } catch (err: unknown) {
      // PostgreSQL unique violation code = 23505
      if ((err as { code?: string })?.code === '23505') {
        res.status(409).json({ error: 'An account with that email already exists.' });
        return;
      }
      console.error('signup error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// POST /api/auth/login — verify credentials
app.post(
  '/api/auth/login',
  rateLimit({ windowMs: 15 * 60_000, max: 10 }),
  async (req: Request, res: Response) => {
    const email    = sanitize((req.body as Record<string, unknown>)?.email,    254);
    const password = sanitize((req.body as Record<string, unknown>)?.password, 128);

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    try {
      const { rows } = await pool.query(
        'SELECT id, email, password_hash FROM users WHERE email = $1',
        [email.toLowerCase()],
      );
      if (!rows.length) {
        // Constant-time response to prevent email enumeration.
        await bcrypt.hash('dummy', BCRYPT_ROUNDS);
        res.status(401).json({ error: 'Incorrect email or password.' });
        return;
      }
      const user = rows[0] as { id: number; email: string; password_hash: string };
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        res.status(401).json({ error: 'Incorrect email or password.' });
        return;
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
      setAuthCookie(res, token);
      res.json({ ok: true, email: user.email });
    } catch (err) {
      console.error('login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// POST /api/auth/logout — clear cookie
app.post('/api/auth/logout', ((_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ ok: true });
}) as express.RequestHandler);

// GET /api/auth/me — return current user (used by account.html on load)
app.get('/api/auth/me', requireAuth, ((_req: Request, res: Response) => {
  const auth = res.locals['auth'] as JwtPayload;
  res.json({ email: auth.email, userId: auth.userId });
}) as express.RequestHandler);

// POST /api/auth/reset-request — send 6-digit reset code via Resend
app.post(
  '/api/auth/reset-request',
  rateLimit({ windowMs: 60 * 60_000, max: 5 }),
  async (req: Request, res: Response) => {
    const email = sanitize((req.body as Record<string, unknown>)?.email, 254);
    if (!email || !EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    try {
      const { rows } = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email.toLowerCase()],
      );

      // Always respond OK — don't reveal whether an account exists.
      if (!rows.length) { res.json({ ok: true }); return; }

      const code    = String(randomInt(100000, 999999 + 1)).padStart(6, '0');
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await pool.query(
        'UPDATE users SET reset_code = $1, reset_code_expires = $2 WHERE email = $3',
        [code, expires, email.toLowerCase()],
      );

      if (resend) {
        await resend.emails.send({
          from:    CONTACT_FROM,
          to:      email,
          subject: 'Your password reset code — steven-legg.com',
          text:    `Your password reset code is: ${code}\n\nThis code expires in 15 minutes. If you didn't request a reset, ignore this email.\n\nDo not share this code with anyone.`,
        });
      } else {
        // Dev fallback: log to console so the flow is testable locally.
        console.info(`[DEV] Password reset code for ${email}: ${code}`);
      }

      res.json({ ok: true });
    } catch (err) {
      console.error('reset-request error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// POST /api/auth/reset-confirm — verify code + update password
app.post(
  '/api/auth/reset-confirm',
  rateLimit({ windowMs: 15 * 60_000, max: 5 }),
  async (req: Request, res: Response) => {
    const email    = sanitize((req.body as Record<string, unknown>)?.email,    254);
    const code     = sanitize((req.body as Record<string, unknown>)?.code,     6);
    const password = sanitize((req.body as Record<string, unknown>)?.password, 128);

    if (!email || !code || !password) {
      res.status(400).json({ error: 'Email, code, and new password are required.' });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters.' });
      return;
    }

    try {
      const { rows } = await pool.query(
        `SELECT id, reset_code, reset_code_expires
         FROM users WHERE email = $1`,
        [email.toLowerCase()],
      );
      if (!rows.length) {
        res.status(400).json({ error: 'Invalid or expired reset code.' });
        return;
      }
      const user = rows[0] as { id: number; reset_code: string | null; reset_code_expires: Date | null };
      const now  = new Date();
      if (
        !user.reset_code ||
        !user.reset_code_expires ||
        user.reset_code_expires < now ||
        user.reset_code !== code
      ) {
        res.status(400).json({ error: 'Invalid or expired reset code.' });
        return;
      }

      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      await pool.query(
        'UPDATE users SET password_hash = $1, reset_code = NULL, reset_code_expires = NULL WHERE id = $2',
        [hash, user.id],
      );
      res.json({ ok: true });
    } catch (err) {
      console.error('reset-confirm error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// POST /api/auth/change-password — verify current password, set new one
app.post(
  '/api/auth/change-password',
  requireAuth,
  rateLimit({ windowMs: 15 * 60_000, max: 5 }),
  async (req: Request, res: Response) => {
    const auth        = res.locals['auth'] as JwtPayload;
    const currentPwd  = sanitize((req.body as Record<string, unknown>)?.current,  128);
    const newPassword = sanitize((req.body as Record<string, unknown>)?.password, 128);

    if (!currentPwd || !newPassword) {
      res.status(400).json({ error: 'Current and new passwords are required.' });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword.length > 128) {
      res.status(400).json({ error: 'New password must be 128 characters or fewer.' });
      return;
    }

    try {
      const { rows } = await pool.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [auth.userId],
      );
      if (!rows.length) {
        res.status(401).json({ error: 'Account not found.' });
        return;
      }
      const user  = rows[0] as { password_hash: string };
      const match = await bcrypt.compare(currentPwd, user.password_hash);
      if (!match) {
        res.status(401).json({ error: 'Current password is incorrect.' });
        return;
      }

      const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [hash, auth.userId],
      );
      res.json({ ok: true });
    } catch (err) {
      console.error('change-password error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// POST /api/auth/delete — permanently delete account after password confirmation
app.post(
  '/api/auth/delete',
  requireAuth,
  rateLimit({ windowMs: 60 * 60_000, max: 3 }),
  async (req: Request, res: Response) => {
    const auth     = res.locals['auth'] as JwtPayload;
    const password = sanitize((req.body as Record<string, unknown>)?.password, 128);

    if (!password) {
      res.status(400).json({ error: 'Password confirmation is required.' });
      return;
    }

    try {
      const { rows } = await pool.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [auth.userId],
      );
      if (!rows.length) {
        res.status(401).json({ error: 'Account not found.' });
        return;
      }
      const user  = rows[0] as { password_hash: string };
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        res.status(401).json({ error: 'Incorrect password.' });
        return;
      }

      // ON DELETE CASCADE in the schema handles srs_progress and saved_guides.
      await pool.query('DELETE FROM users WHERE id = $1', [auth.userId]);
      clearAuthCookie(res);
      res.json({ ok: true });
    } catch (err) {
      console.error('delete-account error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES — SRS progress sync
// ─────────────────────────────────────────────────────────────────────────────
// SRS state is saved server-side when logged in; falls back to localStorage
// in the client JS when the user is not authenticated.

// POST /api/srs/save — upsert state for one language pair
app.post(
  '/api/srs/save',
  requireAuth,
  rateLimit({ windowMs: 60_000, max: 60 }),
  async (req: Request, res: Response) => {
    const auth      = res.locals['auth'] as JwtPayload;
    const pair      = sanitize((req.body as Record<string, unknown>)?.pair,       32);
    const stateJson = (req.body as Record<string, unknown>)?.state;

    if (!pair || !stateJson) {
      res.status(400).json({ error: 'pair and state are required.' });
      return;
    }
    // Only accept objects — reject strings/arrays/primitives.
    if (typeof stateJson !== 'object' || Array.isArray(stateJson)) {
      res.status(400).json({ error: 'state must be a JSON object.' });
      return;
    }

    const json = JSON.stringify(stateJson);
    if (json.length > 128_000) {
      res.status(400).json({ error: 'State payload too large.' });
      return;
    }

    try {
      await pool.query(
        `INSERT INTO srs_progress (user_id, pair, state_json, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, pair) DO UPDATE
           SET state_json = EXCLUDED.state_json,
               updated_at = NOW()`,
        [auth.userId, pair, json],
      );
      res.json({ ok: true });
    } catch (err) {
      console.error('srs/save error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// GET /api/srs/load — return all SRS pairs for the logged-in user
app.get('/api/srs/load', requireAuth, async (_req: Request, res: Response) => {
  const auth = res.locals['auth'] as JwtPayload;
  try {
    const { rows } = await pool.query(
      'SELECT pair, state_json, updated_at FROM srs_progress WHERE user_id = $1 ORDER BY updated_at DESC',
      [auth.userId],
    );
    const result: Record<string, unknown> = {};
    for (const row of rows as { pair: string; state_json: string; updated_at: string }[]) {
      try { result[row.pair] = JSON.parse(row.state_json); } catch { /* skip malformed */ }
    }
    res.json(result);
  } catch (err) {
    console.error('srs/load error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES — saved guides
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/guides/save — bookmark a guide (or remove it)
app.post(
  '/api/guides/save',
  requireAuth,
  rateLimit({ windowMs: 60_000, max: 30 }),
  async (req: Request, res: Response) => {
    const auth     = res.locals['auth'] as JwtPayload;
    const guideUrl = sanitize((req.body as Record<string, unknown>)?.url, 256);
    const remove   = (req.body as Record<string, unknown>)?.remove === true;

    if (!guideUrl) {
      res.status(400).json({ error: 'url is required.' });
      return;
    }
    // Only allow same-origin relative paths like "/german-learning.html"
    if (!/^\/[\w\-\.]+\.html$/.test(guideUrl)) {
      res.status(400).json({ error: 'Invalid guide URL.' });
      return;
    }

    try {
      if (remove) {
        await pool.query(
          'DELETE FROM saved_guides WHERE user_id = $1 AND guide_url = $2',
          [auth.userId, guideUrl],
        );
      } else {
        await pool.query(
          `INSERT INTO saved_guides (user_id, guide_url)
           VALUES ($1, $2)
           ON CONFLICT (user_id, guide_url) DO NOTHING`,
          [auth.userId, guideUrl],
        );
      }
      res.json({ ok: true });
    } catch (err) {
      console.error('guides/save error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// GET /api/guides/saved — return all saved guide URLs for the current user
app.get('/api/guides/saved', requireAuth, async (_req: Request, res: Response) => {
  const auth = res.locals['auth'] as JwtPayload;
  try {
    const { rows } = await pool.query(
      'SELECT guide_url, saved_at FROM saved_guides WHERE user_id = $1 ORDER BY saved_at DESC',
      [auth.userId],
    );
    res.json(rows);
  } catch (err) {
    console.error('guides/saved error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

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
