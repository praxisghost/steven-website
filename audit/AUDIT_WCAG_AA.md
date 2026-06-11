# In-situ WCAG-AA Audit — Phase 4 sign-off (run 35)

Automated accessibility audit of the real built site, run with **axe-core 4.x** driving
**headless Chromium 148** against the production `next build` output (standalone server),
across **2 themes × 2 viewports**. This is the reproducible, environment-independent half of
the Phase-4 sign-off (Lighthouse *performance* is deferred to the real Railway deploy, where
network/CPU are representative — localhost perf numbers in a constrained sandbox are not).

## Method
- Harness: `audit.mjs` — boots `.next/standalone/server.js`, sets `localStorage.theme` via
  `addInitScript` (so the no-FOUC theme script applies `.dark` pre-paint), loads each page to
  `networkidle`, runs axe with tags `wcag2a, wcag2aa, wcag21aa`.
- Viewports: mobile **390×844**, desktop **1366×900**. (Foldable formats share the mobile
  layout breakpoint verified at run 24; the ≤390px column covers the Fold cover screen.)
- Representative pages (cover every shared component + the highest-risk surfaces):
  `/` (home/footer), `/contact` (form controls), `/technology/linux/arch` (table-heavy),
  `/resources/guitar` (interactive Web-Audio widget), `/blog` (index), `/language-learning/pronunciation` (search/IPA).

## Findings (before fix)
1. **`link-in-text-block` (serious)** — sitewide, 1–2 nodes/page. The shared `SiteFooter`
   `linktr.ee/stevenlegg` link (and the `/contact` inline copy) used `text-accent hover:underline`:
   accent `#0F766E` vs surrounding muted text `#6B6B72` = **1.03:1**, below the 3:1 needed to
   distinguish a link by colour alone (WCAG **1.4.1 Use of Color**).
2. **`color-contrast` (serious)** — `/resources/guitar` only. `.note-interval` Roman numerals +
   `.notation-label` were `#A8A8A2` on `#FAFAF8` = **2.28:1** (WCAG **1.4.3**). In **dark** theme
   the widget was worse (9 nodes): it is a light-designed card with transparent containers, so its
   dark-on-light text fell onto the dark page background `#0E0E10` (note-name/interval **3.64:1**,
   the Play/Melody buttons **1.7:1**).

## Fixes (real source, 3 files)
- `SiteFooter.tsx` + `app/contact/page.tsx`: inline content links `hover:underline` →
  `underline underline-offset-2` (always underlined → distinguishable by more than colour).
- `GuitarGuide.tsx`: `.note-interval` / `.notation-label` `#A8A8A2` → `#6B6B72` (~5:1); and pinned
  `.scale-player` / `.notation-wrap` to their intended light surface `background:#FAFAF8` so the
  widget renders as a self-contained light card in **both** themes (same palette already verified
  clean in light mode) — no separate dark palette needed.

## Result (after fix)
| Theme | Viewport | WCAG-AA violations |
|-------|----------|--------------------|
| light | desktop  | **0** |
| dark  | desktop  | **0** |
| light | mobile   | **0** |
| dark  | mobile   | **0** |

Raw axe output per combo: `axe-{light,dark}-{desktop,mobile}.json` (this folder).
Production build GREEN (503/503 static pages) on both audit builds.

## Still outstanding for full Phase-4 sign-off
- **Lighthouse perf + a11y ≥ 90**: run against the live Railway URL (or a run with network/CPU
  parity). Accessibility is now evidence-clean here; performance needs a representative host.
- Then lock `DESIGN_SYSTEM.md` and proceed to Phase 5 (Railway deploy — HIGH, user-gated).
