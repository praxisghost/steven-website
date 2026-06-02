# Language Guides — Progress

Tracks language guides produced by the autonomous runner. One guide per run.

Guide naming: `public/[target]-from-[source].html` (+ `[target]-srs-[sourcecode].js`, hub link).
Never target English. English guides (`*-learning.html`, `*-from-english.html`) are master templates.

---

## Completed (this autonomous track)

### 2026-06-02 — German for Italian speakers
- **Pair:** German (target) ← Italian (source) — `de` / `it`
- **Files:** `public/german-from-italian.html`, `public/german-srs-it.js`
- **Hub:** linked in the Italian (`data-l1="italian"`) group of `language-guides.html` (alphabetically after Spagnolo, as Tedesco = T)
- **Deck:** 105 high-frequency cards (Deutsch front / Italiano back)
- **Sections:** Flashcard (SRS), Che cos'è il tedesco? (intro), Vocabolario di base Top 100 (vocab table), Grammatica essenziale (grammar incl. 26-row example-sentence table), Pronuncia, Errori comuni degli italofoni (9 errors), Risorse per imparare (11 resources), Cultura e contesto, Guide correlate
- **Focus (Italian-learner perspective, Romance source):** Three genders vs Italian two — the neuter (das) must be memorised with every noun; 4-case declension linked to Latin school background (concept not alien, but articles change rather than noun endings in modern Italian); V2 word order in main clause vs Italian flexible SVO; verb-final subordinate clauses (dass/weil/wenn/als) — completely absent from Italian; separable verbs (trennbare Verben) with no Italian equivalent; false friends table: Gift (veleno), bald (presto), Brief (lettera), fast (quasi), Mist (letame), Rock (gonna), Rat (consiglio), See (lago/mare). sein vs haben as Perfekt auxiliaries (similar to Italian avere/essere but with different assignment rules). Compound words (Komposita) explained by decomposition strategy.
- **Pronunciation focus:** ö /ø/ and ü /y/ absent from Italian — lip-rounding exercises; ich-Laut [ç] vs ach-Laut [x]; uvular r [ʁ] vs Italian trill; w=[v] framed as advantage for Italians (same as Italian v); v=[f] counterintuitive; z=[ts] mapped to Italian pizza/tazza; sch=[ʃ] mapped to Italian sc+i; word-initial sp/st = [ʃp]/[ʃt]; ß as long /s/.
- **Resources:** Italy-specific (Goethe-Institut Italia with 8 city branches, Pons.it DE-IT dictionary, Langenscheidt DE-IT, Hueber Verlag grammatica in italiano, DW Nicos Weg, Duolingo IT interface, Babbel IT interface) plus Easy German YouTube, German with Jenny, Slow German podcast, iTalki (11 total).
- **Method:** modelled on `german-from-spanish.html` for a Romance-source perspective and `spanish-from-italian.html` for Italian-language structure and section headings; content rewritten from the Italian learner's perspective, not translated. False friends section covers 8 pairs specific to the IT-DE pair.

