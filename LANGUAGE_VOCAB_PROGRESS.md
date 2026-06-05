# LANGUAGE_VOCAB_PROGRESS.md

## Purpose

Track vocabulary expansion progress.

---

### Session Template

Date:

Pages Modified:

Vocabulary Added:

CSV Files Generated:

Duplicates Removed:

Issues Encountered:

Next Recommended Actions:

---

### Session 2026-06-04

Date: 2026-06-04

Pages Modified: none (source guide read-only). New files created: public/downloads/vocabulary/csv/english_to_spanish.csv, public/downloads/vocabulary/tsv/english_to_spanish.tsv, content/vocabulary/metadata/index.json.

Vocabulary Added: 36 English→Spanish entries (5 extracted from the guide's Practice Words table; 31 curated high-frequency CEFR A1 core words/phrases). Fields: l2_word, l1_translation, ipa_pronunciation, part_of_speech, grammatical_gender, l2_example_sentence, l1_example_translation, cefr_level, tags, source.

CSV Files Generated: english_to_spanish.csv and english_to_spanish.tsv (both UTF-8, Anki/Excel/LibreOffice/Sheets compatible). Diacritics, IPA, ñ preserved.

Duplicates Removed: 0 (no prior export existed; dedup check on l2_word passed — 36 unique).

Issues Encountered: Source guides are pronunciation guides, not vocabulary lists — each contains only a ~5-word Practice Words table. Remaining entries sourced from CEFR A1 high-frequency core vocabulary per Decision 001. Example sentences written as simple, grammatically correct A1 Spanish; none fabricated as definitions.

Next Recommended Actions: Build the next high-priority export (english_to_french or english_to_mandarin — Mandarin needs pinyin/tone_numbers fields). Then incrementally expand english_to_spanish toward the 100-entry Priority-1 target.

---

### Session 2026-06-05

Date: 2026-06-05

Pages Modified: none (source guide read-only). New files created: public/downloads/vocabulary/csv/english_to_french.csv, public/downloads/vocabulary/tsv/english_to_french.tsv. Updated: content/vocabulary/metadata/index.json.

Vocabulary Added: 36 English→French entries (5 extracted from the guide's Practice Words table: bonjour, merci, tu, pain, français; 31 curated high-frequency CEFR A1 core words/phrases). Fields: l2_word, l1_translation, ipa_pronunciation, part_of_speech, grammatical_gender, l2_example_sentence, l1_example_translation, cefr_level, tags, source.

CSV Files Generated: english_to_french.csv and english_to_french.tsv (both UTF-8, Anki/Excel/LibreOffice/Sheets compatible). IPA symbols including nasal vowels (/ɔ̃/, /ɑ̃/, /ɛ̃/, /œ̃/), /ʁ/, /y/, /ʃ/, /ʒ/ and French diacritics (é, è, ê, à, ô, û) preserved correctly.

Duplicates Removed: 0 (no prior export existed; dedup check on l2_word passed — 36 unique).

Issues Encountered: Same as previous session — source guide contains only a 5-word Practice Words table. Remaining entries sourced from CEFR A1 high-frequency core vocabulary per Decision 001. Example sentences are simple A1 French; grammatical genders assigned per standard French grammar references.

Next Recommended Actions: Build english_to_mandarin export (needs pinyin and tone_numbers fields per vocabulary-schema.md). Then incrementally expand english_to_french and english_to_spanish toward the 100-entry Priority-1 target.

---

### Session 2026-06-05 (run 2)

Date: 2026-06-05

Pages Modified: none (source guide read-only). New files created: public/downloads/vocabulary/csv/english_to_mandarin.csv, public/downloads/vocabulary/tsv/english_to_mandarin.tsv. Updated: content/vocabulary/metadata/index.json.

Vocabulary Added: 35 English→Mandarin entries (5 extracted from the guide's Practice Words table: 你好, 谢谢, 中国, 是, 女; 30 curated high-frequency HSK 1 core words). Fields: l2_word, l1_translation, pinyin, tone_numbers, ipa_pronunciation, part_of_speech, l2_example_sentence, l1_example_translation, hsk_level, tags, source. Mandarin-specific fields pinyin and tone_numbers added per vocabulary-schema.md. hsk_level used in place of cefr_level.

CSV Files Generated: english_to_mandarin.csv and english_to_mandarin.tsv (both UTF-8 Unix line endings, Anki/Excel/LibreOffice/Sheets compatible). Chinese characters, IPA tone diacritics (˥˩˧˨˩˦), pinyin tone marks (ǐ, ǎ, è, ǚ, ā, ó, etc.) all preserved correctly.

Duplicates Removed: 0 (no prior export existed; dedup check on l2_word passed — 35 unique entries).

Issues Encountered: Source guide contains only a 5-word Practice Words table. Remaining 30 entries sourced from HSK 1 high-frequency core vocabulary per Decision 001. Example sentences are simple HSK1-level Chinese; none fabricated as definitions. 他 and 她 share the same pinyin/IPA (tā, /tʰa˥/) — correctly differentiated by character and translation.

Next Recommended Actions: Incrementally expand english_to_spanish toward 100-entry Priority-1 target (currently at 36). Then expand english_to_french and english_to_mandarin similarly.

---

