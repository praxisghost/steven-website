# Graph Progress

A running log of work on the Superorganism knowledge graph. Newest first.

---

## 2026-06-04 (session 4) — Auto-regeneration (no more stale graph) + edges

The recurring root cause finally fixed. For two sessions running, the graph JSON
had drifted behind the real page count because the build was only ever run by
hand (`npm run graph`). This session made staleness structurally impossible and
confirmed it by catching one more page the committed JSON had already missed.

### What was done
- **Graph now regenerates on every server boot (Priority 4 / Phase 7).**
  `server.ts` calls a new `refreshGraphData()` at startup — before
  `app.listen()` — which runs `tools/graph/build-graph.mjs` via `execFileSync`.
  Wrapped in try/catch, so a build failure only logs a warning and the site
  still serves the last-good JSON. Because Railway restarts the container on
  every deploy, the graph is now rebuilt from the current pages on every deploy
  and every restart. This covers all start paths (`npm start`, `npm run dev`),
  not just one npm lifecycle hook. **The graph can no longer go stale.**
- **`build` npm script added** (`node tools/graph/build-graph.mjs`) so the
  NIXPACKS build phase also regenerates the graph at image-build time — a second
  layer behind the runtime regen. (`graph` kept for manual runs.)
- **Staleness guard: `npm run graph:check` (`--check` mode).** New mode in the
  build script does a fresh in-memory build and diffs node/edge sets against the
  committed JSON **without writing**, exiting non-zero (code 2) on drift with a
  human-readable report of added/removed pages. Usable as a CI/pre-deploy gate.
- **Discovery refresh caught a missed page.** The first rebuild went
  **395 → 396 nodes** — `french-from-portuguese.html` existed on disk but was
  absent from the committed JSON (the exact drift this work prevents).
- **5 new conservative semantic edges** (Decision 020), classic
  philosophical/ideological opposites or strong thematic links, each within the
  max-3-semantic-edges-per-page rule: altruism↔egoism, hedonism↔asceticism,
  idealism↔realism, authoritarianism↔totalitarianism, socialism↔anarchism.
  Edges went **466 → 472**; density stayed sparse at **1.19 edges/node**.

### Files modified
- `server.ts` (new `refreshGraphData()` startup hook + `child_process` import)
- `package.json` (`build` + `graph:check` scripts)
- `tools/graph/build-graph.mjs` (5 curated edges + `--check` staleness guard)
- `public/isms/superorganism-graph.json` (regenerated — 396 nodes / 472 edges)
- `GRAPH_PROGRESS.md`, `GRAPH_BACKLOG.md`, `GRAPH_DECISIONS.md`,
  `GRAPH_STATUS.md`, `PROJECT_STATUS.md`, `CHANGELOG.md` (docs)

### Verification
- `node --check` passes on `build-graph.mjs`; `npx tsc --noEmit` passes (exit 0)
  on `server.ts` with the new hook.
- Rebuild: **396 nodes / 472 edges**; **0 positions moved, 0 dropped** (the 395
  prior nodes kept byte-identical positions — Decision 004/017); 1 new node
  (`french-from-portuguese.html`) placed deterministically.
- Edge integrity: **0 dangling, 0 duplicate, 0 isolated**; all 5 new semantic
  edges confirmed present.
- `npm run graph:check` reports **OK — graph is current** after the rebuild.
- Not verifiable headlessly: in-browser WebGL rendering (no browser in the run
  environment). Data/wiring validated; a visual pass remains the follow-up.

### Blockers
- None. The two-session-running staleness root cause is now resolved.

### Recommended next tasks
1. Visual pass in a real browser (desktop + mobile) against the ObsidianExample
   screenshot: rest-state grey level, zoom-label threshold, tween duration.
2. Optionally gate deploy on `npm run graph:check` in CI so any hand-committed
   stale JSON is rejected (the runtime regen already prevents stale serving).
3. Consider a `politics` category for `political-opinion.html` (currently grey
   `site`). Low priority (1 page).
