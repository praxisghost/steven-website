# Content Migration Map — /website → website-xyz

Phase 3 inventory of source content at `/Users/steven/Desktop/Web-Dev/website`.
Source stack is Express + TypeScript serving static HTML from `public/`; target is
Next.js App Router (`frontend/app/`). This map pairs each source content group with
its destination route + the migration approach. No content is dropped — items are
relocated, not rewritten. Visual design diverges per §4; copy/articles/photos preserved.

## Source overview (counts)
- 415 `.html`, 139 `.js` (legacy SRS/page scripts), in `public/`
- Images: ~110 photos under `public/img/**` (jpeg 81, jpg 32, png 23, svg 5)
- Audio: 2 `.mp3` (`public/audio/`)
- Markdown content: 54 `.md` under `content/` + `pages/`
- Data: `monthly-budget.xlsx`, `spending-log.xlsx`, csv/tsv (likely not public-facing)

## Primary navigation (from `public/index.html`)
Top-nav targets — each exists as a source page and maps 1:1 to a route:

| Source file (`public/`)      | Target route (`frontend/app/`)      | Approach |
|------------------------------|-------------------------------------|----------|
| index.html                   | `/` (page.tsx)                      | Rebuild home; port hero copy + section links |
| about.html (+ about.js)      | `/about/page.tsx`                   | Port prose; drop legacy JS |
| career.html                  | `/career/page.tsx`                  | Port prose |
| contact.html                 | `/contact/page.tsx`                 | Port links (linktr.ee/stevenlegg) |
| writing.html                 | `/writing/page.tsx`                 | Index → blog posts |
| art.html (+ art.js)          | `/art/page.tsx`                     | Gallery; port `public/img/**` |
| book-reviews.html            | `/book-reviews/page.tsx`            | Index → review pages |
| language-learning.html       | `/language-learning/page.tsx`       | Index → SRS guides (see below) |
| media.html                   | `/media/page.tsx`                   | Port; link audio |
| projects.html                | `/projects/page.tsx`               | Index → project pages |
| resources.html               | `/resources/page.tsx`               | Port links |
| sports.html                  | `/sports/page.tsx`                  | Port prose |
| misc.html                    | `/misc/page.tsx`                    | Port prose |

## Article / collection content
| Source group | Files | Target route | Approach |
|--------------|-------|--------------|----------|
| `public/blog/*.html` | 6 (e.g. june-1st-2026, may-2026-update, american-education-what-we-owe) | `/blog/[slug]` | Convert each to MDX/content entry; preserve dates in body |
| `public/projects/*.html` | 5 (ai, aquaponics, circuits, 501c-coop, visual-literary-arts) | `/projects/[slug]` | Port prose + images |
| `public/book-reviews/*.html` | 1 (midnight-library-matt-haig) + book-reviews.html index | `/book-reviews/[slug]` | Port |
| `public/self-improvement/*.html` | 1 (atomic-habits-james-clear) | `/self-improvement/[slug]` | Port |
| `public/retro-gaming/*.html` | 3 (gameboy-advance-sp, gamecube, ps2) | `/retro-gaming/[slug]` | Port + console photos (`public/img/retrogaming`) |
| `public/technology/*.html` | 21 (linux, macos, windows, foldable-phones, AI, etc.) | `/technology/[slug]` | Port; tech is content-heavy |
| `public/isms/*.html` | 104 (abolitionism … ) | `/isms/[slug]` | Bulk port; share a template; index page with search/filter |

## Language-learning SRS guides (largest group)
- 162 pages matching `public/*-from-*.html` across **56 target languages**
  (ainu, amharic, arabic, basque, cantonese, hawaiian, navajo, quechua, swahili,
  yoruba, zulu, cape-verdean-creole, haitian-creole, louisiana-french, …).
- Pattern: `{target}-from-{source}.html` + matching `{target}-srs-{src}.js`
  (e.g. `ainu-from-english.html` + `ainu-srs-en.js`).
- Markdown source-of-truth lives under `content/pronunciation-guides/` and
  `content/vocabulary/` (54 `.md`) + `pages/pronunciation-guides/`.
- Target: `/language-learning/[language]/[from]` dynamic route, generated from the
  `content/**` markdown (preferred — single source) rather than the 162 prebuilt HTML.
  SRS interactivity (the `*-srs-*.js`) becomes a React client component.
- **Decision:** migrate from `content/**` markdown, not generated HTML, to avoid
  duplicating 162 files. Treat HTML as reference/validation only.

## Localized mirrors (i18n)
- `public/io/`, `public/ia/`, `public/isv/`, `public/nov/` each mirror the full main
  nav (about/art/book-reviews/…) — these are translated/auxiliary-language editions
  (12 pages each). Defer to a Phase-4+ i18n task; map to Next.js `[locale]` routing
  later. Logged here so they are not lost. Translation specs already exist in source
  (`translation-*.md`, `translation-url-structure.md`).

## Static assets
- Photos: copy `public/img/**` → `frontend/public/img/**` (preserve subfolders:
  dogs, frogs, salamanders, polliwogs, guitar, aquaponic, retrogaming, technology,
  bookreviews, photos, months, playlists, misc, Politics, isms, criticisms).
- Audio: `public/audio/*.mp3` → `frontend/public/audio/`.
- Fonts: `public/fonts/*.woff2` (31) → `frontend/public/fonts/` or `next/font`.

## Out of scope for content migration (operational/source-of-truth files)
Root `*.md` planning/automation files (AUTONOMOUS_RULES, GRAPH_*, ISMS_*,
LANGUAGE_*, translation-*), `.xlsx` budgets, `tools/`, `scripts/`, `server.ts`,
`send-newsletter.ts` — these are build/ops tooling, not site content. Backend
behavior (newsletter, pg) is re-implemented in the Django phase, not ported as-is.

## Recommended migration order (feeds Phase 3 task checklist)
1. Home + 12 primary nav pages (small, high-visibility).
2. Blog (6) + projects (5) — flagship written content.
3. Technology (21) + isms (104) via shared template + index.
4. Language-learning guides from `content/**` markdown (dynamic route).
5. Photos/audio asset copy (can run alongside any step).
6. i18n mirrors (io/ia/isv/nov) — deferred.
