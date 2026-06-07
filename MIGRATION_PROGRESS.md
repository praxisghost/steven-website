# Migration Progress — stevenlegg.xyz

Canonical state / changelog. Single source of truth. Read this first every run.

## Current phase
Phase 1 — Branch + worktree + scaffold.

## Status
- **Completed:** Planning files (run 1). Next.js + Tailwind frontend scaffold (run 2). Dependency install + typecheck verification (run 3). Content inventory + migration map (run 4): `CONTENT_MIGRATION_MAP.md` written — 415 HTML / ~110 photos / 54 md inventoried and mapped to App Router routes.
- **Current:** Content fully mapped, no code/asset moved yet. `next build` still BLOCKED in sandbox (SWC bus-error). Commit gated on worktree approval.
- **Next task:** Phase 3 step 1 — migrate Home + 12 primary nav pages from `public/*.html` to `frontend/app/**` (port copy, no design polish yet). Cap ~150 LOC → likely split (start: home + about + contact). Worktree + `next build` remain blocked.

## Needs Human Approval
- **[HIGH] Branch + worktree creation.** Run, from /Users/steven/Desktop/Web-Dev/website:
  `git worktree add -b stevenlegg-xyz ../website-xyz` *(or, if website-xyz already has files, move them aside first)*.
  Note: `website-xyz/` currently exists as a **plain folder** holding only these planning files. Per §7 the worktree was not auto-created. When approved, planning files can be committed onto the new branch.
- **[HIGH] Railway PostgreSQL provisioning / migrations** — deferred to Phase 2.
- **[HIGH] Railway deploy + domain wiring** — deferred to Phase 5.
- **[BLOCKER] Railway credentials** not present/verified — needed before Phase 2 DB work and Phase 5 deploy.
- **[MEDIUM] Dependency versions** — installed run 3. Note drift: `next` resolved to **15.5.19** (caret on ^15.1.6). React 19, Tailwind 3.4 as planned. Consider pinning exact versions before deploy.
- **[BLOCKER] `next build` cannot run in this sandbox.** `@next/swc-linux-arm64-gnu` (Next 15 native compiler) bus-errors (core dump, exit 135) on load — Ubuntu 22.04 / glibc 2.35 / aarch64. `next --version` and `tsc --noEmit` work, so this is an environment limitation, not a code defect. Real `next build` verification must run on the user's machine or CI (or via WASM/Babel fallback). Logged; not auto-worked-around to avoid altering the SWC build pipeline.

## Changelog
[2026-06-06 23:36] Task: First-run planning files | Changed: 3 files (~120 LOC, docs only) | Principle: n/a | Build: n/a (no code yet) | Status: on track | Confidence: H | Next: scaffold Next.js+Tailwind frontend (after worktree approval)
[2026-06-06 23:38] Task: Scaffold Next.js+Tailwind frontend | Changed: 11 files (~179 LOC; slightly over 150 cap — cohesive minimal scaffold, not split) | Principle: Hick's Law (single accent), F-pattern (65ch measure) | Build: deferred (needs npm install) | Status: on track | Confidence: H | Next: npm install + npm run build verify
[2026-06-06 23:42] Task: Install deps + verify build | Changed: 0 repo files (node_modules only, gitignored) | Principle: n/a | Build: tsc PASS; next build BLOCKED (SWC bus-error, env) | Status: blocked (env) → rescope next task to content migration | Confidence: M | Next: Phase 3 content inventory of /website
[2026-06-07 04:34] Task: Content inventory + migration map | Changed: 1 file (CONTENT_MIGRATION_MAP.md, ~130 LOC docs) | Principle: n/a (planning) | Build: n/a (no code) | Status: on track | Confidence: H | Next: migrate Home + primary nav pages (Phase 3 step 1)

## Notes / decisions this run (run 4)
- Inventoried `/website` (read-only): Express+TS static site, content in `public/` (415 HTML) + `content/` (54 md). Mapped every group → App Router routes in CONTENT_MIGRATION_MAP.md, citing source paths.
- Key sizes: 162 language SRS pages across 56 languages; 104 isms; 21 technology; 6 blog; 5 projects; ~110 photos; 2 mp3.
- Decision: migrate language guides from `content/**` markdown (single source), not the 162 generated HTML, to avoid duplication. io/ia/isv/nov are i18n mirrors → deferred to a later i18n task (logged, not lost).
- Excluded ops/tooling (GRAPH_*, translation-*, server.ts, budgets) from content scope; backend re-implemented in Django phase.
- Discrepancy noted: website-xyz is a standalone git repo on branch `stevenlegg-xyz`, not a worktree of /website per the plan. Proper worktree setup remains a HIGH approval item (see below).

## Notes / decisions this run (run 3)
- `npm install` succeeded (~40s, cache-warmed). `node_modules` is gitignored — no repo files changed this run, so nothing to commit; worktree approval not needed for this task.
- Verification: `tsc --noEmit` → EXIT 0 (scaffold type-correct). `next --version` → 15.5.19 OK.
- `next build` reproducibly bus-errors (exit 135) — isolated to `@next/swc-linux-arm64-gnu` loading in this sandbox (Ubuntu 22.04, glibc 2.35, aarch64; 3.9GB RAM, /dev/shm 2GB — not a resource shortfall). Did NOT add a Babel/WASM workaround, as that would alter the intended SWC pipeline for a sandbox-only bug. Flagged as a blocker for the user's machine/CI.
- §9 self-repair: no partial repo changes to revert. Rescoped next task away from in-sandbox build to content migration (Phase 3), which is unblocked.
