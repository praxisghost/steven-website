/* ─────────────────────────────────────────────────────────────────────────────
 *  links.config.js — single source of truth for off-site project links.
 *
 *  While a side project has no public URL, leave url: '' — pages show
 *  "Coming soon" instead of a dead link. When it launches, paste the URL
 *  here; every page that loads site-links.js picks it up automatically.
 *  Nothing else needs editing.
 *  ────────────────────────────────────────────────────────────────────────── */

window.SITE_LINKS = {
  timeline: {
    label: 'World History Timeline',
    // Served by this site from public/timeline/ (a published copy of the
    // world-history-timeline repository; see public/timeline/timeline-build.json).
    url: '/timeline',
  },
  guitarSite: {
    label: 'Guitar Site',
    url: '',
  },
};
