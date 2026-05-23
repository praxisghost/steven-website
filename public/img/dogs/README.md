# Dog Breed Images

Photos are served from `/img/dogs/<filename>.jpeg` by `photos.js`.

## Current images

| Filename | Breed |
|---|---|
| AmericanFoxhound-BorderCollie.jpeg | American Foxhound / Border Collie Mix |
| beagle.jpeg | Beagle |
| coonhound-pointer.jpeg | Coonhound / Pointer Mix |
| dalmation.jpeg | Dalmatian |
| Doberman-Dalmation.jpeg | Doberman / Dalmatian Mix |
| doberman-germanshepherd.jpeg | Doberman / German Shepherd Mix |
| German-Pinscher.jpeg | German Pinscher |
| GermanShepherd-BorderCollie.jpeg | German Shepherd / Border Collie Mix |
| greatdane-dalmation.jpeg | Great Dane / Dalmatian Mix |
| greatdane-germanshepherd.jpeg | Great Dane / German Shepherd Mix |
| labrador-retriever.jpeg | Labrador Retriever |

## Adding a new photo

1. Save the photo as `public/img/dogs/<filename>.jpeg`
2. Open `public/photos.js`, find `ALL_DOGS`, and add an entry:
   ```js
   { slug: 'filename-without-extension', name: 'Breed Name', active: true },
   ```
   The `slug` must match the filename exactly (including capitalisation).
3. Commit and push.

## Recommended format

- JPEG, `.jpeg` extension
- Max ~960 px on the long edge; 4:3 aspect ratio works best
- Quality ~80–85 %; aim for under 200 KB per file
