/**
 * send-newsletter.ts
 * Run with: npx tsx send-newsletter.ts
 *
 * Fetches all subscribers from the DB and sends them a newsletter email via Resend.
 * Edit SUBJECT and BODY below before running.
 */

import { Pool }   from 'pg';
import { Resend } from 'resend';
import dotenv     from 'dotenv';

dotenv.config();

// ── Edit these before each send ───────────────────────────────────────────────

const SUBJECT = `First Email Newsletter!`;

const BODY = `
Hi,

Write your newsletter here. Keep it personal — plain text reads like a real email.

You can have multiple paragraphs. Just leave a blank line between them.

Until next time,
Steven

──────────────────────────────
You're receiving this because you signed up at steven-legg.com.
`.trim();

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error('❌  RESEND_API_KEY is not set in your .env file.');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('❌  DATABASE_URL is not set in your .env file.');
    process.exit(1);
  }

  const pool   = new Pool({ connectionString: process.env.DATABASE_URL });
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = process.env.CONTACT_FROM_EMAIL ?? 'newsletter@steven-legg.com';

  // Fetch subscribers
  const { rows } = await pool.query<{ email: string }>(
    'SELECT email FROM newsletter_subscribers ORDER BY subscribed_at ASC'
  );
  await pool.end();

  if (rows.length === 0) {
    console.log('No subscribers yet — nothing to send.');
    process.exit(0);
  }

  console.log(`\nSending to ${rows.length} subscriber(s) from ${from}...\n`);

  let sent = 0;
  let failed = 0;

  for (const { email } of rows) {
    const { error } = await resend.emails.send({
      from,
      to:      email,
      subject: SUBJECT,
      text:    BODY,
    });

    if (error) {
      console.error(`  ❌  ${email} — ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓  ${email}`);
      sent++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDone. ${sent} sent, ${failed} failed.`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
