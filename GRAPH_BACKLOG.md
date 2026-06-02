# Graph Backlog

Status legend: [x] done · [~] partial · [ ] todo

## Phase 1 — Core rendering  ✅ COMPLETE (2026-06-01)

* [x] Create Superorganism page
* [x] Create Three.js graph renderer
* [x] Create node renderer (single-draw-call glowing Points + shader)
* [x] Create edge renderer (single-draw-call shader lines)
* [x] Create camera controls (orthographic pan + zoom-to-cursor)
* [x] Create hover interactions (enlarge, label, highlight neighbours)
* [x] Create click navigation

## Phase 2 — Page discovery  ✅ COMPLETE (2026-06-01)

Done automatically by `tools/graph/build-graph.mjs` (scans public/**/*.html).
* [x] Discover all pages (322 nodes — refreshed 2026-06-01 session 2)
* [x] Discover all language guides
* [x] Discover all -ism pages
* [x] Discover all blog posts
* [x] Discover all retro gaming pages
* [x] Discover all project pages

## Phase 3 — Metadata & relationships  [~] PARTIAL

* [x] Generate categories (by directory + root-page overrides)
* [x] Generate relationships (conservative hub-and-spoke + curated semantic)
* [ ] Generate tags (no per-page tag source yet — needs frontmatter or a
      `<meta name="tags">` convention added to pages first)
* [ ] Generate richer metadata (last-modified dates, word counts) for sizing

## Phase 4 — Obsidian aesthetics  [~] MOSTLY DONE

* [x] OLED black theme
* [x] Category colours
* [x] Muted-by-default nodes; full category colour on hover/highlight/search
      (Decision 018) — matches reference image + GRAPH_METADATA
* [x] Hover animations (size + glow + neighbour highlight)
* [x] Labels (hover label + labels-on-zoom, hubs revealed first by degree)

## Phase 5 — Search & filtering  [~] PARTIAL

* [x] Search system (live filter + Enter-to-open)
* [x] Category filtering (clickable legend toggles)
* [x] Search: pan/zoom-to-match (eased camera tween frames matches)
* [ ] Relationship/edge-type filtering (e.g. show only semantic edges)

## Phase 6 — Mobile / perf / a11y  [~] PARTIAL

* [x] Touch pan/zoom works (pointer events + touch-action:none)
* [~] Mobile UI polish (legend/HUD repositioned, keyboard hints hidden on touch,
      smaller zoom labels; further tuning possible on real devices)
* [~] Performance: single draw call for nodes and for edges (scales well);
      not yet stress-tested at 1000s of nodes
* [~] Accessibility: keyboard shortcuts done (`/` search, `Esc` clear/reset,
      `F` fit); a text/list fallback view still TODO

## Phase 7 — Automation  [~] PARTIAL

* [x] Automatic page discovery (build script)
* [~] Automatic graph updates: `npm run graph` script added; still TODO to wire
      it into the deploy step (graph went stale once because of this)
* [ ] Automatic relationship suggestions (heuristic or LLM-assisted, still
      respecting the conservative connection philosophy)

