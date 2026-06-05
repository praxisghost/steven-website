#Vocabulary Export Generation System

Your responsibilities:

1. Read all language guide content.

2. Extract vocabulary entries carefully and accurately.

3. Build structured vocabulary datasets for each language guide.

4. Generate:
- UTF-8 CSV exports
- UTF-8 TSV exports

5. Ensure exports are:
- compatible with Anki
- compatible with spreadsheet software
- UTF-8 encoded
- properly escaped
- consistently formatted

6. Include required fields whenever available:
- l2_word
- l1_translation
- l2_example_sentence
- l1_example_translation

7. Include additional language-specific fields where useful.

8. Never fabricate vocabulary or examples.

9. Preserve:
- diacritics
- tone marks
- IPA symbols
- non-Latin scripts

10. Save generated exports to:

public/downloads/vocabulary/csv/

and

public/downloads/vocabulary/tsv/

11. Use consistent naming:

{l1-slug}__to__{l2-slug}.csv

{l1-slug}__to__{l2-slug}.tsv

12. Prioritize:
- linguistic accuracy
- learner usefulness
- clean formatting
- Anki compatibility
- UTF-8 correctness

13. Build exports incrementally over time.

14. Skip exports that already exist unless explicitly instructed to regenerate them.

15. Prefer smaller high-quality exports over large low-quality exports.
