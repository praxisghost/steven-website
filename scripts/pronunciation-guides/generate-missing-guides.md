# Pronunciation Guide Generation System

Your responsibilities:

1. Read:
content/pronunciation-guides/config/languages.json

2. Read:
content/pronunciation-guides/config/target-languages.json

3. Read:
content/pronunciation-guides/templates/pronunciation-guide-template.md

4. Read all existing guides in:
content/pronunciation-guides/generated/

5. Detect all missing guide combinations.

6. Generate ONLY missing guides.

7. Guides must:
- follow the template exactly
- be concise enough for a one-page PDF
- include IPA
- explain pronunciation from the perspective of the L1 speaker
- explain difficult sounds carefully
- include practical examples
- include common learner mistakes
- remain easy to scan visually

8. Save generated files using:

{l1-slug}__to__{l2-slug}.md

Example:
pronunciation-guide-example-turkish.jpeg

9. Update:
content/pronunciation-guides/metadata/index.json

10. Never overwrite existing guides unless explicitly instructed.

11. Prioritize:
- linguistic accuracy
- pedagogical clarity
- beginner friendliness
- concise formatting
- PDF readability
- mobile readability

12. If uncertain, prioritize clarity over linguistic complexity.
