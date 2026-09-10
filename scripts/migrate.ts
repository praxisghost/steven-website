/**
 * scripts/migrate.ts — the one place that changes the database schema.
 *
 * Run once per release, from the platform's PRE-DEPLOY command, never from the
 * web process. A migration inside server boot runs once per instance and again
 * on every restart; a migration here runs once per release and, if it fails,
 * fails the release with the previous version still serving.
 *
 * Idempotent: every statement is CREATE TABLE IF NOT EXISTS, so re-running is a
 * no-op. Exits 0 on success, 1 on any failure — do not soften that, the whole
 * point is that a broken migration stops the deploy.
 *
 * Run:  npm run migrate
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const STATEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['page_views', `
    CREATE TABLE IF NOT EXISTS page_views (
      id         SERIAL PRIMARY KEY,
      visited_at TIMESTAMP DEFAULT NOW()
    );
  `],
  ['contact_messages', `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL,
      sent_at    TIMESTAMP DEFAULT NOW()
    );
  `],
  ['newsletter_subscribers', `
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id            SERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMP DEFAULT NOW()
    );
  `],
  ['minecraft_access_members', `
    CREATE TABLE IF NOT EXISTS minecraft_access_members (
      minecraft_uuid     TEXT PRIMARY KEY,
      minecraft_username TEXT NOT NULL UNIQUE,
      email              TEXT NOT NULL,
      created_at         TIMESTAMP DEFAULT NOW(),
      updated_at         TIMESTAMP DEFAULT NOW()
    );
  `],
  ['minecraft_server_status', `
    CREATE TABLE IF NOT EXISTS minecraft_server_status (
      singleton  BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
      is_online  BOOLEAN NOT NULL,
      checked_at TIMESTAMP DEFAULT NOW()
    );
  `],
];

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    // Fail closed. A migration that silently skips itself is worse than one
    // that stops the deploy, because the release ships against no schema.
    throw new Error('DATABASE_URL is not set — refusing to run migrations blind.');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 1,
    connectionTimeoutMillis: 10_000,
  });

  try {
    // One transaction: either the whole schema advances or none of it does.
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const [name, sql] of STATEMENTS) {
        await client.query(sql);
        console.log(`[migrate] ok  ${name}`);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw err;
    } finally {
      client.release();
    }
    console.log(`[migrate] done — ${STATEMENTS.length} tables ensured.`);
  } finally {
    await pool.end();
  }
}

main().then(
  () => process.exit(0),
  (err: unknown) => {
    console.error('[migrate] FAILED:', err instanceof Error ? err.message : err);
    process.exit(1);
  },
);
