# Graph Progress

A running log of work on the Superorganism knowledge graph. Newest first.

---

## 2026-06-01 — Graph goes live (Phase 1 + most of Phase 2 & 4)

This session took the Superorganism page from an empty placeholder to a working,
interactive Three.js knowledge graph of the entire site.

### What was done
- **Self-hosted Three.js.** The site's CSP only allows same-origin scripts
  (`script-src 'self'` + Google Translate) and the project deliberately avoids
  CDNs for GDPR reasons. Three.js r160 was vendored to `public/vendor/`
  (module build + MIT licence) so it loads under the existing CSP — no server
  changes required.
- **Automatic page discovery + data generator.** New build script
  `tools/graph/build-graph.mjs` scans `public/**/*.html`, extracts each page's
  title (`<h1>`, falling back to `<title>`), classifies it into a site
  category, generates a conservative edge set, and computes stable node
  positions. Output: `public/isms/superorganism-graph.json`
  (**318 nodes, 375 edges**).
- **Conservative connections.** Hub-and-spoke model: every page links to its
  category hub, hubs link to the site centre (`index.html`), conlang mirror
  pages link to their edition index. A small curated set of semantic edges
  (e.g. existentialism↔absurdism, gamecube↔gba sp, capitalism↔communism) is
  layered on top. ~1.18 edges/node — sparse and readable, no clutter.
- **Stable positions.** Layout is deterministic (category sectors + golden-angle
  spiral seeded by a stable hash of each page path) and previous positions are
  reused on every rebuild, so nodes don't jump between updates (Decision 004).
- **Three.js renderer** (`public/isms/superorganism.js`): OLED-black canvas,
  single-draw-call glowing Points for nodes (custom shader), single-draw-call
  shader lines for edges, orthographic pan/zoom (drag + scroll, zoom-to-cursor),
  raycast hover and click.
  - Hover: enlarges the node, shows its title in a floating label, highlights
    direct connections and dims the rest.
  - Click: navigates to the page.
  - Category colour system per GRAPH_METADATA.md.
  - Clickable legend toggles categories on/off.
  - Live search box filters/locates pages; Enter opens the top match.
  - HUD shows page/link counts and controls hint.

### Files modified / created
- `public/vendor/three.module.min.js` (new — vendored Three.js r160)
- `public/vendor/THREE-LICENSE.txt` (new — MIT licence)
- `tools/graph/build-graph.mjs` (new — discovery + graph generator)
- `public/isms/superorganism-graph.json` (new — generated graph data)
- `public/isms/superorganism.html` (rewritten — full-viewport graph + overlay UI)
- `public/isms/superorganism.js` (new — Three.js renderer)
- `GRAPH_PROGRESS.md`, `GRAPH_BACKLOG.md`, `GRAPH_DECISIONS.md`,
  `GRAPH_STATUS.md`, `PROJECT_STATUS.md`, `CHANGELOG.md` (docs)

### Verification
- `node --check` passes on the renderer and the build script; JSON parses.
- Built graph has **0 dangling edges** and **0 isolated nodes**.
- Position preservation confirmed (318/318 reused on rebuild).
- Served the four assets through an Express static harness mirroring the real
  server: page, `superorganism.js`, the JSON, and the vendored Three.js all
  return **200** with correct MIME types (`application/javascript` for the
  module, required for ES-module import under `script-src 'self'`).
- Confirmed the vendored Three.js exports every symbol the renderer imports.
- Not verifiable headlessly: actual in-browser WebGL rendering (no browser in
  the run environment). Logic and asset wiring are validated; a visual pass in
  a real browser is the recommended first follow-up.

### Blockers
- None. (Couldn't visually confirm WebGL output in-session — see above.)

### Recommended next tasks
1. Open the page in a browser and sanity-check rendering on desktop + mobile;
   tune point sizes / zoom feel against the ObsidianExample screenshots.
2. Add the build step to the workflow (e.g. an npm script
   `"graph": "node tools/graph/build-graph.mjs"`) and run it whenever pages are
   added so the graph stays current.
3. Persist a per-node label-on-zoom threshold (Obsidian shows labels when
   zoomed in), not just on hover.
4. Expand curated semantic edges (GRAPH_LINK_QUEUE.md) — still conservative.
5. Consider a "focus" mode: clicking briefly highlights a node's neighbourhood
   before navigating, or a modifier-click to centre without leaving the page.