4. Per-page tags (`<meta name="tags">`) to unlock tag-based relationships and
   richer node sizing — Phase 3.
5. Edge-type filtering (show only semantic edges) — Phase 5.

---

## 2026-06-04 (session 3) — Page-discovery refresh + new semantic edges

The graph JSON had gone stale again: **73 real pages existed on disk but were
missing from the graph** (the build script hadn't been re-run since the
2026-06-01 session 2, and many pages were added since — 38 new Isms, 16
technology/Linux + software-tutorials pages, 7 root-level `*-from-*` language
mirror pages, 3 blog posts, PlayStation 2, and more). This directly hit
Priority 2 (accurate page discovery), so it was the focus this session.

### What was done
- **Refreshed page discovery.** Re-ran `tools/graph/build-graph.mjs`. The graph
  went from **322 nodes / 379 edges → 395 nodes / 466 edges**. All 73 missing
  pages are now present. Verified existing classification logic handled every
  new page correctly (Isms → amber, technology/Linux subpages → technology,
  `*-from-*` mirrors → language, blog posts → blog, PlayStation 2 → retro).
- **Position stability confirmed (Decision 004 / 017).** All **322 original
  nodes kept byte-for-byte identical positions**; 0 moved, 0 dropped. The 73 new
  nodes received deterministic spiral positions and are now themselves persisted.
- **14 new conservative semantic edges** layered onto the curated set, all
  ideological opposites or strong thematic pairs among the newly discovered
  pages, each within the max-3-semantic-edges-per-page rule (GRAPH_CONNECTIONS):
  capitalism↔consumerism, communism↔anticommunism, fascism↔antifascism,
  conservatism↔centrism, atheism↔agnosticism, buddhism↔stoicism,
  catholicism↔calvinism, colonialism↔anticolonialism, colonialism↔imperialism,
  behaviorism↔constructivism, authoritarianism↔anarchism, modernism↔classicism,
  return-to-linux↔linux, and gamecube↔playstation-2. Edge density stayed at a
  sparse, readable **1.18 edges/node** (unchanged from session 2).

### Files modified
- `public/isms/superorganism-graph.json` (regenerated — 395 nodes / 466 edges)
- `tools/graph/build-graph.mjs` (added 14 curated semantic edges + a comment)
- `GRAPH_PROGRESS.md`, `GRAPH_BACKLOG.md`, `GRAPH_DECISIONS.md`,
  `GRAPH_STATUS.md`, `PROJECT_STATUS.md`, `CHANGELOG.md` (docs)

### Verification
- `node --check` passes on `superorganism.js` and `build-graph.mjs`; JSON parses.
- **0 dangling edges, 0 isolated nodes, 0 duplicate edges.**
- Position preservation proven by diff vs. the pre-build backup (322/322 exact).
- All 14 new semantic edges confirmed present in the output.
- Express-style static harness: page, JS, JSON, and vendored Three.js all return
  **200** with correct MIME types (`application/javascript` for the ES module —
  required under `script-src 'self'`).
- Not verifiable headlessly: in-browser WebGL rendering (no browser in the run
  environment). Data + asset wiring validated; a visual pass remains the
  recommended follow-up.

