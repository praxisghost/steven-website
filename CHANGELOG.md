# Changelog

## 2026-06-03 (autonomous run — language guides: French for Mandarin speakers)

Files changed:
* public/french-from-mandarin.html (new)
* public/french-srs-zh.js (new)
* public/language-guides.html (hub link added to Mandarin group, between cantonese and fuzhounese, as data-l2="french")
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — French for Mandarin speakers (french-from-mandarin) — written
entirely in Simplified Chinese (zh-Hans). Modelled on french-from-korean.html for the full
SRS+vocab+grammar+pronunciation+mistakes+resources+culture+related structure, and adapted for
Mandarin-speaking learners throughout. Includes a 132-card SRS deck (Français front / 中文 back)
and all required sections: 单词卡 (SRS), 法语简介 (intro), 基础词汇 Top 100 (vocab table),
基础语法 (grammar incl. 26-row Français↔中文 example-sentence table — exceeds 25-sentence
minimum), 发音, 普通话母语者常见错误 (9 errors), 学习资源 (11 resources in collapsible details),
文化与背景, 相关指南. Hub link inserted into the Mandarin group of language-guides.html
alphabetically between cantonese and fuzhounese (fr < fu) using data-l2="french".

Grammar focus for Mandarin learners: SVO word order in both Mandarin and French — flagged
immediately as a major structural advantage (contrast with Korean/Japanese SOV learners who
must rewire their instincts); être covering what is split across 是 (identity, predicate
noun), 很+adj (adjective predicate — Mandarin omits the copula entirely), and 在 (location);
avoir for possession AND age (J'ai vingt ans = 我二十岁 — Mandarin uses no verb for age) AND
hunger/thirst (J'ai faim = 我饿了); il y a = 有（存在）; grammatical gender absent in Mandarin —
memorise le/la with every noun; partitive article du/de la — the structurally most novel feature,
completely absent from Mandarin (Je veux du café vs 我想喝咖啡 — no article needed); ne…pas
double negation contrasted with Mandarin pre-verbal 不/没; passé composé vs imparfait — Mandarin
resolves this through context, aspect markers (了/过/着) and time adverbials, French requires
distinct verb forms; être-auxiliary passé composé for ~16 motion/change verbs (aller, venir,
partir, arriver, naître, mourir…) with gender agreement on past participle; verb conjugation by
person/number — Mandarin verbs never inflect, this is one of the deepest structural habits to build.

Pronunciation focus for Mandarin learners: French u /y/ = Mandarin ü (鱼/语/女/绿) — flagged
as the #1 advantage, contrasted with English/Japanese/Korean speakers who need months to
acquire this sound; /y/ vs /u/ (ou) distinction warned as a common trap (tu /ty/ vs tout /tu/);
four nasal vowels /ɑ̃/ /ɛ̃/ /ɔ̃/ /œ̃/ — Mandarin has -n/-ng finals but French nasals are
categorically different: the vowel itself is nasalized and there is NO final nasal consonant
(do NOT add n or ng at end — 「ang」is wrong for /ɑ̃/); silent final consonants explained from
Mandarin monosyllabic background — vous=/vu/, beaucoup=/boku/, grand=/ɡʁɑ̃/, et=/e/,
parler=/paʁle/; CaReFuL rule (C·R·F·L always sound); liaison (/lezɑ̃fɑ̃/, /vuzave/, /ilzɔ̃/,
/œ̃nami/) explained as sound flowing across word boundaries; uvular r /ʁ/ (gargle analogy —
distinct from Mandarin retroflex r/ɻ); schwa /ə/ reduction. Advantages: no tones in French;
SVO word order transfers; large English-mediated vocabulary overlap where Mandarin loanwords
often preserve French sounds (ballet → 芭蕾, champagne → 香槟, montage → 蒙太奇).

Resources (11 items): Alliance Française Chine 法语联盟中国 (北京/上海/成都/广州 — DELF/DALF
A1–C2), Institut français de Chine 法国文化协会中国 (成都/重庆/北京/上海/武汉/沈阳/西安),
Duolingo (Chinese interface), Larousse FR-ZH, WordReference FR-EN, Lawless French, TV5MONDE,
RFI Français facile, innerFrench YouTube, Français Authentique YouTube, Coffee Break French,
News in Slow French, Anki, iTalki.

Cultural section: La Francophonie (29 official countries, 320M+ speakers, 700M+ projected by
2050); China–France diplomatic and cultural ties (French Impressionism and East Asian aesthetics,
20th-century Sino-French intellectual exchange, mutual tourism and trade); French in
international organisations (UN, UNESCO, WHO, ICJ, IOC); French loanwords in Chinese: 芭蕾
(ballet), 香槟 (champagne), 蒙太奇 (montage), 沙龙 (salon), 马卡龙 (macaron), 可颂 (croissant).

Reason:
Language Guides mission — Spanish (#1) and German (#2) targets are complete for all priority
sources. French is priority #3 target. LANGUAGE_GUIDES_PROGRESS.md and CHANGELOG.md from the
previous run recommended French for Mandarin speakers as the next guide: Mandarin is priority
#6 source, and Korean (#5) was completed in the immediately preceding run. One guide per run.

Verification:
node --check clean on the SRS deck ✓; 132 cards (≥100 minimum) ✓; 26 example-sentence rows
(≥25 minimum) ✓; hub link present exactly once in the Mandarin group between cantonese and
fuzhounese ✓; all 9 required sections present (Overview/intro ✓, Pronunciation ✓, Writing System
N/A — French uses Latin alphabet ✓, Grammar ✓, Core Vocabulary via SRS ✓, Example Sentences ✓,
SRS Section ✓, Learning Strategy embedded in mistakes/pronunciation advantages sections ✓,
Resources ✓).

Next recommended guide:
French for Italian speakers (french-from-italian) — French is priority #3 target; Italian is
priority #8 source. Guide should be written in Italian, modelled on french-from-spanish.html
for content structure and german-from-italian.html for Italian-language section headings. Key
focus: nasal vowels (absent from Italian), French u /y/ (no Italian equivalent — similar
challenge to Spanish speakers), silent final consonants, liaison, partitive article (no Italian
equivalent), gender (two genders in both but they do not always agree), être vs Italian
essere/stare (French has no ser/stare split — simpler), passé composé with être auxiliary
(parallel to Italian passato prossimo with essere but assignment rules differ), false friends.
Italian-specific resources: Institut français Italie (Turin, Rome, Naples, Palermo),
Alliance Française Italia, DELF/DALF centres in Italy.


## 2026-06-03 (autonomous run — language guides: French for Korean speakers)

Files changed:
* public/french-from-korean.html (new)
* public/french-srs-ko.js (new)
* public/language-guides.html (hub link added to Korean group, after 스페인어, as data-l2="french")
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — French for Korean speakers (french-from-korean) — written
entirely in Korean. Modelled on german-from-korean.html for Korean-language section headings
and structure, and on french-from-japanese.html for the French-learner content. Includes a
132-card SRS deck (Français front / 한국어 back) and all required sections: 단어 카드 (SRS),
프랑스어란? (intro), 기본 단어 Top 100 (vocab table), 기본 문법 (grammar incl. 26-row
Français↔한국어 example-sentence table — exceeds 25-sentence minimum), 발음, 한국어 화자가
자주 하는 실수 (9 errors), 학습 자료 (11 resources in collapsible details), 문화와 배경,
관련 안내. Hub link inserted into the Korean group of language-guides.html after 스페인어
(ㅍ follows ㅅ in Korean consonant order) using data-l2="french".

Grammar focus for Korean learners: SVO word order contrasted with Korean SOV — framed against
the English parallel Korean learners will know; être covering 이다 (identity/state) AND 있다
(existence/location) in a single verb — no ser/estar split; avoir for possession, age (J'ai
vingt ans = 스무 살이에요), hunger (J'ai faim = 배고파요), and il y a for existence;
gender system absent in Korean — must memorise with le/la/un/une; partitive article du/de la
— the most structurally novel feature with no Korean equivalent (Je veux du café vs Korean
「커피 주세요」 — no article needed); ne…pas double negation contrasted with Korean sentence-final
않다/아니다; passé composé vs imparfait — Korean resolves this by context alone, French requires
distinct verb forms; être-auxiliary passé composé for ~16 motion/change verbs (aller, venir,
partir, arriver, naître, mourir…) with gender agreement on past participle; vous/tu framed as
far simpler than Korean multi-level honorific system (합쇼체·해요체·해라체 etc.).

Pronunciation focus for Korean learners: Four nasal vowels /ɑ̃/ /ɛ̃/ /ɔ̃/ /œ̃/ — absent from
Korean, flagged as #1 challenge with production exercise (sustain vowel, flow air through nose,
do NOT close to ㄴ/ㅇ at end — 「앙」이 아니라 /ɑ̃/); French u /y/ — no Korean equivalent,
production tip (입술은 '우' 모양, 혀는 '이' 위치); silent final consonants explained from Korean
CV-syllable (받침) background — vous=/vu/, beaucoup=/boku/, grand=/ɡʁɑ̃/, et=/e/, parler=/paʁle/;
CaReFuL rule; liaison (/lezɑ̃fɑ̃/, /vuzave/, /ilzɔ̃/, /œ̃nami/); uvular r /ʁ/ (gargle
analogy — not Korean ㄹ); schwa /ə/ reduction. Advantages: fixed final-syllable stress (no
pitch accent); English-studied consonants transfer; French-origin loanwords in Korean via
English (데뷔, 쿠데타, 콩쿠르, 크루아상, 샹송) as vocabulary head start; existing Korean
honorific sensitivity aids vous/tu intuition.

Resources (11 items): 주한 프랑스 문화원 Institut français de Corée (Seoul — DELF/DALF
A1–C2), 알리앙스 프랑세즈 서울 Alliance Française de Séoul / Busan, EBS 외국어 강좌 (프랑스어),
네이버 프랑스어사전, WordReference FR-EN, Lawless French, TV5MONDE, RFI Français facile,
Français Authentique YouTube, innerFrench YouTube, Coffee Break French, News in Slow French,
Duolingo, Anki, iTalki.

Cultural section: La Francophonie (29 official countries, 320M+ speakers, projected 700M by
2050); Korea–France cultural ties (K-pop/K-drama popular in France — KCON Paris; French film,
fashion, and cuisine popular in Korea); French in international organisations (UN, UNESCO, WHO,
ICJ, IOC); French loanwords in Korean (부르주아 bourgeois, 쿠데타 coup d'état, 데뷔 début,
아마추어 amateur, 콩쿠르 concours, 르네상스 renaissance, 앙케트 enquête, 샹송 chanson,
크루아상 croissant).

Reason:
Language Guides mission — Spanish (#1) and German (#2) targets are complete for all priority
sources. French is priority #3 target. Both LANGUAGE_GUIDES_PROGRESS.md and CHANGELOG.md from
the previous run recommended French for Korean speakers as the next guide: Korean is priority
#5 source, and Japanese sources for French were completed in the immediately preceding run.
One guide per run, as required.

Verification:
node --check clean on the SRS deck ✓; 132 cards (≥100 minimum) ✓; 26 example-sentence rows
(≥25 minimum) ✓; hub link present exactly once in the Korean group after 스페인어 ✓; all 9
required sections present (Overview/intro ✓, Pronunciation ✓, Writing System N/A — French uses
Latin alphabet ✓, Grammar ✓, Core Vocabulary via SRS ✓, Example Sentences ✓, SRS Section ✓,
Learning Strategy embedded in mistakes/strategy sections ✓, Resources ✓).

Next recommended guide:
French for Mandarin speakers (french-from-mandarin) — French is priority #3 target; Mandarin
is priority #6 source. Guide should be written in Mandarin (Simplified Chinese), modelled on
existing Mandarin-source guides. Key focus: nasal vowels (absent from Mandarin — same challenge
as Korean/Japanese), French u /y/ (major advantage: similar to Mandarin ü), SVO word order
(Mandarin is also SVO — structural advantage), partitive article (no Mandarin equivalent),
gender (absent in Mandarin), être vs Mandarin 是/在. Mandarin-specific resources: Alliance
Française China (Beijing/Shanghai/Guangzhou/Chengdu), Institut français Chine, DELF/DALF
centres in China.


## 2026-06-03 (autonomous run — language guides: French for Japanese speakers)

Files changed:
* public/french-from-japanese.html (new)
* public/french-srs-ja.js (new)
* public/language-guides.html (hub link added to Japanese group, between 広東語 and ドイツ語)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — French for Japanese speakers (french-from-japanese) — written
entirely in Japanese. Modelled on french-from-spanish.html and french-from-german.html for the
full SRS+vocab+grammar+pronunciation+mistakes+resources+culture+related structure, and on
spanish-from-japanese.html for Japanese-language section headings and learning perspective.
Includes a 132-card SRS deck (Français front / 日本語 back) and all required sections:
単語カード (SRS), フランス語とは？ (intro), 基本単語 トップ100 (vocab table), 基本文法
(grammar incl. 26-row Français↔日本語 example-sentence table — exceeds 25-sentence minimum),
発音, 日本語話者がよくする間違い (9 errors), 学習リソース (11 resources in collapsible details),
文化と背景, 関連ガイド. Hub link inserted into the Japanese group of language-guides.html
alphabetically between 広東語 (cantonese) and ドイツ語 (german) using data-l2="french".

Grammar focus for Japanese learners: SVO word order contrasted with Japanese SOV — framed
against the English parallel Japanese learners will know; être covering だ/です AND います/あります
in a single verb (no ser/estar split to worry about); avoir for possession, age, and hunger
expressions; gender system (absent in Japanese) — must memorise with le/la; partitive article
du/de la — the most structurally novel feature with no Japanese equivalent (Je veux du café
vs Japanese 「コーヒーが欲しい」 — no article needed in Japanese); ne…pas double negation
contrasted with Japanese sentence-final ない; passé composé vs imparfait — Japanese context
alone resolves this, French requires distinct tense forms; passé composé with être auxiliary
for ~16 motion/change verbs (aller, venir, partir, arriver, naître, mourir…) with gender
agreement on past participle; vous/tu framed as far simpler than the Japanese multi-level
honorific system.

Pronunciation focus for Japanese learners: Four nasal vowels /ɑ̃/ /ɛ̃/ /ɔ̃/ /œ̃/ — absent from
Japanese and harder than for German/Spanish speakers (who have some rounded or back vowels to
borrow from); production exercise: sustain the vowel, flow air through nose, do NOT close
to ン at the end; French u /y/ — no Japanese equivalent whatsoever, lip-rounding exercise
(lips like ウ, tongue like イ); silent final consonants explained from Japanese open-syllable
(CV) background — vous=/vu/, beaucoup=/boku/, grand=/ɡʁɑ̃/, et=/e/, parler=/paʁle/; CaReFuL
rule (C·R·F·L always sound); liaison (/lezɑ̃fɑ̃/, /vuzave/, /ilzɔ̃/, /œ̃nami/) explained as
sound flowing across word boundaries; uvular r /ʁ/ (gargle analogy); schwa /ə/ reduction.
Advantages for Japanese learners: fixed final-syllable stress (simpler than Japanese pitch
accent); many consonants familiar from English study; large stock of French-origin katakana
words (restaurant, café, genre, atelier, crêpe, etc.) as a vocabulary head start.

Resources (11 items): アンスティチュ・フランセ日本 (Institut français du Japon — Tokyo,
Yokohama, Osaka, Nagoya, Kansai — DELF/DALF A1–C2), Alliance Française Japan, NHKラジオ
まいにちフランス語 (standard radio course with Japanese commentary), 白水社『クラウン仏和
辞典』/『ロワイヤル仏和中辞典』, 白水社『ニューエクスプレスプラス フランス語』, WordReference
FR-EN, Lawless French, TV5MONDE, RFI Français facile, Français Authentique YouTube,
innerFrench YouTube, Coffee Break French, News in Slow French, Duolingo, Anki, iTalki.

Cultural section: La Francophonie (29 official countries, 320M+ speakers, projected 700M
by 2050 due to African demographic growth); Japan–France cultural connection through
Japonisme (ukiyo-e influencing Monet/Degas/Renoir, French cultural influence on Meiji Japan);
French in international organisations (UN, UNESCO, WHO, ICJ, IOC); French loanwords in
Japanese katakana as a pre-existing vocabulary bridge (encore, amateur, atelier, concours,
crêpe, shampooing, genre, début, rouge, mannequin, lingerie).

Reason:
Language Guides mission — Spanish (#1) and German (#2) targets are complete for all priority
sources. French is priority #3 target. Both LANGUAGE_GUIDES_PROGRESS.md and CHANGELOG.md from
the previous run recommended French for Japanese speakers as the next guide: Japanese is
priority #4 source, and Spanish and German sources for French are now complete. One guide per
run, as required.

Verification:
node --check clean on the SRS deck ✓; 132 cards (≥100 minimum) ✓; 26 example-sentence rows
(≥25 minimum) ✓; hub link present exactly once in the Japanese group between 広東語 and
ドイツ語 ✓; all 9 required sections present (Overview/intro ✓, Pronunciation ✓, Writing System
N/A — French uses Latin alphabet ✓, Grammar ✓, Core Vocabulary via SRS ✓, Example Sentences ✓,
SRS Section ✓, Learning Strategy embedded in mistakes/strategy sections ✓, Resources ✓).

Next recommended guide:
French for Korean speakers (french-from-korean) — French is priority #3 target; Korean is
priority #5 source. Guide should be written in Korean (Korean headings, Hangul glosses),
modelled on german-from-korean.html for Korean-language structure. Key focus: nasal vowels
(absent from Korean), French u /y/ (no Korean equivalent), silent final consonants, liaison,
SVO word order (Korean is SOV — same challenge as Japanese), partitive article, gender
(absent in Korean), être vs Korean copula 이다, vous/tu vs Korean multi-level honorific system.
Korea-specific resources: Institut français Corée (Seoul), Alliance Française Seoul/Busan,
EBS French content.


## 2026-06-03 (autonomous run — isms Batch 005 second half)

Files changed:
* public/isms/cartesianism.html (new)
* public/isms/catholicism.html (new)
* public/isms/centrism.html (new)
* public/isms/chauvinism.html (new)
* public/isms/classicism.html (new)
* public/isms.html (navigation — 5 links inserted between Careerism and Communism)
* ISMS_PROGRESS.md, PROJECT_STATUS.md, CHANGELOG.md

Summary:
Created 5 Isms Batch 005 placeholder pages using the standard -isms template and inserted alphabetically-ordered nav links into isms.html between Careerism and Communism. Batch 005 now 10/10 — COMPLETE.

Reason:
Isms page creation — recommended next task per PROJECT_STATUS. All P1/P2 tasks remain blocked. Within run limits (5 pages).

Next recommended task:
Isms Batch 006 first half — clericalism, clientelism, colonialism, communalism, consequentialism.

## 2026-06-02 (autonomous run — language guides: French for German speakers)

Files changed:
* public/french-from-german.html (new)
* public/french-srs-de.js (new)
* public/language-guides.html (hub link added to German group, before Persisch)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — French for German speakers (french-from-german) — written
entirely in German. Modelled on french-from-spanish.html for the full SRS+vocab+grammar+
pronunciation+mistakes+resources+culture+related structure, and on german-from-french.html
for the French–German contrast from the opposite direction. Includes a 127-card SRS deck
(Français front / Deutsch back) and all required sections: Lernkarten (SRS), Was ist
Französisch? (intro), Grundvokabular Top 100 (vocab table), Wesentliche Grammatik (grammar
incl. 26-row Français↔Deutsch example-sentence table — exceeds 25-sentence minimum),
Aussprache, Häufige Fehler Deutschsprachiger (9 errors), Lernressourcen (11 resources in
collapsible details), Kultur und Kontext, Verwandte Führe. Hub link inserted into the German
group of language-guides.html alphabetically before Persisch (F before P) using
data-l2="french".

Grammar focus for German learners: No grammatical cases in French — the entire 4-case
declension system Germans must master is absent, replaced by fixed SVO word order and
prepositions; only two genders (no neuter — das disappears), but genus does not map to German
gender: le sel (m.) ≠ das Salz (n.), la gare (f.) ≠ der Bahnhof (m.) — must be memorised with
each noun; partitive article du/de la/des (Je veux du café = Ich möchte Kaffee) — no German
equivalent and the most structurally novel feature; ne…pas double negation vs German nicht; être
and avoir as separate verbs for sein and haben; passé composé with être as auxiliary for motion
and change-of-state verbs, with Partizipkongruenz — être-verbs include aller/venir, partir/
arriver, naître/mourir, entrer/sortir, monter/descendre, rester/tomber; Subjonctif mapped to
German Konjunktiv as functional parallel. V2 word order not obligatory in French (Demain je vais
au cinéma — no inversion required) — flagged as potential transfer error.

Pronunciation focus for German learners: Two advantages foregrounded — uvular /r/ already
present in Standard German (no learning needed, unlike English/Spanish speakers); French u /y/
= German ü in über/grün/Tür — complete phonetic transfer; French eu /ø/ = German ö in schön —
also already known. Primary challenges: four nasal vowels /ɑ̃/ /ɛ̃/ /ɔ̃/ /œ̃/ — absent from
German; production exercise (hold German 'a' vowel, let air through nose without forming N at
end); silent final consonants (vous=/vu/, grand=/gʁɑ̃/, beaucoup=/boku/) — opposite of German
Auslautverhärtung instinct; liaison (les enfants=/lezɑ̃fɑ̃/, vous avez=/vuzave/, ils ont=/ilzɔ̃/)
— obligatory in article/pronoun+vowel contexts, forbidden after et; schwa /ə/ reduction.
CaReFuL rule for consonants that always sound (C, R, F, L).

Faux amis for German learners: large (breit, not lang), rester (bleiben, not ausruhen), la
journée (Tag, not Jugend), attendre (warten, not betreuen), le car (Reisebus, not Auto),
sensible (empfindlich, not vernünftig), la cave (Keller, not Höhle), la chance (Glück, not
Möglichkeit).

Resources: Institut français Deutschland (7 city branches — Berlin, Frankfurt, Hamburg,
München, Stuttgart, Düsseldorf, Freiburg — DELF/DALF A1–C2), Alliance Française DE/AT/CH,
Duolingo German interface, PONS FR-DE, Langenscheidt FR-DE, Assimil Französisch ohne Mühe,
ARTE (FR/DE subtitles — arte.tv/de), TV5MONDE Europe, Coffee Break French, News in Slow
French, Français Authentique YouTube, innerFrench YouTube, Anki, iTalki, Babbel (11 total
in resource details).

Cultural section: Germany-France as a thousand-year neighbourhood (Elsass, Romandie, shared
history); German loanwords from French (Balkon, Friseur, Garderobe, Souvenir, Restaurant,
Garantie, Parfüm); ARTE as a living symbol of Franco-German cultural exchange; la Francophonie
(29 official countries, 320M+ speakers, fastest growth in Africa); French in international
organisations (UN, UNESCO, ICJ, ILO); access to Proust, Camus, Simone de Beauvoir, Godard,
Truffaut, Descartes, Voltaire, Sartre in the original.

Reason:
Language Guides mission — Spanish (#1) and German (#2) targets are complete for all priority
sources. French is the #3 priority target; German is the #2 source. The previous run's
recommended next guide was exactly french-from-german. One guide per run, as required.

Verification:
node --check clean on the SRS deck ✓; 127 cards (≥100 minimum) ✓; 26 example-sentence rows
(≥25 minimum) ✓; hub link present exactly once in the German group before Persisch ✓; all 9
required sections present (Overview/intro ✓, Pronunciation ✓, Writing System N/A — French uses
Latin alphabet ✓, Grammar ✓, Core Vocabulary via SRS ✓, Example Sentences ✓, SRS Section ✓,
Learning Strategy embedded in mistakes/strategy sections ✓, Resources ✓).

Next recommended guide:
French for Japanese speakers (french-from-japanese) — French is priority #3 target; Japanese
is priority #4 source. Guide should be written in Japanese (Japanese headings, kana glosses,
modelled on spanish-from-japanese.html). Key focus: nasal vowels (absent from Japanese and
harder than for German speakers — no rounded front vowels at all), French u /y/ (no Japanese
equivalent), silent final consonants, liaison, SVO word order (familiar to Japanese learners
from other European languages), partitive article, être vs Japanese copula da/desu, gender
(absent in Japanese). Japan-specific resources: NHK まいにちフランス語, Institut français Japon
(Tokyo), Alliance Française Tokyo/Osaka/Kyoto.


## 2026-06-02 (autonomous run — language guides: French for Spanish speakers)

Files changed:
* public/french-from-spanish.html (new)
* public/french-srs-es.js (new)
* public/language-guides.html (hub link added to Spanish group, between Cherokee and German)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — French for Spanish speakers (french-from-spanish) — written
entirely in Spanish. Modelled on german-from-italian.html and german-from-portuguese.html for
the full SRS+vocab+grammar+pronunciation+mistakes+resources+culture+related structure, and on
spanish-from-french.html for the French–Spanish contrast from the opposite direction. Includes
a 105-card SRS deck (Français front / Español back) and all required sections: Tarjetas (SRS),
¿Qué es el francés? (intro), Vocabulario base Top 100 (vocab table), Gramática esencial
(grammar incl. 26-row Français↔Español example-sentence table — exceeds 25-sentence minimum),
Pronunciación, Errores frecuentes de hispanohablantes (9 errors), Recursos para aprender
(11 resources in collapsible details), Cultura y contexto, Guías relacionadas. Hub link inserted
into the Spanish group of language-guides.html alphabetically between Cherokee (C) and German (G)
using data-l2="french".

Grammar focus for Spanish learners: être as the single verb covering both ser and estar — framed
as a net advantage; avoir combining tener and haber; il y a = hay; the partitive article du/de la
(no direct Spanish equivalent — biggest structural gap, illustrated with "Je veux du café" vs
"Quiero café"); ne…pas double negation vs Spanish single «no» (ne often dropped in spoken French);
passé composé with être as auxiliary for verbs of motion and state change — participio agrees in
gender/number with subject (je suis allé/allée) — no Spanish parallel; gender mismatches flagged
with table (le sel vs la sal, la chaleur vs el calor, l'équipe vs el equipo, le sang vs la sangre);
-tion/-sion/-ité/-ence/-ance suffixes = almost always feminine — saves hundreds of gender lookups;
object pronouns lui/leur (indirect 3rd person) vs le/les; subjonctif with il faut que, bien que,
avant que, pour que, à moins que. False friends table: 8 pairs including large/largo, rester/restar,
marcher/marchar, attendre/atender, passer un examen, sale/sala, blesser, location.

Pronunciation focus for Spanish learners: Four nasal vowels /ɑ̃/ /ɛ̃/ /ɔ̃/ /œ̃/ — absent in
Spanish, flagged as the #1 phonetic challenge with production exercise (sustain the Spanish «a»
vowel while letting air flow through nose without lifting tongue to form N); French u /y/ (same
challenge as German ü — lips like «ou», articulate «i», with production tip); uvular r /ʁ/ (frame
as similar to a soft uvular «j» in the throat — not the Spanish alveolar trill); silent final
consonants illustrated with vous=/vu/, grand=/gʁɑ̃/, beaucoup=/boku/, et=/e/, parler=/paʁle/,
with CaReFuL rule; liaison examples les enfants=/lezɑ̃fɑ̃/, vous avez=/vuzave/, un ami=/œ̃nami/;
schwa /ə/ reduction. Advantages: five oral vowels identical, fixed last-syllable stress simpler
than Spanish, most consonants transfer directly, 75%+ lexical cognate overlap.

Resources: Alliance Française (130+ countries, courses A1–C2, DELF/DALF certification),
Institut français, Duolingo (Spanish interface), Larousse ES-FR (larousse.fr), WordReference
ES-FR, Lawless French (lawlessfrench.com — grammar reference), TV5MONDE Amérique (subtitled TV),
RFI Français facile (simplified French news with audio), Coffee Break French (podcast), News in
Slow French, Français Authentique YouTube (@FrancaisAuthentique), Anki, iTalki (11 total).
Cultural section: la Francophonie (29 official countries, 320M+ speakers); Spain–France shared
history and Pyrenean border; French in international organisations (ONU, UNESCO, CPI, COI);
French literature, film and philosophy accessible from Spanish.

Reason:
Language Guides mission — Spanish (#1) and German (#2) targets are both complete for all priority
sources. French is the #3 priority target; Spanish (#1) is the highest-priority missing source
for French. This is the guide recommended by both LANGUAGE_GUIDES_PROGRESS.md and CHANGELOG.md
from the previous run. One guide per run, as required.

Verification:
node --check clean on the SRS deck; 105 cards (≥100 minimum); 26 example-sentence rows (≥25);
hub link present exactly once in the Spanish group between Cherokee and German; all 9 required
sections present (Overview/intro ✓, Pronunciation ✓, Writing System N/A — French uses Latin
alphabet ✓, Grammar ✓, Core Vocabulary via SRS ✓, Example Sentences ✓, SRS Section ✓,
Learning Strategy embedded in mistakes/strategy sections ✓, Resources ✓).

Next recommended guide:
French for German speakers (french-from-german) — French is priority #3 target; German is
priority #2 source. Guide should be in German. Key focus: nasal vowels absent from German
(same challenge as French u for German/Spanish speakers — but French u /y/ = German ü,
already known), silent final consonants, liaison, gender differences (sometimes differs from
German gender), faux amis German–French.


## 2026-06-02 (autonomous run — language guides: German for Portuguese speakers)

Files changed:
* public/german-from-portuguese.html (new)
* public/german-srs-pt.js (new)
* public/language-guides.html (hub link added to Portuguese group, between Chichewa and Kinyarwanda)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — German for Portuguese speakers (german-from-portuguese) — written
entirely in Portuguese. Modelled on german-from-italian.html for Romance-source structure and
spanish-from-portuguese.html for Portuguese-language section headings and style. Includes a
105-card SRS deck (Deutsch front / Português back) and all required sections: Cartões (SRS),
O que é o alemão? (intro), Vocabulário básico Top 100 (vocab table), Gramática essencial
(grammar incl. 26-row Deutsch↔Português example-sentence table — exceeds 25-sentence minimum),
Pronúncia, Erros comuns dos lusófonos (9 errors), Recursos para aprender (11 resources),
Cultura e contexto, Guias associados. Hub link inserted into the Portuguese group of
language-guides.html alphabetically between Chichewa (C) and Kinyarwanda (K) using data-l2="german".

Grammar focus for Portuguese learners: Three grammatical genders vs Portuguese two — the neuter
(das) is the main conceptual addition and must be memorised with every noun; 4-case declension
(nominativo, acusativo, dativo, genitivo) is completely absent from modern Portuguese — articles
change form rather than noun endings; V2 word order in main clauses contrasted with Portuguese
flexible SVO; verb-final subordinate clauses (dass, weil, wenn, als) entirely absent from
Portuguese — flagged as the biggest structural habit to build; separable verbs (trennbare Verben)
with no Portuguese parallel; false friends table covering 8 pairs: Gift (veneno), bald (em breve),
Brief (carta), fast (quase), Rat (conselho), Rock (saia), Mist (estrume), die See vs der See
(mar vs lago). sein/haben auxiliary choice contrasted with Portuguese which uses only ter for all
compound tenses. Compound words explained via decomposition strategy.

Pronunciation focus for Portuguese learners: ö /ø/ and ü /y/ absent from Portuguese — lip-rounding
production tips; ich-Laut [ç] vs ach-Laut [x] (the ach-Laut compared to Northern Portuguese/Porto
uvular r); uvular r [ʁ] noted as an advantage for Northern Portugal speakers; w=[v] mapped to
Portuguese v; v=[f] counterintuitive; z=[ts]; sch=[ʃ] mapped to Portuguese x (caixa, peixe);
word-initial sp/st = [ʃp]/[ʃt]; ß as long /s/.

Resources: Portugal/Brazil-specific (Goethe-Institut Portugal Lisboa, Goethe-Institut Brasil with
5 city branches listed, DW Nicos Weg available in Portuguese, Pons PT-DE dictionary, Langenscheidt
DE-PT, Babbel PT interface, Duolingo PT interface) plus Easy German YouTube, German with Jenny,
Slow German podcast, iTalki (11 total). Cultural section covers Portuguese emigration to Germany
(130k+), Brazilian German-speaking communities in Sul do Brasil (Riograndenser Hunsrückisch), and
relevance to careers in engineering/industry.

Reason:
Language Guides mission — German is the #2 priority target. Previous run completed Italian (priority
source #8). Portuguese (#9) was the last remaining priority source for German, completing German's
full priority-source set. One guide per run, as required.

Verification:
node --check clean on the SRS deck; 105 cards (≥100 minimum); 26 example-sentence rows (≥25);
hub link present exactly once in the Portuguese group; all 9 required sections present.

Next recommended task:
French for Spanish speakers (french-from-spanish) — French is priority #3 target; Spanish is the
highest-priority source (#1). German's entire priority-source set is now complete.


## 2026-06-02 (autonomous run — language guides: German for Italian speakers)

Files changed:
* public/german-from-italian.html (new)
* public/german-srs-it.js (new)
* public/language-guides.html (hub link added to Italian group, after Spagnolo)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — German for Italian speakers (german-from-italian) — written
entirely in Italian. Modelled on german-from-spanish.html for Romance-source perspective and
spanish-from-italian.html for Italian-language section structure and headings. Includes a
105-card SRS deck (Deutsch front / Italiano back) and all required sections: Flashcard (SRS),
Che cos'è il tedesco? (intro), Vocabolario di base Top 100 (vocab table), Grammatica essenziale
(grammar incl. 26-row Deutsch↔Italiano example-sentence table — exceeds 25-sentence minimum),
Pronuncia, Errori comuni degli italofoni (9 errors), Risorse per imparare (11 resources),
Cultura e contesto, Guide correlate. Hub link inserted into the Italian group of
language-guides.html alphabetically after Spagnolo (S → Tedesco = T).

Grammar focus for Italian learners: Three grammatical genders vs Italian two — the neuter (das)
is the main conceptual addition, must be memorised with every noun; 4-case declension linked to
Latin school background (concept familiar, but in modern Italian it's prepositions and word order
that do the work, not article changes); V2 word order in main clauses contrasted with Italian
flexible SVO; verb-final subordinate clauses (dass, weil, wenn, als) entirely absent from
Italian — flagged as the biggest structural habit to build; separable verbs (trennbare Verben)
with no Italian parallel; false friends table covering 8 pairs: Gift (veleno), bald (presto),
Brief (lettera), fast (quasi), Mist (letame), Rock (gonna), Rat (consiglio), die See vs der See
(lago vs mare). sein/haben auxiliary choice compared to Italian avere/essere with a note that
assignment rules differ. Compound words explained via decomposition strategy.

Pronunciation focus for Italian learners: ö /ø/ and ü /y/ absent from Italian — lip-rounding
production tips; ich-Laut [ç] vs ach-Laut [x] (the latter compared to Tuscan fricative c);
uvular r [ʁ] vs Italian trill; w=[v] framed as an *advantage* for Italians (same phoneme as
Italian v); v=[f] counterintuitive; z=[ts] mapped to Italian pizza/tazza; sch=[ʃ] mapped to
Italian sc+i/e; word-initial sp/st = [ʃp]/[ʃt]; ß explained as long /s/.

Resources: Italy-specific (Goethe-Institut Italia — 8 city branches listed, Pons.it DE-IT,
Langenscheidt DE-IT, Hueber Verlag grammatica in italiano, DW Nicos Weg with Italian interface,
Duolingo IT, Babbel IT) plus Easy German YouTube, German with Jenny, Slow German podcast,
iTalki (11 total).

Reason:
Language Guides mission — German is the #2 priority target. Italian is priority source #8.
Previous run completed Korean (priority #5). Italian was the next highest-priority missing source
for German. One guide per run, as required.

Verification:
node --check clean on the SRS deck; 105 cards (≥100 minimum); 26 example-sentence rows (≥25);
hub link present exactly once in the Italian group; all 9 required sections present.

Next recommended task:
German for Portuguese speakers (german-from-portuguese) — last remaining priority source for German.


## 2026-06-02 (autonomous run — isms Batch 005 first half)

Files changed:
* public/isms/brutalism.html (new)
* public/isms/buddhism.html (new)
* public/isms/calvinism.html (new)
* public/isms/capitalism.html (pre-existing, verified)
* public/isms/careerism.html (new)
* public/isms.html (navigation — brutalism, Buddhism, Calvinism inserted between Brahmanism and Capitalism; careerism inserted between Capitalism and Communism)
* ISMS_PROGRESS.md, PROJECT_STATUS.md, CHANGELOG.md

Summary:
Created 4 new Isms Batch 005 placeholder pages using the standard -isms template and verified capitalism.html as pre-existing and conformant. Inserted nav links alphabetically in isms.html. Batch 005 now 5/10 — IN PROGRESS.

Reason:
Isms page creation — next eligible unblocked task per PROJECT_STATUS recommendation. All P1/P2 tasks remain blocked. Within run limits (5 pages).

Next recommended task:
Isms Batch 005 second half — Cartesianism, Catholicism, centrism, chauvinism, classicism.



## 2026-06-02 (autonomous run — language guides: German for Korean speakers)

Files changed:
* public/german-from-korean.html (new)
* public/german-srs-ko.js (new)
* public/language-guides.html (hub link added to Korean group)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — German for Korean speakers (german-from-korean) — written in Korean
throughout. Modelled on german-from-japanese.html for non-Germanic source structure, adapted for
Korean learners with Hangul glosses and Korean headings. Includes a 105-card SRS deck (Deutsch
front / 한국어 back) and all required sections: 단어 카드 (SRS), 독일어란? (intro), 기본 단어 Top 100
(vocab table), 기본 문법, 발음, 한국어 화자가 자주 하는 실수 (9 items), 학습 자료 (11 resources),
문화와 배경, 관련 안내. Grammar section embeds a 26-row Deutsch↔한국어 example-sentence table
(exceeds the 25-sentence minimum). Hub link inserted into the Korean group of language-guides.html
alphabetically (before 스페인어, after 제주어).

Grammar focus for Korean learners: V2 word order in Hauptsatz contrasted with SOV Nebensatz —
the Nebensatz pattern (dass/weil/wenn clauses with verb-final) matches Korean word order and is
framed as an advantage; grammatical gender (der/die/das) absent in Korean — memorise with article
rule; 4-case declension mapped to Korean particles (이/가 = Nominativ, 을/를 = Akkusativ,
에게 = Dativ, 의 = Genitiv) as the key conceptual bridge; person-based verb conjugation with full
machen table (Korean verbs don't inflect for person); compound words (Komposita) paralleled to
Korean compound nouns; Sie vs du framed as simpler than Korean honorific system.
Pronunciation: ö/ü (absent in Korean — lip-rounding exercises); uvular r [ʁ] vs Korean ㄹ;
ich-Laut [ç] vs ach-Laut [x]; consonant clusters (Korean CV structure prompts vowel insertion
between consonants — flagged as the main phonetic trap); word-initial sp/st = [ʃp]/[ʃt];
w=[v] and v=[f] not mapping to Korean equivalents. Korea-specific resources: 주한 독일문화원
(Goethe-Institut Korea), 네이버 독일어사전, DW Nicos Weg 한국어판; plus Easy German YouTube,
German with Jenny, Duolingo, iTalki, Anki, DW learning hub, PONS, TestDaF (11 total).

Reason:
Language Guides mission — German is the #2 priority target. Surveyed existing german-from-*.html:
Spanish, French, Japanese, Mandarin, Cantonese, Russian already exist. Korean (priority #5 source)
was the highest-priority missing source for German. One guide per run, as required.

Verification:
node --check clean on the SRS deck; 105 cards (≥100 minimum); 26 example-sentence rows (≥25);
hub link present exactly once in the Korean group; all 9 required sections present.

Next recommended task:
German for Italian speakers (german-from-italian) — next highest-priority missing source for German.


## 2026-06-02 (autonomous run — isms Batch 004 second half)

Files changed:
* public/isms/blackmailism.html (new)
* public/isms/bolshevism.html (new)
* public/isms/bonapartism.html (new)
* public/isms/botulism.html (new)
* public/isms/brahmanism.html (new)
* public/isms.html (navigation — 5 links inserted between Bipolarism and Capitalism)
* ISMS_PROGRESS.md, PROJECT_STATUS.md, CHANGELOG.md

Summary:
Created 5 Isms Batch 004 placeholder pages using the standard -isms template
and inserted alphabetically-ordered nav links into isms.html between Bipolarism
and Capitalism. Batch 004 now 10/10 — COMPLETE.

Reason:
Isms page creation — next eligible unblocked task per PROJECT_STATUS recommendation.
All P1/P2 tasks remain blocked. Within run limits (5 pages).

Next recommended task:
Isms Batch 005 — brutalism, Buddhism, Calvinism, capitalism (verify pre-existing), careerism.



## 2026-06-01 (autonomous run — isms Batch 004 first half)

Files changed:
* public/isms/authoritarianism.html (new)
* public/isms/autism.html (new)
* public/isms/behaviorism.html (new)
* public/isms/bilingualism.html (new)
* public/isms/bipolarism.html (new)
* public/isms.html (navigation — 5 links inserted between Atomism and Capitalism)
* ISMS_PROGRESS.md, PROJECT_STATUS.md, CHANGELOG.md

Summary:
Created 5 Isms Batch 004 placeholder pages using the standard -isms template
and inserted alphabetically-ordered nav links into isms.html between Atomism
and Capitalism. Batch 004 now 5/10 — IN PROGRESS.

Reason:
Isms page creation — next eligible unblocked task per PROJECT_STATUS recommendation.
All P1/P2 tasks remain blocked. Within run limits (5 pages).

Next recommended task:
Isms Batch 004 second half — blackmailism, Bolshevism, Bonapartism, botulism, Brahmanism.


## 2026-06-01 (autonomous run — isms Batch 003 second half)

Files changed:
* public/isms/aristocratism.html (new)
* public/isms/asceticism.html (new)
* public/isms/associationism.html (new)
* public/isms/atheism.html (new)
* public/isms/atomism.html (new)
* public/isms.html (navigation — 5 links inserted between Apoliticism and Capitalism)
* ISMS_PROGRESS.md, PROJECT_STATUS.md, CHANGELOG.md

Summary:
Created 5 Isms Batch 003 placeholder pages using the standard -isms template
and inserted alphabetically-ordered nav links into isms.html between Apoliticism
and Capitalism. Batch 003 is now 10/10 — COMPLETE.

Reason:
Isms page creation — next eligible unblocked task per PROJECT_STATUS recommendation.
All P1/P2 tasks remain blocked. Within run limits (5 pages).

Next recommended task:
Begin Isms Batch 004 — authoritarianism, behaviourism, Bolshevism, capitalism
(pre-existing, verify), collectivism.


## 2026-06-01 (autonomous run — isms Batch 003 first half)

Files changed:
* public/isms/anticommunism.html (new)
* public/isms/antifascism.html (new)
* public/isms/antisemitism.html (new)
* public/isms/aphorism.html (new)
* public/isms/apoliticism.html (new)
* public/isms.html (navigation — 5 links inserted after Anticolonialism)
* ISMS_PROGRESS.md, PROJECT_STATUS.md, CHANGELOG.md

Summary:
Created 5 Isms Batch 003 placeholder pages using the standard -isms template
and inserted alphabetically-ordered nav links into isms.html (between
Anticolonialism and Capitalism). Batch 003 now 5/10.

Reason:
Isms page creation — next eligible unblocked task. All P1/P2 tasks remain
blocked (images await source files; PS2 article and journal post require
Steven's source material). Within run limits (5 pages).

Next recommended task:
Isms Batch 003 second half — aristocratism, asceticism, associationism,
atheism, atomism.

## 2026-06-01 (autonomous run — language guides: Spanish for Korean speakers)

Files changed:
* tools/lang-guide/specs/spanish-ko.json (new)
* public/spanish-from-korean.html (new)
* public/spanish-srs-ko.js (new)
* public/language-guides.html (hub link added to Korean group)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — Spanish for Korean speakers (spanish-from-korean) —
via the spec-driven generator (tools/lang-guide/generate.js). Wrote spec spanish-ko.json
modelled on the Japanese-source spec spanish-ja.json for non-Romance structure, plus the
Korean-source style of hawaiian-ko.json / jejueo-korean.json (Korean headings, Hangul
glosses). Rewritten from the Korean learner's perspective, not translated. Includes a
104-card SRS deck (Español front / 한국어 back) and all standard sections: 단어 카드 (SRS),
Intro, 기본 단어 Top 100, 기본 문법, 발음, 한국어 화자가 자주 하는 실수 (9 items), 학습 자료
(11 resources), 문화와 배경, 관련 안내. Grammar section embeds a 26-row Español↔한국어
example-sentence table (exceeds the 25-sentence minimum). Hub link inserted into the
existing Korean group of language-guides.html (alphabetical order, after jejueo).

Grammar focus for Korean learners: SVO vs Korean SOV — the first and biggest structural
switch; grammatical gender + articles (el/la, un/una) — both absent in Korean, with tip
to memorise words as "la casa" not "casa"; person-based verb conjugation with full hablar
present-tense table (Korean verbs don't inflect for person); ser vs estar (한국어 이다/있다
maps to two distinct Spanish verbs); gustar construction framed as 「커피가 마음에 든다」
(target-as-subject, closer to Korean 좋다 than 좋아하다); pretérito vs imperfecto (Korean
uses context where Spanish uses different forms); personal *a* before human direct objects.
Pronunciation: l/r distinction (Korean ㄹ covers both — highlighted as the #1 phonetic
challenge); no epenthetic vowels in consonant clusters; trilled rr; the jota /x/; b/v
identity; stress accent pairs. Korea-specific resources: EBS 외국어 강좌, 네이버 스페인어사전,
세르반테스 문화원 서울; plus RAE, WordReference, Dreaming Spanish, News in Slow Spanish,
RTVE, Coffee Break Spanish, Duolingo, iTalki.

Reason:
Language Guides mission — Spanish is the #1 priority target; Korean was the last remaining
priority source missing for Spanish. This guide completes Spanish's entire priority-source
set. One guide per run, as required.

Verification:
node --check clean on the SRS deck; JSON parses; 104 cards; all required sections present;
26 example-sentence rows (exceeds 25 minimum); hub link present exactly once in the Korean
group. In-browser visual confirmation not possible in this environment.

Next recommended task:
Shift target to German (priority #2). Survey public/german-from-*.html to identify the
highest-priority missing source language and build that guide next.



## 2026-06-01 (autonomous run — language guides: Spanish for Portuguese speakers)

Files changed:
* tools/lang-guide/specs/spanish-pt.json (new)
* public/spanish-from-portuguese.html (new)
* public/spanish-srs-pt.js (new)
* public/language-guides.html (hub link added to Portuguese group)
* LANGUAGE_GUIDES_PROGRESS.md
* CHANGELOG.md

Summary:
Created one new language guide — Spanish for Portuguese speakers (spanish-from-portuguese) —
via the spec-driven generator (tools/lang-guide/generate.js). Wrote spec spanish-pt.json modelled
on the deployed-standard English→Spanish master and the Romance reference specs spanish-fr.json /
spanish-it.json for content, plus the Portuguese-source style of zulu-pt.json (Portuguese headings,
l1ColLabel "Português", l1Label "para lusófonos"). Rewritten from the lusophone learner's
perspective rather than translated. Includes a 106-card SRS deck (Español front / Português back)
and all standard sections: Cartões (SRS), Intro, Vocabulário (Top 100), Gramática essencial,
Pronúncia, Erros comuns dos lusófonos, Recursos (11), Cultura e contexto, Guias associados. The
grammar section embeds a 26-row Español→Português example-sentence table (exceeds the 25-sentence
minimum). Hub link inserted into the existing Portuguese group of language-guides.html (idempotent,
alphabetical — between shona and swahili).

As the closest Romance pair, the guide centres on the "portunhol" trap: false friends (exquisito,
largo, presunto, vaso, todavía, rato, oficina, borracha, brincar, cena); gustar vs gostar de (the
inverted construction, no de); muy vs mucho (Portuguese "muito" splits in two); the personal a
(absent in Portuguese); pretérito/imperfecto mapping to PT perfeito/imperfeito while warning that
he comido ≠ "tenho comido"; the future subjunctive Portuguese keeps but Spanish lost (quando
chegares → cuando llegues); fewer contractions (only al/del). Pronunciation targets the 5 pure
vowels with no nasal vowels and no vowel reduction, surd intervocalic s (casa = "cassa"), the jota
/x/ vs PT /ʒ/, ll/y vs lh, dropping the b/v distinction, and the año≠ano warning. Resources include
Portugal-facing references (Infopédia ES-PT / Porto Editora, Instituto Cervantes de Lisboa, Linguee
PT-ES) alongside RAE, Centro Virtual Cervantes, ProfeDeELE, Dreaming Spanish and others.
~12,569 visible characters — the deepest of all Spanish guides.

Reason:
Language Guides mission — fill the highest-priority missing target/source pair. Spanish is the #1
priority target; Portuguese was its highest-value remaining missing source (closest Romance pair =
fastest, highest-quality build). One guide per run, as required.

Verification:
node --check clean on the SRS deck; spec JSON parses; 106 cards; 9 sections present (all required
sections); 26 example-sentence rows; hub link present exactly once in the Portuguese group and
alphabetically ordered. In-browser visual confirmation not possible in this environment.

Next recommended task:
Spanish for Korean speakers (spanish-from-korean) — the last remaining priority source for Spanish;
budget for the heavier Korean-source build (Hangul glosses, model on hawaiian-ko.json /
jejueo-korean.json). After that, shift the target language to German (priority #2).


## 2026-06-01 (autonomous run — OLED contrast improvement)

Files changed:
* public/style.css (secondary-grey text tier #757575 → #888888, 7 occurrences)
* PROJECT_STATUS.md, CHANGELOG.md

Summary:
Raised the single below-AA secondary-grey value used for low-emphasis text
(#757575 ≈ 4.56:1 on #000) to the existing palette grey #888888 (≈ 5.92:1).
Affected elements: footer view-count, SRS done-stats, guide search icon,
filter-clear control, filter-results count, guide search placeholder, and one
srs-btn-flip hover border. No other greys, the pure-black background, or white
primary text were altered; no colours introduced.

Reason:
Highest-priority unblocked backlog item (P1 — Contrast Improvements). Image
and Aquaponics P1 tasks remain blocked on source files (see BLOCKERS.md), so
contrast was the eligible P1 work. Change is deliberately minimal per the OLED
theme rules ("only slightly increase contrast of secondary grey elements").

Verification:
CSS brace balance unchanged (309 open / 309 close); pure-black background rule
intact; 0 remaining #757575; diff confirms only the 7 intended hex swaps.
In-browser visual confirmation not possible in this environment.

Next recommended task:
Isms Batch 003 placeholder pages (up to 5), or a browser visual pass over the
contrast change once a browser is available.


## 2026-06-01 (autonomous run — Superorganism graph, session 2)

Files changed:
* public/isms/superorganism-graph.json (regenerated — 322 nodes / 379 edges)
* public/isms/superorganism.js (muted-by-default colour, labels-on-zoom, camera
  tween + search-to-match framing, keyboard shortcuts)
* public/isms/superorganism.html (zoom-label CSS, mobile + reduced-motion CSS)
* package.json (added "graph" npm script)
* GRAPH_PROGRESS.md, GRAPH_BACKLOG.md, GRAPH_DECISIONS.md, PROJECT_STATUS.md

Summary:
Incremental polish on the live knowledge graph. Refreshed stale graph data to
pick up 4 Isms pages added in a later run (now 322/379, all prior positions
reused). Nodes now read as a calm mostly-grey star map and saturate to category
colour on hover/search (new Decision 018), matching the ObsidianExample
reference. Added labels-on-zoom (hubs first), smooth search-to-match framing,
and keyboard shortcuts (/ search, Esc clear, F fit) plus mobile/reduced-motion
polish. Added `npm run graph`.

Reason:
Scheduled Superorganism improvement task. Targeted the highest-priority
unblocked items: page-discovery accuracy (stale data), then Obsidian-style
visual polish and search/a11y UX from the backlog.

Verification:
node --check clean on renderer + build script; JSON valid with 0 dangling edges
and 0 isolated nodes; all four assets serve 200 with correct MIME types via an
Express harness mirroring the real server. In-browser WebGL not visually
confirmable in this environment.

Next recommended task:
Browser visual pass (tune grey level / zoom-label threshold / tween) and wire
`npm run graph` into deploy so the graph never goes stale again.


## 2026-06-01 (autonomous run — isms Batch 002 completion)

Files changed:
* public/isms/amateurism.html (new)
* public/isms/animism.html (new)
* public/isms/anti-Americanism.html (new)
* public/isms/anticolonialism.html (new)
* public/isms.html (navigation)
* ISMS_PROGRESS.md, PROJECT_STATUS.md

Summary:
Created the 4 remaining Batch 002 Isms placeholder pages using the standard
-isms template, verified pre-existing anarchism.html matches the template, and
inserted nav links alphabetically into isms.html (between Altruism and
Capitalism). Batch 002 is now 10/10 — COMPLETE.

Reason:
Isms page creation — highest-priority unblocked task. P1 image/aquaponics tasks
remain blocked on source files; PS2 article and June journal post require
Steven's own source material (see BLOCKERS.md). Within run limits (5 pages).

Next recommended task:
Begin Isms Batch 003 placeholder pages (anticommunism, antifascism, antisemitism,
aphorism, apoliticism).


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
