# Language Guides — Progress

Tracks language guides produced by the autonomous runner. One guide per run.

Guide naming: `public/[target]-from-[source].html` (+ `[target]-srs-[sourcecode].js`, hub link).
Never target English. English guides (`*-learning.html`, `*-from-english.html`) are master templates.

---

## Completed (this autonomous track)

### 2026-06-01 — Spanish for Japanese speakers
- **Pair:** Spanish (target) ← Japanese (source) — `es` / `ja`
- **Files:** `public/spanish-from-japanese.html`, `public/spanish-srs-ja.js`, spec `tools/lang-guide/specs/spanish-ja.json`
- **Hub:** linked in the Japanese (`data-l1="japanese"`) group of `language-guides.html`
- **Deck:** 104 high-frequency cards (Español front / 日本語 back)
- **Sections:** 単語カード (SRS), Intro, Vocabulaire→基本単語, 基本文法, 発音, よくある間違い, 学習リソース (11), 文化と背景, 関連ガイド
- **Focus (Japanese-learner perspective):** SVO vs Japanese SOV, noun gender + articles (el/la/un/una) — both absent in Japanese, person-based verb conjugation, ser/estar, gustar (framed via Japanese 「〜が好き」), pretérito vs imperfecto, personal *a*; pronunciation leverages the near-identical 5-vowel system while targeting l/r distinction, no epenthetic vowels / final consonants, trilled rr, mobile stress.
- **Resources:** Japan-specific (NHK まいにちスペイン語, 小学館『西和中辞典』, 白水社, セルバンテス文化センター東京) plus RAE, WordReference, Dreaming Spanish, etc.
- **Method:** modelled on the English→Spanish master (`spanish-learning.html`) and the Romance reference spec `spanish-fr.json` for content, plus the Japanese-source style of `hawaiian-ja.json` (Japanese headings, kana glosses); rewritten from the Japanese learner's perspective, not translated. ~5,360 visible chars (vs ~2,411 for the closest Japanese-source reference, `hawaiian-from-japanese`).

### 2026-06-01 — Spanish for French speakers
- **Pair:** Spanish (target) ← French (source) — `es` / `fr`
- **Files:** `public/spanish-from-french.html`, `public/spanish-srs-fr.js`
- **Hub:** linked in the French (`data-l1="french"`) group of `language-guides.html`
- **Deck:** 104 high-frequency cards (Español front / Français back)
- **Sections:** Cartes (SRS), Intro, Vocabulaire, Grammaire, Prononciation, Erreurs fréquentes, Ressources (11), Culture, Guides associés
- **Focus:** ser/estar, por/para, the two pasts vs French imparfait/passé, personal *a*, gustar, rolled *r*, non-nasal vowels, FR↔ES false friends
- **Method:** modelled on the Romance-source reference `spanish-from-italian` (spec `spanish-it.json`); rewritten from the French learner's perspective, not translated.

---

## Selection state (priority languages as targets)

Priority order: Spanish, German, French, Japanese, Korean, Mandarin, Cantonese, Italian, Portuguese, Russian.

**Spanish** (target) existing sources: English, Cantonese, German, Italian, Mandarin, Russian, Turkish, French, **Japanese ✓ (new)**.
- Still missing (priority sources): Korean, Portuguese.

---

## Next recommended guide

**Spanish for Portuguese speakers** — `spanish-from-portuguese.html` (`es` / `pt`).
Rationale: Spanish is the highest-priority target; of its two remaining missing priority sources (Korean, Portuguese), Portuguese is by far the fastest and highest-quality build — Spanish and Portuguese are the closest of all Romance pairs, so transfer is enormous and the spec can model closely on the existing Romance-source references (`spanish-fr.json`, `spanish-it.json`), rewritten from the lusophone perspective (focus: false friends, ñ/nh, the b/v distinction Portuguese lacks, gostar de vs gustar, ser/estar overlap, vowel reduction differences). Korea ranks higher than Portugal on the raw priority list, but a Korean-source spec (Hangul glosses, very different grammar) is much heavier; Portuguese delivers a complete, high-quality guide in one run.

Strong alternative: **Spanish for Korean speakers** (`spanish-from-korean`) — finishes Spanish's priority-source set, but budget for the heavier Korean-source build (model on an existing `*-from-korean`/`*-ko` spec such as `hawaiian-ko.json`).
