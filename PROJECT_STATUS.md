# Project Status

Current Task:
None (run complete)

Completed:
Superorganism knowledge graph — implemented the full interactive Three.js graph.
Vendored Three.js r160 to public/vendor/ (CSP-compliant, no CDN); added
tools/graph/build-graph.mjs which auto-discovers all 318 pages, classifies them
by category, and generates a conservative 375-edge hub-and-spoke graph with
stable deterministic positions (public/isms/superorganism-graph.json); rewrote
public/isms/superorganism.html and added public/isms/superorganism.js — an
OLED-black, Obsidian-style renderer with hover (enlarge/label/highlight), click
navigation, category colours, a toggleable legend, and live search. Verified:
JSON valid, 0 dangling edges, 0 isolated nodes, positions preserved across
rebuilds, all four assets serve 200 with correct MIME types. (2026-06-01)

Blocked:
- Image tasks (GameBoy Advance SP, GameCube, Midnight Library, Aquaponics images) — awaiting source image files. See BLOCKERS.md.
- PS2 retro gaming article & June 1st 2026 journal post — first-person personal entries; blocked pending Steven's source notes/memories. See BLOCKERS.md.
- In-browser WebGL rendering could not be visually confirmed this run (no browser in the environment); logic and asset wiring are verified.

Next:
Open the Superorganism page in a real browser to sanity-check rendering on
desktop and mobile and tune sizing/zoom against the ObsidianExample images.
Then wire build-graph.mjs into the workflow (add npm script "graph") so the
graph regenerates whenever pages are added. See GRAPH_PROGRESS.md for the full
recommended next-task list.
