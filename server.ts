import express, { Request, Response } from 'express';
import { Pool }                        from 'pg';
import path                            from 'path';
import dotenv                          from 'dotenv';
import { Resend }                      from 'resend';

dotenv.config();

const app  = express();
const port = process.env.PORT ?? 3000;

// ── Resend email client (optional — only active if API key is set) ─
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const CONTACT_FROM  = process.env.CONTACT_FROM_EMAIL  ?? 'onboarding@resend.dev';
const CONTACT_TO    = process.env.CONTACT_TO_EMAIL    ?? 'stevelegg2000@gmail.com';

// ── PostgreSQL connection ──────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

// ── Middleware ─────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Initialize tables (run once on startup) ───────────────────
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
      id           SERIAL PRIMARY KEY,
      email        TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('DB tables ready.');
}

// ── API: record a page view and return total count ────────────
app.post('/api/views', async (_req: Request, res: Response) => {
  try {
    await pool.query('INSERT INTO page_views DEFAULT VALUES');
    const { rows } = await pool.query('SELECT COUNT(*) AS views FROM page_views');
    res.json({ views: parseInt(rows[0].views, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ── API: save a contact form message ──────────────────────────
app.post('/api/contact', async (req: Request, res: Response) => {
  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    res.status(400).json({ error: 'All fields required.' });
    return;
  }

  try {
    // Always save to DB first — messages are never lost even if email fails
    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message],
    );

    // Send email notification if Resend is configured
    if (resend) {
      const { error } = await resend.emails.send({
        from:    CONTACT_FROM,
        to:      CONTACT_TO,
        subject: `New message from ${name}`,
        text:    `You have a new contact form submission.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });
      if (error) console.error('Resend error:', error);
    } else {
      console.warn('RESEND_API_KEY not set — email notification skipped.');
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ── API: newsletter signup ─────────────────────────────────────
app.post('/api/newsletter', async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email required.' });
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
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ── Start ──────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(port, () => console.log(`Running on http://localhost:${port}`));
});
