# Design System — stevenlegg.xyz

Evolving design language. Locked after Phase 4 sign-off. Must be visibly distinct from `website` while preserving all content.

## Brand tone
Modern, confident, minimal, content-forward. Audience: prospective employers, collaborators, readers of a personal portfolio/blog.

## Reference aesthetic — proposals (first design run)
Pick one in Phase 4; both avoid manipulative dark patterns.

**Option A — "Editorial Minimal" (recommended).**
Generous whitespace, a strong serif display face for headings paired with a clean sans for body, restrained accent color, content-first reading column (~65ch). Rationale: maximizes legibility and a confident, writerly feel for a portfolio/blog; supports F-pattern scanning and clear visual hierarchy.

**Option B — "Technical Mono".**
Monospace accents, grid lines, terminal-inspired dark theme with a single bright accent. Rationale: signals engineering credibility; risk: can feel gimmicky and reduce reading comfort for long-form content.

Leaning Option A for content-forward goals; final choice + rationale logged in Phase 4.

## Palette (draft — to refine in Phase 4)
- Background: near-white `#FAFAF8` / dark mode `#0E0E10`
- Text: `#16161A` on light
- Accent: single hue, TBD (e.g. deep teal or warm amber) — one accent only (Hick's Law: limit choices/visual noise)

## Typography (draft)
- Display/headings: serif (e.g. Fraunces / Newsreader)
- Body: sans (e.g. Inter)
- Reading measure: ~60–70ch; scale via Tailwind type ramp.

## Spacing & layout (draft)
- 4/8px spacing scale (Tailwind defaults).
- Single content column for articles; card grid for index/portfolio with Gestalt proximity grouping.

## Visual-psychology rationale (running log)
- **Hick's Law:** minimal nav items, one accent color → faster decisions.
- **Gestalt (proximity/similarity):** group related guides/articles into cards.
- **F-pattern:** left-aligned headings, scannable lead paragraphs.
- **Visual hierarchy:** clear H1>H2 ramp, ample whitespace.
- **Fitts's Law:** large, easily-tapped nav/CTA targets, esp. mobile/foldable.

## Components (to build in Phase 4)
Nav, hero, article layout, guide card grid, footer, dark-mode toggle. Each documented here as built.

## Responsiveness targets
Desktop, iOS, Android, both Android foldable formats. WCAG AA contrast, Lighthouse ≥ 90 (perf + a11y).
