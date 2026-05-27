# Language Guides — Architecture & Scalability Design

*Last updated: 2026-05-26*

---

## Overview

The language-guides section is a flat HTML/CSS/JS system designed to scale to 100+ language pairs without a build pipeline, database, or server-side templating. Every guide is a self-contained HTML file. Shared UI (typography, SRS widget, RTL layout) lives entirely in `style.css`. Navigation and discovery are handled by a single data-driven JS block in `language-guides.html`.

---

## File naming convention

```
[l2]-from-[l1].html
```

Where `l1` = the **writing language** (the speaker's native language) and `l2` = the **target language** being learned.

| Component | Values |
|-----------|--------|
| `l2` | cantonese, german, mandarin, spanish, turkish, vietnamese, farsi, punjabi, ukrainian, … |
| `l1` | english, mandarin, cantonese, german, turkish, spanish, persian, punjabi, ukrainian, vietnamese, french, japanese, russian, … |

**Examples:**
```
german-from-russian.html     ← German guide for Russian speakers
cantonese-from-spanish.html  ← Cantonese guide for Spanish speakers
vietnamese-from-farsi.html   ← Vietnamese guide for Persian speakers
```

**Legacy names** (English L1 only, avoid for new guides):
```
german-learning.html         ← same as german-from-english.html
turkish-learning.html        ← same as turkish-from-english.html
german-learning-tr.html      ← same as german-from-turkish.html (deprecated dash-code suffix)
```

---

## Guide data schema

All guide metadata lives in the `GUIDES` array inside `language-guides.html`. When you add a new guide file, add a corresponding entry to this array — no other file needs to change for the guide to appear in the navigation.

```javascript
// [filename, l1Key, l2Key]
['german-from-russian.html', 'ru', 'de'],
```

**L1 keys** (defined in `L1S` object):
```
en  mnd  yue  de  tr  es  fa  pa  uk  vi  fr  ja  ru
```

**L2 keys** (defined in `L2S` object):
```
yue  de  mnd  fa  pa  es  tr  uk  vi
```

To add a new language (L1 or L2), add an entry to the appropriate object in `language-guides.html` with:
- `name` — English name
- `native` — Native-script name
- `flag` — Flag emoji
- `script` — Script family identifier (`latin`, `cjk`, `cyrillic`, `arabic`, `gurmukhi`, `japanese`)
- `family` — Language family (`Germanic`, `Sino-Tibetan`, `Turkic`, `Romance`, `Slavic`, `Iranian`, `Indo-Aryan`, `Austroasiatic`, `Japonic`, …)
- `diff` — Difficulty for an average learner (1–5 scale, calibrated for this L1→L2 pair)
- `rtl` — `true` if the language is written right-to-left (L1 object only)

---

## HTML page structure

Every guide follows this section order (see `GUIDE-TEMPLATE.html` for the full commented template):

| # | Section ID | Required? | Notes |
|---|-----------|-----------|-------|
| 1 | `#srs` | Required | SRS flashcard widget at top |
| 2 | `#intro` | Required | L2 overview, motivational framing |
| 3 | `#difficulty` | Required | L1-specific advantages + challenges |
| 4 | `#pronunciation` | Required | Anchored to L1 phonology |
| 5 | `#grammar` | Required | Contrastive table + accordions |
| 6 | `#writing` | Required if scripts differ | Omit if L1 and L2 share a script |
| 7 | `#mistakes` | Required | L1-interference errors only |
| 8 | `#resources` | Required | Validated L1→L2 resources |
| 9 | `#media` | Required | Labelled by subtitling language |
| 10 | `#strategy` | Required | Stage-by-stage, L1-specific |
| 11 | `#cultural` | Required | L1-perspective cultural framing |
| 12 | `#related` | Required | Same-L1 + same-L2 guide links |
| — | `#tones` | Optional | For tonal L2 or L1 |
| — | `#cases` | Optional | When case systems differ |
| — | `#family` | Optional | Historical relationship |
| — | `#shared-vocab` | Optional | Cognates, loanwords |
| — | `#diglossia` | Optional | Formal/colloquial split |
| — | `#script-transition` | Optional | Multi-script or mid-course shift |

---

## CSS architecture

`style.css` is the single stylesheet for the entire site. Language-guide-specific sections are clearly demarcated:

| CSS section | Purpose |
|-------------|---------|
| `LANGUAGE LEARNING PAGES` | `.lang-section`, `.lang-toc`, `.lang-note`, `.lang-table`, `.canto-block`, `.level-badge`, `.accordion` |
| `SRS FLASHCARD WIDGET` | All `.srs-*` classes — shared across every SRS-enabled guide |
| `RTL LAYOUT` | `html[dir="rtl"]` overrides for Persian-written pages |
| `MULTILINGUAL TYPOGRAPHY` | `:lang()` font stacks for Arabic, Gurmukhi, CJK, Japanese, Cyrillic, Vietnamese |

**Rule: No inline `<style>` blocks on guide pages.** Every visual pattern must live in `style.css`. The only permitted page-level style is the Shavian font `@font-face` on `shavian-english.html`.

---

## RTL pages

Pages written in Persian (Farsi) use `<html lang="fa" dir="rtl">`. The RTL layout (text alignment, back-link direction, table alignment, SRS meta bar reversal) is handled entirely by `html[dir="rtl"]` selectors in `style.css`. No additional inline CSS is needed.

**Current RTL guide pages:**
- `cantonese-from-farsi.html`
- `turkish-from-farsi.html`
- `vietnamese-from-farsi.html`
- `german-from-persian.html`

**Pages written *about* Farsi (but in other languages):**
- `farsi-from-cantonese.html` — written in Traditional Chinese
- `farsi-from-german.html` — written in German
- `farsi-from-punjabi.html` — written in Punjabi
- `farsi-from-spanish.html` — written in Spanish
- `farsi-from-turkish.html` — written in Turkish

---

## SRS system

Each SRS widget is a standalone JS file following the naming pattern:

```
[l2]-srs-[l1].js         german-srs-es.js, turkish-srs.js
[l2]-srs-[l1code].js     german-srs-zht.js (zh-Hant = Traditional Chinese)
```

The JS files embed a word list and the SM-2 spaced-repetition algorithm. Progress is persisted in `localStorage` keyed by the language pair. The CSS for the widget lives in `style.css` under `.srs-*`.

**Note:** The `.srs-turkish` class (the front-of-card prompt) is named for historical reasons. Despite the name, it styles the target-language word on any guide's SRS widget.

---

## Adding a new guide — checklist

```
[ ] Create [l2]-from-[l1].html using GUIDE-TEMPLATE.html as the base
[ ] Set html[lang] to the BCP-47 code for L1 (writing language)
[ ] Set html[dir="rtl"] if L1 is RTL (Persian, Arabic, Urdu, etc.)
[ ] Set <title> in format: [L2 name] ([L1 speaker label]) — Steven Legg
[ ] Set back-link text in L1 (see BACK-LINK TRANSLATIONS in template)
[ ] Place lang-from span INSIDE the h1 (never as a sibling element)
[ ] Fill all 12 required sections in L1 (not English as intermediary)
[ ] Validate every resource actually supports this L1→L2 pair
[ ] Label bridge-language resources (e.g. "English bridge required")
[ ] Create or reuse an SRS script [l2]-srs-[l1].js if needed
[ ] Add the guide to the GUIDES array in language-guides.html
[ ] Add the guide to the appropriate l1-group in language-guides.html
     (the JS renders it automatically once the GUIDES array is updated)
```

---

## Back-link translations

| L1 | Text | Notes |
|----|------|-------|
| English | `← Language Guides` | |
| Mandarin (Simplified) | `← 语言学习指南` | zh-Hans pages |
| Mandarin / Cantonese (Traditional) | `← 語言學習指南` | zh-Hant pages |
| German | `← Sprachlernführer` | |
| Turkish | `← Dil Rehberleri` | |
| Spanish | `← Guías de idiomas` | |
| Persian | `← راهنماهای زبان` | RTL — arrow renders correctly in RTL context |
| Punjabi | `← ਭਾਸ਼ਾ ਗਾਈਡਾਂ` | |
| Ukrainian | `← Мовні посібники` | |
| Vietnamese | `← Hướng dẫn ngôn ngữ` | |
| French | `← Guides linguistiques` | |
| Japanese | `← 言語ガイド` | |
| Russian | `← Языковые гиды` | |

---

## Scalability notes

The current flat-file architecture supports ~200 language pairs comfortably before any tooling is needed. At that scale, consider:

1. **Static site generator** — A simple Node/Python script that stamps guide data into `GUIDE-TEMPLATE.html` would allow batch creation while preserving the "no build pipeline" principle for edits.

2. **JSON guide manifest** — Externalise the `GUIDES`, `L1S`, and `L2S` objects from `language-guides.html` into a `guides-data.json` file fetched at runtime. This keeps the navigation HTML clean and the data single-source-of-truth.

3. **Per-script font loading** — Once the guide count passes ~50, consider lazy-loading script fonts (Gurmukhi, Naskh) via `FontFace` API only on pages with that script, rather than relying on `:lang()` font stacks that don't trigger downloads.

4. **Difficulty ratings** — The 1–5 difficulty scale in `L2S` is currently based on FSI estimates for average L1 speakers. A more accurate system would store per-pair difficulty as `[l1][l2]` keys (e.g. `difficulty['tr']['de'] = 2.5` since Turkish and German share some structural parallels).

5. **Search index** — The current JS search concatenates all metadata strings for each guide. For 100+ guides, consider a pre-built inverted index (e.g. `FlexSearch` or a simple trie) for sub-millisecond search response.

---

## Priority expansion targets (Phase 8)

**New L1 groups:**

| L1 | Rationale |
|----|-----------|
| Russian | Large speaker population; Slavic-to-Germanic transfer is rich contrastive territory |
| French | Major L1 for German/Spanish learners; Romance cognate patterns |
| Japanese | Japanese→German and Japanese→Cantonese pairs are underserved |

**New target languages (L2):**

| L2 | Difficulty | Script | Notes |
|----|-----------|--------|-------|
| Cantonese (expanded) | 5 | CJK | Already exists; expand L1 coverage |
| Ukrainian | 3 | Cyrillic | High demand post-2022; Slavic L1 transfer |
| Punjabi | 3 | Gurmukhi / Shahmukhi | Dual-script complexity |
| Persian | 3 | Nastaliq | RTL; strong demand from Turkic/Arabic L1 speakers |
| Navajo | 5 | Latin | Athabaskan; tonal; polysynthetic — rare resource space |
| Ainu | 5 | Katakana / Latin | Endangered; almost no L1-specific resources exist |
