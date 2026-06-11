# Design System — stevenlegg.xyz  🔒 LOCKED (Phase 4 sign-off, 2026-06-11, run 36)

Final design language. **Locked** after the Phase-4 sign-off: WCAG-AA verified (axe-core, 0
violations across light/dark × mobile/desktop), Lighthouse mobile **a11y 100 / SEO 100 /
best-practices 96 / performance 98** on home and article pages. Changes after lock require an
explicit unlock note here. Visibly distinct from the source `website` while preserving all content.

## Chosen aesthetic — **Option A, "Editorial Minimal"**
Generous whitespace, a serif display face paired with a clean sans for body, a single restrained
accent, content-first reading column (~65ch). Chosen over "Technical Mono" (B) because the site is
content-forward (portfolio + long-form writing) where reading comfort and a confident, writerly feel
matter more than engineering signalling; B's terminal styling risked feeling gimmicky for prose.

## Palette (locked — channel triplets live in `app/globals.css`, mapped in `tailwind.config.ts`)
Tokens use `rgb(var(--color-*) / <alpha-value>)` so Tailwind opacity modifiers work; `.dark` on
`<html>` swaps the whole palette (no per-component `dark:` churn).

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `bg` | `#FAFAF8` | `#0E0E10` | page background |
| `ink` | `#16161A` | `#ECECEA` | primary text |
| `ink-soft` | `#3A3A40` | `#B8B8B5` | secondary text |
| `muted` | `#6B6B72` | `#8A8A90` | tertiary / captions |
| `hairline` | `#E6E6E1` | `#2A2A2E` | decorative borders/dividers |
| `field` | `#86868C` | `#6E6E74` | **interactive** input borders (≥3:1, WCAG 1.4.11) |
| `accent` | `#0F766E` | `#2DD4BF` | single accent (links, active state) — lifted on dark for AA |
| `accent-soft` | `#14B8A6` | `#5EEAD4` | subtle accent fills |

Contrast (verified, runs 31/32/35): all body/secondary/muted/accent text ≥ 4.5:1; UI boundaries
(`field`, accent focus ring) ≥ 3:1; both themes. Accent buttons use `text-bg` (not white) for AA.

## Typography (locked)
- Display/headings: **Newsreader** (serif), `--font-display`.
- Body: **Inter** (sans), `--font-body`.
- Reading measure ~60–70ch (`max-w-content`); Tailwind type ramp; clear H1>H2>H3 hierarchy.

## Spacing & layout (locked)
- 4/8px Tailwind scale. Single content column for articles; Gestalt-proximity card grids for hubs.
- Responsive nav: inline at `lg+`, hamburger disclosure below (Fitts-sized full-width rows).

## Brand assets (run 36)
- Favicon: `app/icon.svg` (teal `#0F766E` rounded square, cream `SL` monogram) + PNG `icon-192/512`,
  `apple-icon`. Manifest theme color `#0F766E`, background `#FAFAF8`.
- Social card: `public/og-default.png` (1200×630, monogram + name + tagline), referenced by every
  page's Open Graph/Twitter metadata.

## Visual-psychology rationale (final)
- **Hick's Law:** one accent, lean nav, A–Z grouped/searchable indexes → faster decisions.
- **Gestalt (proximity/similarity):** related guides/articles grouped into cards.
- **F-pattern:** left-aligned headings, scannable lead paragraphs.
- **Visual hierarchy:** serif display ramp + ample whitespace.
- **Fitts's Law:** large tap targets, full-width mobile/foldable nav rows.
- **Non-colour cues (WCAG 1.4.1):** inline content links are underlined, not colour-only.

## Components (as built)
`SiteHeader` (responsive disclosure nav, `aria-current`, focus ring), `SiteFooter` (no-ads
statement + linktree + locale switcher), `PageHeader`, `HubGrid`/`Group` (card grids),
`ArticleBody` (h2/h3/p/li/quote/table), `Gallery` (`next/image`, no CLS), `ThemeToggle`
(`aria-pressed`, no-FOUC init), `HealthBanner` + `ErrorState`/`error.tsx`/`not-found.tsx`
(branded, Request-ID surfaced), `GuitarGuide` (interactive, self-contained light card both themes).

## Responsiveness & quality bar (met)
Desktop, iOS, Android, both Android foldables (≤390px column covers Fold cover screen). WCAG AA ✅,
Lighthouse ≥ 90 ✅ (a11y/SEO/best-practices/perf all ≥ 96 on localhost; live-Railway perf is the
final confirmation in Phase 5).
