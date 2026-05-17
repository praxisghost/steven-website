# Frog photos

The frog slideshow on `/misc.html` reads its images from this folder.
Each entry in the slideshow expects one file in here, named after the
species' `slug` field in `public/misc.js`.

## Expected filenames

Drop a `.jpg` for each of the following slugs:

- `american-bullfrog.jpg`
- `pacific-tree-frog.jpg`
- `wood-frog.jpg`
- `green-tree-frog.jpg`
- `northern-leopard-frog.jpg`
- `gray-tree-frog.jpg`
- `spring-peeper.jpg`
- `pickerel-frog.jpg`
- `red-legged-frog.jpg`
- `american-green-tree-frog.jpg`

If any of these files is missing, the slideshow will simply skip past
that species after the load fails — the page won't break.

## Format and sizing

- JPEG. Filename must be lowercase, kebab-case, ending in `.jpg`.
- Target around **640 px** on the long edge — the frame is rendered at
  a maximum of 480 px wide, so 640 px gives you a little headroom for
  high-DPI screens without bloating the page.
- Roughly **4:3 aspect ratio** matches the frame best. CSS uses
  `object-fit: cover`, so wider or taller photos will still display
  correctly — they'll just be cropped at the edges.
- Keep each file under **~150 KB** if you can. Use a JPEG quality of
  about 80% — visually identical, much smaller on the wire.

## Adding a new species

1. Save the photo as `public/img/frogs/<slug>.jpg`.
2. Open `public/misc.js`, find the `FROGS` array, add a new entry:
   ```js
   { slug: 'eastern-spadefoot', name: 'Eastern Spadefoot', latin: 'Scaphiopus holbrookii' },
   ```
3. Commit and push. That's it — no other code changes needed.

## Sourcing photos

Public-domain and Creative Commons photos of every species listed
above are easy to find on **Wikimedia Commons**
(<https://commons.wikimedia.org>). Search for the species' Latin name,
pick a photo, and confirm its license is `Public Domain`, `CC0`, or a
`CC BY` / `CC BY-SA` variant. Credit the photographer in this README
if the licence requires attribution.

iNaturalist (<https://www.inaturalist.org>) is another good source —
filter for "All rights reserved — No" to see freely-licensed photos.

You can hot-link from Wikimedia, but it's discouraged and unreliable
(URLs change, hotlink protection blocks third-party sites, and you
have to broaden the site's Content-Security-Policy to include the
external host). Self-hosting is simpler and more durable.
