# Vocabulary Export Schema

Every vocabulary export row should contain the following fields whenever possible.

Required fields:

- l2_word
- l1_translation
- l2_example_sentence
- l1_example_translation

Preferred additional fields:

- ipa_pronunciation
- romanization
- part_of_speech
- grammatical_gender
- plural_form
- classifier
- tone_information
- formality_level
- frequency_level
- synonyms
- antonyms
- notes
- tags

Language-specific fields may be added where useful.

Examples:

Mandarin:
- pinyin
- tone_numbers

Arabic:
- root
- transliteration

Japanese:
- kana
- pitch_accent

Korean:
- hangul
- romanization

Turkish:
- vowel_harmony_notes

The dataset must remain:
- UTF-8 encoded
- spreadsheet compatible
- Anki compatible
- machine-readable
- human-readable
