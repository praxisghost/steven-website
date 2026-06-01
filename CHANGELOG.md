# Changelog

## 2026-06-01 (autonomous run — Superorganism graph)

Files changed:
* public/vendor/three.module.min.js (new — vendored Three.js r160)
* public/vendor/THREE-LICENSE.txt (new — MIT licence)
* tools/graph/build-graph.mjs (new — page discovery + graph data generator)
* public/isms/superorganism-graph.json (new — generated: 318 nodes, 375 edges)
* public/isms/superorganism.html (rewritten — full-viewport graph + overlay UI)
* public/isms/superorganism.js (new — Three.js renderer)
* GRAPH_PROGRESS.md (new), GRAPH_BACKLOG.md, GRAPH_DECISIONS.md (013–017),
  GRAPH_STATUS.md, PROJECT_STATUS.md (docs)

Summary:
Took the Superorganism page from an empty placeholder to a working interactive
Three.js knowledge graph of the whole site. Three.js is self-hosted to satisfy
the strict same-origin CSP (no CDN). A new build script auto-discovers every
page, assigns categories and a conservative hub-and-spoke edge set, and writes
stable, position-preserving graph JSON. The renderer is OLED-black with glowing
category-coloured nodes (single draw call), shader edges, orthographic pan/zoom,
hover (enlarge + title label + neighbour highlight), click-to-open, a toggleable
category legend, and live search.

Verification:
node --check passes on renderer + build script; JSON valid; 0 dangling edges,
0 isolated nodes; positions reused 318/318 on rebuild; page, JS module, JSON,
and vendored Three.js all serve 200 with correct MIME types via an Express
static harness. In-browser WebGL not visually confirmable in this environment.

Reason:
Superorganism graph is the dedicated scheduled-task project; Priority 1
(working graph functionality) and most of Phase 2/4 were the highest-value
unblocked work.

Next recommended task:
Browser sanity-check (desktop + mobile) against ObsidianExample; add an npm
"graph" script and run build-graph.mjs whenever pages are added.


## 2026-06-01 (autonomous run)

Files changed:
* public/isms/adventurism.html (new)
* public/isms/aestheticism.html (new)
* public/isms/ageism.html (new)
* public/isms/agnosticism.html (new)
* public/isms.html (nav)

Summary:
Created 4 new Isms Batch 002 placeholder pages using the standard -isms template; verified pre-existing altruism.html matches the template; integrated all five alphabetically (between actualism and altruism) into the isms.html navigation list. Batch 002 now 5/10.

Reason:
Isms page creation (P3) — next eligible unblocked task per PROJECT_STATUS. P1 image/aquaponics tasks and P2 PS2/journal entries remain blocked (see BLOCKERS.md).

Next recommended task:
Continue Isms Batch 002: amateurism, anarchism (verify existing), animism, anti-Americanism, anticolonialism. Up to 5 pages per run.


## 2026-05-31

Initial project-management system created.

Files created:

* BACKLOG.md
* PROJECT_STATUS.md
* CHANGELOG.md
* AUTONOMOUS_RULES.md
* PRIORITIES.md
* BLOCKERS.md
* DECISIONS.md

No development tasks completed yet.


## 2026-05-31 (autonomous run)

Files changed:
* public/style.css

Summary:
Slightly lightened the darkest secondary grey values (26 declarations): text/border #444→#666, #555→#777, #666→#888.

Reason:
OLED contrast improvement task (P1). Improves legibility of muted secondary text on the pure-black theme while preserving the black/white/grey aesthetic — no colors introduced, background and primary text unchanged.

Next recommended task:
PS2 retro gaming article (P2), or begin Isms infrastructure (Batch 001 placeholder pages).


## 2026-05-31 (autonomous run)

Files changed:
* public/isms/abolitionism.html (new)
* public/isms/absenteeism.html (new)
* public/isms/absolutism.html (new)
* public/isms/abstractionism.html (new)
* public/isms/academicism.html (new)
* public/isms.html (navigation)
* ISMS_PROGRESS.md

Summary:
Created 5 Isms Batch 001 placeholder pages using the standard -isms template and added alphabetically-ordered nav links to isms.html. Batch 001 now 6/10 (absurdism pre-existed).

Reason:
Isms infrastructure task. P1 image/aquaponics tasks remain blocked on source files; PS2 article and June journal post are first-person personal entries that require Steven's own source material, so they were recorded as blocked rather than fabricated. Isms placeholder creation is templated, unblocked, and low-complexity.

Next recommended task:
Isms infrastructure — Batch 001 remaining: accelerationism, accommodationism, activism, actualism.


## 2026-06-01 (autonomous run — language guides)

