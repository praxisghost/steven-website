/* ─────────────────────────────────────────────────────────────────────────────
 *  script.js — site-wide enhancements
 *
 *  Contents:
 *    1. View counter            (About page only)
 *    2. Contact form            (Contact page only)
 *    3. Newsletter              (Contact page only)
 *    4. Back-link arrow wrap    (so CSS can style arrows distinctly)
 *
 *  Notes on safety:
 *    • All DOM writes use textContent — never innerHTML.
 *    • Listeners attach via addEventListener only.
 *  ────────────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  /* =========================================================================
   * 1. VIEW COUNTER
   * ===================================================================== */
  const viewCountEl = document.getElementById('view-count');
  if (viewCountEl) {
    fetch('/api/views', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('view fetch failed'))))
      .then((data) => {
        const n = Number(data && data.views);
        if (Number.isFinite(n)) {
          viewCountEl.textContent = `Total site views: ${n.toLocaleString()}`;
        } else {
          viewCountEl.style.display = 'none';
        }
      })
      .catch(() => {
        viewCountEl.style.display = 'none';
      });
  }

  /* =========================================================================
   * 2. CONTACT FORM
   * ===================================================================== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const fd = new FormData(contactForm);
      const body = {
        name:    String(fd.get('name')    || '').slice(0, 100),
        email:   String(fd.get('email')   || '').slice(0, 254),
        message: String(fd.get('message') || '').slice(0, 5000),
      };

      if (!body.name || !body.email || !body.message) {
        if (status) status.textContent = 'Please fill in all fields.';
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (status) status.textContent = 'Sending…';

      try {
        const res = await fetch('/api/contact', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(body),
        });
        if (res.ok) {
          if (status) status.textContent = 'Message sent! Thanks.';
          contactForm.reset();
        } else {
          let msg = 'Something went wrong. Try again.';
          try {
            const data = await res.json();
            if (data && typeof data.error === 'string') msg = data.error;
          } catch { /* keep default */ }
          if (status) status.textContent = msg;
        }
      } catch {
        if (status) status.textContent = 'Network error. Try again.';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* =========================================================================
   * 3. NEWSLETTER
   * ===================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('newsletter-status');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const email = String(new FormData(newsletterForm).get('email') || '').slice(0, 254);

      if (submitBtn) submitBtn.disabled = true;
      if (status) status.textContent = 'Subscribing…';

      try {
        const res = await fetch('/api/newsletter', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email }),
        });
        if (res.ok) {
          if (status) status.textContent = "Subscribed! You'll hear from me when something is worth sharing.";
          newsletterForm.reset();
        } else {
          let msg = 'Something went wrong. Try again.';
          try {
            const data = await res.json();
            if (data && typeof data.error === 'string') msg = data.error;
          } catch { /* keep default */ }
          if (status) status.textContent = msg;
        }
      } catch {
        if (status) status.textContent = 'Network error. Try again.';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* =========================================================================
   * 4. BACK-LINK ARROW WRAP
   * =====================================================================
   *  Each subpage has a back-link like `← Back` or `← Writing`. To give
   *  the arrow a slightly heavier visual weight in CSS without bolding
   *  the entire label, we wrap the leading arrow character in its own
   *  <span class="arrow">. CSS then targets that span only.
   * ===================================================================== */
  function wrapBackLinkArrows() {
    document.querySelectorAll('a.back-link').forEach((a) => {
      if (a.querySelector('.arrow')) return;       // already wrapped
      const text = a.textContent;
      const m = text.match(/^(\s*[←↑→↓])(.*)$/);
      if (!m) return;
      a.textContent = '';                          // safe; no untrusted HTML
      const span = document.createElement('span');
      span.className = 'arrow';
      span.textContent = m[1].trim();
      a.appendChild(span);
      a.appendChild(document.createTextNode(m[2])); // preserves spacing
    });
  }
  if (document.readyState !== 'loading') {
    wrapBackLinkArrows();
  } else {
    document.addEventListener('DOMContentLoaded', wrapBackLinkArrows);
  }
})();

