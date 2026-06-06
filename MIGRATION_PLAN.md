# stevenlegg.xyz Migration Plan

**Target site:** https://www.stevenlegg.xyz
**Source (READ ONLY):** /Users/steven/Desktop/Web-Dev/website
**Target (WRITE):** /Users/steven/Desktop/Web-Dev/website-xyz (Git branch `stevenlegg-xyz`, checked out as a worktree)
**Process reference:** /Users/steven/Desktop/Web-Dev/website3.0 (reuse process; diverge on visual design)

## Stack (exact)
HTML, CSS, Tailwind, Next.js (frontend), Django (backend), Railway (hosting), PostgreSQL on Railway. **Not Supabase** (this is the deliberate divergence from website3.0, which used Supabase).

## Source snapshot (observed first run)
- Source is currently an Express + TypeScript app (`server.ts`, `tsx`), not yet Next.js/Django.
- Content: 54 markdown files under `content/` (pronunciation-guides + vocabulary), plus `pages/` markdown.
- `public/`: 226 generated HTML pages + 141 image/asset files.
- Prior migration `website3.0` already has `frontend/` (Next.js app dir) and `backend/` (Django: api, config, manage.py, requirements.txt) — reuse its scaffolding *patterns*, not its visuals.

## Audience & tone
Prospective employers, collaborators, readers of a personal portfolio/blog. Design: modern, confident, minimal, content-forward. Must be visibly distinct from `website` while preserving all content.

## Phases (ordered; each = a task checklist)

### Phase 1 — Branch + worktree + scaffold  *(dependency: none)*
1. [NEEDS APPROVAL — HIGH] Create branch `stevenlegg-xyz` + worktree at `website-xyz/` (alters source repo).
2. Scaffold Next.js + Tailwind frontend (reuse website3.0/frontend structure as pattern).
3. Base config: tsconfig, tailwind.config, eslint, .gitignore, .env.example (no secrets).
4. Verify `npm run build`.

### Phase 2 — Django backend + Railway PostgreSQL wiring  *(dependency: Phase 1)*
1. Scaffold Django project (reuse website3.0/backend pattern: api, config, manage.py, requirements.txt).
2. Configure PostgreSQL (Railway) via env vars — **no Supabase**, no hardcoded secrets.
3. [NEEDS APPROVAL — HIGH] DB provisioning / migrations on Railway.
4. Verify `python manage.py check`.

### Phase 3 — Content migration  *(dependency: Phase 1; precedes design polish)*
1. Inventory all source content (markdown, generated HTML, images) with source paths.
2. Migrate content into appropriate Next.js routes/data, citing source path per item.
3. Content-parity audit vs. source.

### Phase 4 — Iterative visual redesign  *(dependency: Phase 3 content in place)*
1. Establish DESIGN_SYSTEM.md (palette, type, spacing, components) — chosen reference aesthetic.
2. Navigation + layout redesign using named principles (Hick's Law, Gestalt, F-pattern, hierarchy, Fitts's Law).
3. Per significant decision: sketch 2 options in the log, commit the stronger with 1-line rationale.
4. Responsiveness: desktop, iOS, Android, both Android foldables. Target WCAG AA, Lighthouse ≥ 90.
5. Lock DESIGN_SYSTEM.md after sign-off.

### Phase 5 — Deploy  *(dependency: Phases 1–4)*
1. [NEEDS APPROVAL — HIGH] Railway deploy + domain (stevenlegg.xyz) wiring.
2. Post-deploy verification (Lighthouse, links, SEO).

## Per-run rules (summary)
One task + ≤150 changed LOC per run. Verify build before commit. Log risk actions under "Needs Human Approval" and switch to a safe task. Read only MIGRATION_PROGRESS.md + task-required files.
