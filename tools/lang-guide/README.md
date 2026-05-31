# Language-Guide Generator

A small Node tool that scaffolds a complete language guide matching the deployed
site standard (reference: `public/swahili-from-english.html`).

Each run produces three things:

1. `public/[l2code]-from-[l1code].html` — the guide page (SRS widget + TOC + sections)
2. `public/[l2code]-srs-[l1code].js` — the SM-2 flashcard deck. The `WORDS` array is the
   **single source of truth**: it powers both the flashcard trainer and the on-page
   frequency table.
3. A patch to `public/language-guides.html` — inserts the hub `<li>` into the correct
   L1 group (alphabetically by `data-l2`), creating the group if it doesn't exist yet.
   The patch is **idempotent** — re-running won't duplicate the link.

## Usage

```bash
node tools/lang-guide/generate.js tools/lang-guide/specs/hawaiian-en.json
# multiple at once:
node tools/lang-guide/generate.js tools/lang-guide/specs/*.json
```

## Spec schema (JSON)

Required fields are marked ★. Everything else is optional with sensible defaults.

**Naming convention (important — four separate identifiers):**

- HTML file: `[l2slug]-from-[l1slug].html` → `swahili-from-english.html` (full words)
- SRS file: `[l2slug]-srs-[l1code].js` → `swahili-srs-en.js` (full L2 slug, short L1 code)
- localStorage `PAIR`: `[l2code]-[l1code]` → `sw-en` (both short codes)

| field | type | notes |
|---|---|---|
| `l2slug` ★ | string | full target-language slug for filenames/hub, e.g. `"swahili"`, `"hawaiian"` |
| `l2code` ★ | string | short target code for the `PAIR` key, e.g. `"sw"`, `"haw"` |
| `l1slug` ★ | string | full native-language word for the HTML filename + hub group, e.g. `"english"`, `"italian"` |
| `l1code` ★ | string | short native code for the SRS filename + `PAIR`, e.g. `"en"`, `"it"` |
| `l2Display` ★ | string | how the language is shown in the H1 / vocab column, e.g. `"Hawaiian"` |
| `l1Name` ★ | string | L1 in English for headers/comments, e.g. `"English"` |
| `l1Label` ★ | string | the `.lang-from` span text, e.g. `"for English speakers"` |
| `title` ★ | string | `<title>` text |
| `description` ★ | string | meta description, 140–160 chars |
| `hubGroup` ★ | string | `data-l1` value of the target L1 group, e.g. `"english"`, `"italian"` |
| `words` ★ | `[ [front, back], … ]` | the SRS deck / frequency list (~100 entries recommended) |
| `htmlLang` | string | `<html lang>`; defaults to `l1code` |
| `dir` | string | set `"rtl"` for Arabic/Persian/Hebrew scripts |
| `backLink` | string | back-link text; default `"← Language Guides"` |
| `h1` | string | H1 main text; defaults to `l2Display` |
| `intro` | object | `{ heading, paragraphs:[html…], whyHeading, why:[ [label,text]… ] }` |
| `grammarHtml` | string (HTML) | inner markup for the Grammar section |
| `pronunciationHtml` | string (HTML) | inner markup for the Pronunciation section |
| `writingHtml` | string (HTML) | optional; only emitted if present |
| `mistakes` | `[html, …]` | list items for Common Mistakes |
| `resources` | `[html, …]` | list items for Resources |
| `cultureHtml` | string (HTML) | inner markup for the Culture section |
| `related` | `[ [href,label], … ]` | Related Guides links (an "All language guides" link is appended automatically) |
| `*Heading` | string | override any section heading (`grammarHeading`, `cultureHeading`, …) |
| `hubLabel` | string | text shown in the hub link; default `l2Display` |
| `hubFlag` | string | emoji flag for the hub link |
| `hubIcon` | string | path to an SVG icon instead of an emoji, e.g. `"icons/ainu.svg"` |
| `hubSearch` | string | the `data-search` keywords for the hub filter |
| `hubL2` | string | the `data-l2` filter key; default `l2code` |
| `hubGroupHtml` | string (HTML) | only needed when creating a brand-new L1 group. Provide the full `<section class="l1-group" …>…<ul><!--ITEMS--></ul>…</section>` markup with the placeholder `<!--ITEMS-->` where the first `<li>` should go |

Section order on the page is fixed to match the site standard:
**SRS → Intro → Vocabulary → Grammar → Pronunciation → (Writing) → Mistakes → Resources → Culture → Related.**
Sections whose content is omitted are skipped, and both the numbering and the
table of contents adjust automatically.

## Conventions (keep consistent with the rest of the site)

- Tables: wrap in `<div class="table-scroll"><table class="lang-table">…</table></div>`.
- Notes / learner-error callouts: `<p class="lang-note">…</p>`.
- Resource level badges: `<span class="level-badge beginner|intermed|advanced|all-levels">…</span>`.
- Collapsible detail: `<details class="accordion"><summary>…</summary><div class="accordion-body">…</div></details>`.
- All SRS CSS lives in `style.css` (`.srs-*`) — never add inline widget styles.

See `specs/` for worked examples.
