# Lighthouse audit — Phase-4 perf/SEO sign-off

Run with **Lighthouse** (mobile form factor, 390×844) driving headless **Chromium 148**
against the production `next build` standalone server. Categories: performance,
accessibility, best-practices, SEO.

## Scores

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| `/` (home)                              | **98** | **100** | **96** | **100** |
| `/blog/american-education-what-we-owe`  | **98** | **100** | **96** | **100** |

All four categories clear the ≥ 90 target on every page tested.

## Notes on sub-100 audits
- **best-practices 96** — the single deduction is `errors-in-console`: the browser logs
  one `503` for `/healthz`. That endpoint proxies the Django backend, which is **not running
  in the sandbox**, so it correctly returns 503; in production (backend up) it returns 200 and
  the error disappears. The `HealthBanner` already degrades gracefully. Not a code defect.
- **performance 98** — remaining items are Lighthouse "insight" audits (legacy-JS polyfills
  emitted by Next, render-blocking of the single CSS file). Acceptable; localhost perf is a
  floor, Railway's CDN/compression will match or beat it.

## Caveat
Localhost performance numbers are a conservative proxy; the authoritative perf check is the
live Railway URL (Phase 5). Accessibility (100 here, 0 axe violations across light/dark ×
mobile/desktop) and SEO (100) are host-independent and considered signed off.
