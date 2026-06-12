# Content Inventory & Migration-Status Checklist — stevenlegg.xyz

Authoritative source→target audit. Source = `/website/public` (627 HTML) + `/website/content` (81 files) + assets. Target = `/website-xyz/frontend`. Generated run 38 (2026-06-12) by automated source-vs-migrated diff; supersedes the narrative in `CONTENT_MIGRATION_MAP.md` for completeness tracking.

**Status legend:** ✅ verified · 🟩 migrated (build-verified, not yet QA'd) · 🟨 in progress / partial · ⬜ pending · ⛔ intentionally omitted · ❓ needs verification

## Summary scorecard
| Area | Source items | Migrated | Pending/Partial |
|---|---|---|---|
| Primary nav + standalone pages | ~58 | ~48 | ~10 |
| Blog / Projects / Book-reviews / Retro-gaming | 19 | 19 | 0 |
| Writing sub-hubs (animals, criticisms, politics, questions, rhythm, shavian, tributes) | 7 | 7 | 0 |
| Technology (top + linux + software-tutorials) | 21 | 21 | 0 |
| -isms set | 306 | 306 (manifest) | 0 |
| Language: pronunciation guides | 67 md | 58 | ❓ 9 (re-check md→route delta) |
| Language: methods & tools | 9 | 9 | 0 |
| Language: con-lang guides | 8 | 7 (incl. **intergermanic, run 38**) | ⬜ 1 (kesin) |
| Language: famous linguists | 5 | 5 | 0 |
| **Language: SRS vocab trainers `*-from-*`** | **163 + 8 hubs** | **0** | **⬜ 171 (DOMINANT GAP)** |
| i18n constructed-lang mirror sites (io/ia/isv/nov) | 48 | 48 | 0 |
| Instrument resource pages | 4 (guitar/bass/mandolin/ocarina) | 1 (guitar) | ⬜ 3 |
| Media sub-pages (music/audio/video/photos/playlists) | 5 | consolidated into /media | 🟨 verify parity |
| Image asset folders | 19 | 17 | ⬜ 2 (`bass-guitar`, `linguists`) + `anki-images` |

---

## 1. DOMINANT GAP — SRS vocabulary trainers (⬜ pending, multi-run)
The single largest unmigrated feature. Source ships **163 `*-from-*.html`** interactive spaced-repetition vocabulary trainers (target-language *from* a source language), backed by **125 `*-srs-*.js`** datasets, plus **8 `*-learning` hub pages** (`cantonese/german/german-tr/mandarin/spanish/turkish/turkish-de` + master `language-learning.html`) and the master index `language-guides.html` (53 KB).

Coverage by target language (variant count): german 13, spanish 10, cantonese 8, turkish 7, french 7, vietnamese 6, ukrainian 6, farsi 5, ainu 5, zulu/xhosa/quechua 4, +~40 more at 1–3 each (56 target languages total).

**Functional Divergence (needs human approval):** these are client-side flashcard apps using browser storage for SRS scheduling. Target plan: one generic `SrsTrainer` client component (Next.js) + migrate each `*-srs-*.js` dataset to JSON under `content/language-learning/srs/<target>/<source>.json`, routed at `/language-learning/<target>/from-<source>`. Preserves inbound `*-from-*.html` slugs via redirects. WCAG: keyboard-operable cards, no color-only state. Flagged HIGH-effort, not a deploy blocker — the rest of the site is deployable without it.

## 2. Primary nav + standalone pages
| Source page | Target | Status |
|---|---|---|
| index/about/contact/art/sports/misc/resources | `/`,`/about`,`/contact`,`/art`,`/sports`,`/misc`,`/resources` | 🟩 |
| blog + 6 posts / projects + 5 / book-reviews + 3 / retro-gaming + 3 | corresponding routes | 🟩 |
| career / career-interests / career-learn | `/career` (+ interests, learn) | 🟩 |
| media (+ playlists/photos via galleries) | `/media` | 🟨 verify music/audio/video/playlists parity |
| writing + 7 sub-hubs | `/writing/*` | 🟩 |
| technology + 20 sub | `/technology/*` | 🟩 |
| self-improvement | `/self-improvement` | 🟩 |
| language-learning + methods/con-lang/pronunciation/famous-linguists | `/language-learning/*` | 🟩 |
| guitar | `/resources/guitar` (interactive) | 🟩 |
| **bass** (19.7 KB prose) | — | ⬜ pending |
| **mandolin** (1.7 KB), **ocarina** (0.7 KB) stubs | — | ⬜ pending (small) |
| **kesin** (54 KB con-lang guide) | — | ⬜ pending → con-lang |
| **intergermanic** (49 KB con-lang guide) | `/language-learning/con-lang/intergermanic` | 🟩 **run 38** |
| music/audio/video.html (≤1.2 KB stubs) | folded into /media | ❓ verify |
| photos.html / playlists.html (real galleries) | /media galleries | 🟨 partial — confirm all images/playlists present |
| steven.html (588 B) | — | ⛔ omit candidate (duplicate of /about) — confirm |
| GUIDE-TEMPLATE.html | — | ⛔ intentionally omitted (build template) |
| language-guides.html / language-methods.html | hub index | ❓ tied to SRS gap (item 1) |

## 3. Assets
| Source | Target | Status |
|---|---|---|
| `img/` 19 folders, 25 MB | `public/img/` 17 folders | 🟨 missing `bass-guitar`, `linguists` |
| `audio/` 9 MB | `public/audio/` 9 MB | 🟩 |
| `anki-images/` 3.6 MB | — | ⬜ pending (referenced by anki-guide/anki-cloze methods pages) |
| `downloads/` 56 KB | `public/downloads/` 28 KB | 🟨 verify which downloads missing |

## 4. Already complete (✅/🟩 — no action)
isms (306), i18n mirrors (48), famous-linguists (5), methods (9), technology (21), blog/projects/book-reviews/retro-gaming (19), writing sub-hubs (7), pronunciation guides (58).

## 5. Unresolved References
- `anki-guide.html` / `anki-cloze-cards.html` reference images under `anki-images/` not yet copied → migrate folder before QA, else broken `<img>`. Best-guess placeholder: keep alt text; no build break (text already migrated).
- `bass.html` references `img/bass-guitar/*` (folder absent in target).
- `famous-linguists` pages reference `img/linguists/*` (folder absent in target) — verify hero/portrait rendering.
- `steven.html`, `language-guides.html` purpose ambiguous → confirm intent before omit/redirect.

## 6. Recommended next-run order (highest impact first)
1. Copy missing asset folders (`img/bass-guitar`, `img/linguists`, `anki-images`, remaining downloads) — low-risk, fixes latent broken images. ✅ unblocked.
2. Migrate `kesin` + `bass`/`mandolin`/`ocarina` (4 bounded static pages). ✅ unblocked.
3. Verify `/media` parity vs music/audio/video/photos/playlists; fill any gap. ✅ unblocked.
4. SRS trainer feature (item 1) — scaffold generic component + migrate datasets in batches by target language. ⬜ large, log Functional Divergence.
5. Phase 5 Railway deploy. 🔴 HIGH / user-gated.
