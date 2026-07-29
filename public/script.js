/* ─────────────────────────────────────────────────────────────────────────────
 *  script.js — progressive enhancement only.
 *
 *  Nothing here is required to read the site. It wires up:
 *    1. Contact form      (contact page)
 *    2. Newsletter form   (sidebar, appears on most pages)
 *    3. View counter      (about page)
 *
 *  Safety notes:
 *    • All DOM writes use textContent — never innerHTML.
 *    • Listeners attach via addEventListener only.
 *  ────────────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /** Set a status line and colour it by outcome. */
  function note(el, message, kind) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove('form-note--ok', 'form-note--error');
    if (kind) el.classList.add(`form-note--${kind}`);
  }

  /** Shared submit handler for the small JSON-posting forms. */
  function wireForm({ form, statusEl, endpoint, build, validate, pending, success }) {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const status = document.getElementById(statusEl);
      const button = form.querySelector('button[type="submit"]');
      const body = build(new FormData(form));

      const problem = validate(body);
      if (problem) { note(status, problem, 'error'); return; }

      if (button) button.disabled = true;
      note(status, pending, null);

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        let payload = {};
        try { payload = await res.json(); } catch { /* empty body is fine */ }

        if (res.ok) {
          note(status, success, 'ok');
          form.reset();
        } else {
          note(status, payload.error || 'Something went wrong. Please try again.', 'error');
        }
      } catch {
        note(status, 'Network error — please try again in a moment.', 'error');
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  /* 1. Contact ------------------------------------------------------------ */
  wireForm({
    form: document.getElementById('contact-form'),
    statusEl: 'form-status',
    endpoint: '/api/contact',
    build: (fd) => ({
      name: String(fd.get('name') || '').slice(0, 100),
      email: String(fd.get('email') || '').slice(0, 254),
      message: String(fd.get('message') || '').slice(0, 5000),
    }),
    validate: (b) => {
      if (!b.name || !b.email || !b.message) return 'Please fill in all three fields.';
      if (!EMAIL_RE.test(b.email)) return 'That email address doesn’t look right.';
      return null;
    },
    pending: 'Sending…',
    success: 'Thanks — your message is on its way.',
  });

  /* 2. Newsletter --------------------------------------------------------- */
  wireForm({
    form: document.getElementById('newsletter-form'),
    statusEl: 'newsletter-note',
    endpoint: '/api/newsletter',
    build: (fd) => ({ email: String(fd.get('email') || '').slice(0, 254) }),
    validate: (b) => (EMAIL_RE.test(b.email) ? null : 'Please enter a valid email address.'),
    pending: 'Subscribing…',
    success: 'You’re on the list. Thanks!',
  });

  /* 3. View counter ------------------------------------------------------- */
  const viewCountEl = document.getElementById('view-count');
  if (viewCountEl) {
    fetch('/api/views', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('view fetch failed'))))
      .then((data) => {
        const n = Number(data && data.views);
        if (Number.isFinite(n)) {
          viewCountEl.textContent = `${n.toLocaleString()} views`;
        } else {
          viewCountEl.style.display = 'none';
        }
      })
      .catch(() => { viewCountEl.style.display = 'none'; });
  }
})();
