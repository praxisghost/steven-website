# Salamander Images

Photos are served from `/img/salamanders/<filename>.jpeg` by `about.js`.

## Current images

| Filename | Common Name | Latin Name |
|---|---|---|
| arboreal-salamander.jpeg | Arboreal Salamander | Aneides lugubris |
| blue-spotted-salamander.jpeg | Blue-spotted Salamander | Ambystoma laterale |
| california-slender-salamander.jpeg | California Slender Salamander | Batrachoseps attenuatus |
| eastern-red-back-salamander.jpeg | Eastern Red-backed Salamander | Plethodon cinereus |
| four-toed-salamander.jpeg | Four-toed Salamander | Hemidactylium scutatum |
| green-salamander.jpeg | Green Salamander | Aneides aeneus |
| Hellbender-Salamander.jpeg | Hellbender | Cryptobranchus alleganiensis |
| marbled-salamander.jpeg | Marbled Salamander | Ambystoma opacum |
| mole-salamander.jpeg | Mole Salamander | Ambystoma talpoideum |
| northern-slimy-salamander.jpeg | Northern Slimy Salamander | Plethodon glutinosus |
| pacific-giant-salamander.jpeg | Pacific Giant Salamander | Dicamptodon tenebrosus |
| patch-nosed-salamander.jpeg | Patch-nosed Salamander | Urspelerpes brucei |
| red-salamander.jpeg | Red Salamander | Pseudotriton ruber |
| southern-torrent-salamander.jpeg | Southern Torrent Salamander | Rhyacotriton variegatus |
| spotted-salamander.jpeg | Spotted Salamander | Ambystoma maculatum |
| tiger-salamander.jpeg | Tiger Salamander | Ambystoma tigrinum |

## Adding a new photo

1. Save the photo as `public/img/salamanders/<filename>.jpeg`
2. Open `public/about.js`, find `ALL_SALAMANDERS`, and add an entry:
   ```js
   { slug: 'filename-without-extension', name: 'Common Name', latin: 'Latin name', active: true },
   ```
   The `slug` must match the filename exactly (including capitalisation).
3. Commit and push.

## Recommended format

- JPEG, `.jpeg` extension
- Max ~960 px on the long edge; 4:3 aspect ratio works best
- Quality ~80–85 %; aim for under 200 KB per file