Files changed:
* tools/lang-guide/specs/spanish-ja.json (new)
* public/spanish-from-japanese.html (new)
* public/spanish-srs-ja.js (new)
* public/language-guides.html (hub link added to Japanese group)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — Spanish for Japanese speakers (spanish-from-japanese) — via the
spec-driven generator (tools/lang-guide/generate.js). Wrote spec spanish-ja.json modelled on the
English→Spanish master (spanish-learning.html) and the Romance reference spanish-fr.json for
content, plus the Japanese-source style of hawaiian-ja.json (Japanese-language headings, kana
glosses). Rewritten from the Japanese learner's perspective rather than translated. Includes a
104-card SRS deck (Español front / 日本語 back) and all standard sections: 単語カード (SRS), Intro,
基本単語, 基本文法 (SVO vs Japanese SOV, noun gender + el/la/un/una articles — both absent in
Japanese, person-based verb conjugation with an hablar table, ser/estar, gustar framed via
Japanese 「〜が好き」, pretérito vs imperfecto, personal a, optional subject pronouns), 発音
(near-identical 5-vowel system as the big advantage, l/r distinction, no epenthetic vowels /
final consonants, trilled rr, mobile stress), よくある間違い, 学習リソース (11 incl. Japan-specific:
NHK まいにちスペイン語, 小学館 西和中辞典, 白水社, セルバンテス文化センター東京), 文化と背景, 関連ガイド.
Hub link inserted into the existing Japanese group of language-guides.html (idempotent).
~5,360 visible characters, more than double the closest Japanese-source reference
(hawaiian-from-japanese, ~2,411) and comparable to german-from-japanese (~5,784).

Reason:
Language Guides mission — fill the highest-priority missing target/source pair. Spanish is the
#1 priority target language; among its missing priority sources (Japanese, Korean, Portuguese),
Japanese ranked highest on the priority list. One guide per run, as required.

Next recommended task:
Spanish for Portuguese speakers (spanish-from-portuguese) — closest Romance pairing, fastest
high-quality build; finishes another of Spanish's missing priority sources.
Alternative: Spanish for Korean speakers (heavier Korean-source build with Hangul glosses).


## 2026-06-01 (autonomous run — language guides, earlier)

Files changed:
* tools/lang-guide/specs/spanish-fr.json (new)
* public/spanish-from-french.html (new)
* public/spanish-srs-fr.js (new)
* public/language-guides.html (hub link added to French group)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — Spanish for French speakers (spanish-from-french) — via the
spec-driven generator (tools/lang-guide/generate.js). Wrote spec spanish-fr.json modelled on the
Romance-source reference spanish-it.json, rewritten from the French learner's perspective rather
than translated. Includes a 104-card SRS deck (Español front / Français back) and all standard
sections: Cartes, Intro, Vocabulaire, Grammaire (ser/estar, por/para, the two pasts vs French
imparfait/passé, personal a, gustar, optional subject pronouns), Prononciation (rolled r,
non-nasal vowels, j/x, mobile stress), Erreurs fréquentes (FR↔ES false friends), 11 reputable
resources, Culture, Guides associés. Hub link inserted into the existing French group of
language-guides.html (idempotent). ~1,711 visible words, exceeding the closest comparable
reference (spanish-from-italian, ~944).

Reason:
Language Guides mission — fill the highest-priority missing target/source pair. Spanish is the
#1 priority target language; French was its highest-priority missing source (German and Italian
already done). One guide per run, as required.

Next recommended task:
Spanish for Japanese speakers (spanish-from-japanese) — next missing priority source for Spanish.
Alternative: Spanish for Portuguese speakers (closest Romance pairing).


## 2026-06-01 (autonomous run — isms infrastructure)

Files changed:
* public/isms/accelerationism.html (new)
* public/isms/accommodationism.html (new)
* public/isms/activism.html (new)
* public/isms/actualism.html (new)
* public/isms.html (navigation)
* ISMS_PROGRESS.md
* PROJECT_STATUS.md

Summary:
Created the 4 remaining Batch 001 Isms placeholder pages using the standard -isms template and
inserted alphabetically-ordered nav links into isms.html (between Academicism and Altruism).
Batch 001 is now 10/10 — COMPLETE.

Reason:
Isms infrastructure task. P1 image/aquaponics tasks remain blocked on source files; PS2 article
and June journal post are first-person personal entries requiring Steven's own source material.
Isms placeholder creation is templated, unblocked, and low-complexity. Within run limits (4 pages).

Next recommended task:
Begin Isms Batch 002 placeholder pages (adventurism, aestheticism, ageism, agnosticism, altruism —
altruism already exists, verify and mark complete).