### Blockers
- None. (In-browser WebGL output still can't be visually confirmed in-session.)
- Root cause recurred: the graph went stale because `npm run graph` is still not
  wired into the deploy step. Automating this remains the top backlog item.

### Recommended next tasks
1. **Wire `npm run graph` into the deploy/build step** so the graph never goes
   stale again — this is the second session in a row the JSON drifted behind the
   page count. Highest-value next task.
2. Visual pass in a real browser (desktop + mobile) against the ObsidianExample
   screenshot: rest-state grey level, zoom-label threshold, tween duration.
3. Consider a `politics` category: `political-opinion.html` currently falls to
   grey `site` despite GRAPH_METADATA listing Politics. Low priority (1 page).
4. Expand curated semantic edges further as new Isms batches land.
5. Per-page tags (`<meta name="tags">`) to unlock tag-based relationships and
   richer node sizing — Phase 3.

---

## 2026-06-01 (session 2) — Freshness, Obsidian colour, zoom labels, search framing

Incremental polish pass on the live graph. Five improvements across page
discovery, visuals, and UX.

### What was done
- **Graph data refreshed (page-discovery accuracy).** Four Isms pages added in a
  later run — `amateurism`, `animism`, `anti-Americanism`, `anticolonialism` —
  existed on disk but were missing from the graph (stale JSON). Re-ran the build
  script: now **322 nodes, 379 edges** (was 318/375). 318/318 prior positions
  reused, so nothing moved (Decision 004 honoured).
- **`npm run graph` script added** (`package.json`) so the graph can be
  regenerated in one command whenever pages change (Phase 7 backlog item).
- **Muted-by-default node colour (Obsidian look).** Nodes now render as a calm,
  mostly-grey star map at rest and saturate to full category colour only when
  active (hover / neighbour / search). This reconciles GRAPH_METADATA ("default
  grey, category colour on hover") with the reference image, while keeping the
  category-colour system (new Decision 018). Implemented as a per-vertex `aMix`
  attribute blended in the node vertex shader — no extra draw calls.
- **Labels-on-zoom (Obsidian behaviour).** A pooled DOM label layer
  (`#so-zoom-labels`) shows page titles for the most important on-screen nodes,
  revealing more as you zoom in (hubs first, by degree). Complements the single
  hover label; stays invisible on the zoomed-out map so there's no clutter.
- **Search pans/zooms to matches.** Typing now smoothly frames the matching
  nodes (eased camera tween) once the query narrows to ≤24 hits, instead of only
  dimming the rest. Enter opens the page when exactly one match remains, else
  frames the matches. Tween respects `prefers-reduced-motion`.
- **Keyboard + mobile a11y.** `/` focuses search, `Esc` clears search / resets
  view, `F` fits the whole graph. Mobile: legend/HUD repositioned, keyboard
  hints hidden on touch, smaller zoom labels.

### Files modified
- `public/isms/superorganism-graph.json` (regenerated — 322 nodes / 379 edges)
- `public/isms/superorganism.js` (aMix muted colour, zoom-label layer, camera
  tween + search framing, keyboard shortcuts)
- `public/isms/superorganism.html` (zoom-label CSS, mobile + reduced-motion CSS)
- `package.json` (added `"graph"` script)
- `GRAPH_PROGRESS.md`, `GRAPH_BACKLOG.md`, `GRAPH_DECISIONS.md`,
  `PROJECT_STATUS.md`, `CHANGELOG.md` (docs)

### Verification
- `node --check` passes on the renderer and the build script.
- JSON parses; **0 dangling edges, 0 isolated nodes**; all four new Isms pages
  present with positions; 318 positions reused on rebuild.
- Express static harness (mirrors the real server): page, JS, JSON, and vendored
  Three.js all return **200** with correct MIME types
  (`application/javascript` for the ES module — required under `script-src 'self'`).
- Not verifiable headlessly: in-browser WebGL output (no browser in the run
  environment). Shader/attribute wiring reviewed; a visual pass is the
  recommended next step.

### Blockers
- None. (In-browser WebGL rendering still can't be visually confirmed in-session.)

### Recommended next tasks
1. Visual pass in a real browser on desktop + mobile: tune the rest-state grey
   level, zoom-label reveal threshold, and tween duration against the
   ObsidianExample screenshot.
2. Wire `npm run graph` into the deploy step so the graph never goes stale again
   (this session's root cause).
3. Expand curated semantic edges (GRAPH_LINK_QUEUE.md) — still conservative.
4. Edge-type filtering (show only semantic edges) — Phase 5.
5. Per-page tags (frontmatter or `<meta name="tags">`) to unlock tag-based
   relationships and richer node sizing — Phase 3.

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