### 2026-06-02 — German for Korean speakers
- **Pair:** German (target) ← Korean (source) — `de` / `ko`
- **Files:** `public/german-from-korean.html`, `public/german-srs-ko.js`
- **Hub:** linked in the Korean (`data-l1="korean"`) group of `language-guides.html` (alphabetically before 스페인어, after 제주어)
- **Deck:** 105 high-frequency cards (Deutsch front / 한국어 back)
- **Sections:** 단어 카드 (SRS), 독일어란? (intro), 기본 단어 Top 100 (vocab table), 기본 문법 (grammar incl. 26-row example-sentence table), 발음, 한국어 화자가 자주 하는 실수 (9 mistakes), 학습 자료 (11 resources), 문화와 배경, 관련 안내
- **Focus (Korean-learner perspective, non-Germanic source):** V2 word order in Hauptsatz vs SOV in Nebensatz (the Nebensatz SOV pattern feels natural to Korean speakers); grammatical gender (der/die/das — absent in Korean, must memorise with article); 4-case declension mapped to Korean particles (이/가 = Nom, 을/를 = Akk, 에게 = Dat, 의 = Gen) as the key conceptual bridge; person-based verb conjugation with full machen table (Korean verbs don't inflect for person); sein vs haben as auxiliary choice; compound words (Komposita) parallel to Korean compound nouns; Sie vs du framed as simpler than Korean honorific system.
- **Pronunciation focus:** ö/ü (absent in Korean — lip-rounding drills); uvular r vs Korean ㄹ; ich-Laut [ç] vs ach-Laut [x]; consonant clusters (Korean CV structure prompts vowel insertion); word-initial sp/st = [ʃp]/[ʃt]; w=[v] and v=[f] not mapping to Korean equivalents.
- **Resources:** Korea-specific (주한 독일문화원 Goethe-Institut Korea, 네이버 독일어사전, DW Nicos Weg 한국어판) plus Easy German YouTube, German with Jenny, Duolingo, iTalki, Anki, DW learning hub, PONS, TestDaF (11 total).
- **Method:** modelled on `german-from-japanese.html` for non-Germanic source structure; Korean headings and Hangul glosses throughout; case-system explained via Korean particle analogy; rewritten from Korean learner's perspective, not translated. ~21,000 bytes HTML, comparable to the Japanese guide (~22,102 bytes).

### 2026-06-01 — Spanish for Korean speakers
- **Pair:** Spanish (target) ← Korean (source) — `es` / `ko`
- **Files:** `public/spanish-from-korean.html`, `public/spanish-srs-ko.js`, spec `tools/lang-guide/specs/spanish-ko.json`
- **Hub:** linked in the Korean (`data-l1="korean"`) group of `language-guides.html` (alphabetically after jejueo, before end of list)
- **Deck:** 104 high-frequency cards (Español front / 한국어 back)
- **Sections:** 단어 카드 (SRS), Intro, 기본 단어 Top 100 (vocab table), 기본 문법 (grammar incl. 26-row example-sentence table), 발음, 한국어 화자가 자주 하는 실수 (9 mistakes), 학습 자료 (11 resources), 문화와 배경, 관련 안내
- **Focus (Korean-learner perspective, non-Romance source):** SVO vs Korean SOV; grammatical gender + articles (el/la, un/una) — both absent in Korean; person-based verb conjugation (hablar table, absent in Korean); ser vs estar (한국어 이다/있다 splits into two); gustar framed via 「커피가 마음에 든다」(target-as-subject) rather than 좋아하다; pretérito vs imperfecto (Korean resolves this by context alone); personal *a* (absent in Korean); l/r distinction (both rendered as ㄹ in Korean); consonant clusters / no epenthetic vowels; trilled rr; the jota /x/; b/v identity; stress accent.
- **Resources:** Korea-specific (EBS 외국어 강좌, 네이버 스페인어사전, 세르반테스 문화원 서울) plus RAE, WordReference, Dreaming Spanish, News in Slow Spanish, RTVE, Coffee Break Spanish, Duolingo, iTalki (11 total).
- **Method:** modelled on the Japanese-source spec `spanish-ja.json` for non-Romance structure + the Korean-source style of `hawaiian-ko.json` / `jejueo-korean.json` (Korean headings, Hangul glosses). Rewritten from the Korean learner's perspective, not translated. ~23,924 bytes HTML — comparable to the Japanese guide.



### 2026-06-01 — Spanish for Portuguese speakers
- **Pair:** Spanish (target) ← Portuguese (source) — `es` / `pt`
- **Files:** `public/spanish-from-portuguese.html`, `public/spanish-srs-pt.js`, spec `tools/lang-guide/specs/spanish-pt.json`
- **Hub:** linked in the Portuguese (`data-l1="portuguese"`) group of `language-guides.html` (alphabetical, between shona and swahili)
- **Deck:** 106 high-frequency cards (Español front / Português back)
- **Sections:** Cartões (SRS), Intro, Vocabulário (Top 100), Gramática essencial (incl. a 26-row Español→Português example-sentence table), Pronúncia, Erros comuns, Recursos (11), Cultura, Guias associados
- **Focus (lusophone-learner perspective, closest Romance pair):** the "portunhol" trap — false friends (exquisito, largo, presunto, vaso, todavía, rato, oficina, borracha, brincar, cena); gustar vs *gostar de* (inverted construction, no *de*); muy vs mucho (Portuguese "muito" splits in two); the personal *a* (absent in Portuguese); pretérito/imperfecto mapping cleanly to PT perfeito/imperfeito, but *he comido* ≠ "tenho comido"; the future subjunctive Portuguese keeps but Spanish lost (*quando chegares* → *cuando llegues*); fewer contractions (only al/del). Pronunciation: 5 pure vowels with **no nasal vowels and no vowel reduction**, surd intervocalic *s* (casa = "cassa"), the jota /x/ vs PT /ʒ/, ll/y vs lh, and dropping the b/v distinction; the año≠ano warning.
- **Resources:** Portugal-facing where useful (Infopédia ES-PT / Porto Editora, Instituto Cervantes de Lisboa, Linguee PT-ES) plus RAE, Centro Virtual Cervantes, ProfeDeELE, Dreaming Spanish, Coffee Break Spanish, News in Slow Spanish, RTVE, iTalki.
- **Method:** modelled on the deployed-standard English→Spanish master and the Romance reference specs `spanish-fr.json` / `spanish-it.json` for content, plus the Portuguese-source style of `zulu-pt.json` (Portuguese headings/labels, `l1ColLabel` "Português", `l1Label` "para lusófonos"). Rewritten from the lusophone learner's perspective, not translated. ~12,569 visible chars — the deepest of all Spanish guides (vs ~10,069 for spanish-from-french).

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

**Spanish** (target) existing sources: English, Cantonese, German, Italian, Mandarin, Russian, Turkish, French, Japanese, Portuguese, Korean.
- All priority sources for Spanish are complete.

**German** (target) existing sources: English, Cantonese, French, Japanese, Mandarin, Persian, Punjabi, Russian, Spanish, Ukrainian, Vietnamese, Korean, **Italian ✓ (new)**.
- Missing priority sources for German: Portuguese (#9).

---

## Next recommended guide

**German for Portuguese speakers** (`german-from-portuguese`) — last remaining priority source for German (Portuguese = priority #9).
Rationale: German's entire priority-source set is now complete except Portuguese. Model on `german-from-spanish.html` for a Romance-source perspective; headings in Portuguese; focus on false friends (Gift/veneno, bald/em breve, Brief/carta), V2 word order vs Portuguese SVO, 3 genders vs Portuguese 2, 4 cases, separable verbs, ö/ü pronunciation (absent in Portuguese). Portugal-specific resources: Goethe-Institut Lisboa, Dicionário Pons PT-DE.
