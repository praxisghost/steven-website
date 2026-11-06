/* ─────────────────────────────────────────────────────────────────────────────
 *  site-links.js — progressive enhancement for side-project links.
 *
 *  Pages mark a link slot with data-site-link="<key in links.config.js>".
 *  The markup's default text is the honest one ("Coming soon…"), shown
 *  as-is when the config has no URL. When a URL exists, this script
 *  swaps the placeholder text for a real link (its text is the slot's
 *  data-site-link-text, or the address). Without JavaScript,
 *  readers just see the "Coming soon" text.
 *
 *  Safety notes:
 *    • DOM writes use textContent / createElement — never innerHTML.
 *    • URLs come only from links.config.js, served same-origin.
 *  ────────────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  const links = window.SITE_LINKS || {};

  document.querySelectorAll('[data-site-link]').forEach((el) => {
    const entry = links[el.getAttribute('data-site-link')];
    if (!entry || !entry.url) return; // no URL yet — keep "Coming soon"

    const a = document.createElement('a');
    a.href = entry.url;
    // data-site-link-text lets a slot choose its wording; otherwise show the address.
    a.textContent = el.getAttribute('data-site-link-text') || entry.url.replace(/^https?:\/\//, '');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    el.textContent = '';
    el.appendChild(a);
  });
})();
