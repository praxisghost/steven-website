# Graph Status

Project Name

Website Knowledge Graph

Website Location

Writing → -isms → Superorganism

Purpose

Create an Obsidian-inspired Three.js visualization representing the entire website.

Current State

Live — interactive graph implemented (2026-06-01). 395 nodes, 466 edges
(page discovery refreshed 2026-06-04; was 322/379). Build script + renderer in
place. See GRAPH_PROGRESS.md.

Technology

* Three.js
* TypeScript
* Existing website architecture

Reference Images

/ObsidianExample/

Success Criteria

* Every real page becomes a node
* Every node links directly to its page
* Stable node positioning
* Obsidian-style aesthetics
* OLED black background
* Fast rendering
* Mobile compatible
* Scales to thousands of pages

Current Progress

* Visual planning complete
* Graph architecture implemented (build script -> JSON -> Three.js renderer)
* Metadata generation: categories + relationships done; tags pending
* Relationship generation: conservative hub-and-spoke + curated semantic edges
* Rendering implementation: complete (OLED black, hover, click, search, legend)
