const express  = require('express');
const { Pool } = require('pg');
const path     = require('path');
require('dotenv').config();

const app  = express();
const port = process.env.PORT || 3000;

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
async function initDB() {
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
  console.log('DB tables ready.');
}

// ── API: record a page view and return total count ────────────
app.post('/api/views', async (req, res) => {
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
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required.' });
  }
  try {
    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
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