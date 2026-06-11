# Deploy runbook — stevenlegg.xyz (Phase 5)

Step-by-step to deploy the `stevenlegg-xyz` branch to Railway. **Several steps are HIGH-risk and
must be performed by a human** (provisioning, secrets, DNS) — they are flagged 🔴. Claude has
prepared all config/artifacts but does **not** auto-execute deploys, DB provisioning, or DNS
changes (§7 of the migration task).

## Architecture
Three Railway resources in one project:
1. **PostgreSQL** (Railway managed plugin) — the database. *Not* Supabase (§STACK).
2. **backend** — Django + Gunicorn API (service root `backend/`).
3. **frontend** — Next.js standalone server (service root `frontend/`).

The frontend calls the backend at `/api/*`; its own `/healthz` route server-side-proxies the
backend's `/api/health/` (liveness + DB check) and drives the degraded-state banner.

## Prerequisites
- Railway account + the GitHub repo connected, deploying the `stevenlegg-xyz` branch.
- Access to the `stevenlegg.xyz` domain's DNS.
- A long random `DJANGO_SECRET_KEY` (e.g. `python -c "import secrets;print(secrets.token_urlsafe(64))"`).

## 1. 🔴 Provision PostgreSQL
Railway → project → **New → Database → PostgreSQL**. This creates `DATABASE_URL`
(referenceable as `${{Postgres.DATABASE_URL}}`). *HIGH — creates a billable, stateful resource.*

## 2. Backend service (`backend/`)
Build/start are already defined in `backend/railway.toml`
(`migrate && gunicorn config.wsgi`). Set service **Root Directory = `backend`** and these
**Variables** (names from `backend/.env.example` — never commit real values):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `DATABASE_SSL` | `True` |
| `DJANGO_SECRET_KEY` | 🔴 the generated secret |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `api.stevenlegg.xyz` (+ Railway auto-adds `RAILWAY_PUBLIC_DOMAIN`) |
| `CORS_ALLOWED_ORIGINS` | `https://www.stevenlegg.xyz` |
| `CSRF_TRUSTED_ORIGINS` | `https://www.stevenlegg.xyz` |
| `NUM_PROXIES` | `1` |

Notes: migrations 🔴 run automatically on boot (`manage.py migrate` in the start command — this
is a schema-affecting action; review the first run). Static files for the admin are served by
WhiteNoise (`collectstatic` runs via Django's storage backend at build/boot as configured).
`DEBUG=False` auto-enables HTTPS redirect + secure cookies (settings.py).

## 3. Frontend service (`frontend/`)
`frontend/railway.toml` builds with standalone + copies static/public, and starts
`node .next/standalone/server.js`. Set service **Root Directory = `frontend`** and:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.stevenlegg.xyz` | public, baked into client bundle at build |
| `API_URL` | backend internal/public URL | server-only; used by `/healthz` proxy |

(`NEXT_PUBLIC_API_URL` is public and non-secret by design — it's only the API base URL.)

## 4. 🔴 Custom domain + DNS
- Frontend service → Settings → Domains → add `www.stevenlegg.xyz` (+ apex redirect if desired).
- Backend service → add `api.stevenlegg.xyz`.
- At the DNS provider, add the CNAME/verification records Railway shows (incl. the
  `_railway`-style verification record the `ErrorState` infra hint references).
*HIGH — external DNS change; propagation can take time.*

## 5. Post-deploy verification
- `https://www.stevenlegg.xyz/healthz` → **200** (backend reachable, DB connected). 503 ⇒ check
  `API_URL`, backend health, `DATABASE_URL`.
- `https://www.stevenlegg.xyz/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` resolve.
- Contact + newsletter forms POST successfully (CORS/CSRF correct).
- **Lighthouse on the live URL** (perf + a11y ≥ 90) — the final Phase-4 perf gate that can't be
  proven on localhost. a11y/SEO already verified (axe 0 violations; Lighthouse SEO 100, a11y 100;
  see `audit/`).

## Risk register (do not auto-execute)
| Action | Tier | Owner |
|--------|------|-------|
| Provision Postgres | 🔴 HIGH (billable, stateful) | human |
| Set secrets (`DJANGO_SECRET_KEY`, etc.) | 🔴 HIGH | human |
| Run DB migrations | 🔴 HIGH (schema) | human (auto-runs on boot — review) |
| DNS / custom domain | 🔴 HIGH (external) | human |
| Trigger deploy | 🔴 HIGH | human |
| Dependency-version bumps | 🟡 MEDIUM | human review |

## Secrets policy
Never commit real secrets or `.env`/`.env.local` (gitignored). Use only the `.env.example`
templates as the source of truth for variable names.
