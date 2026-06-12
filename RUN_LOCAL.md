# Running stevenlegg.xyz locally (frontend + live backend)

Two processes: the Django API (`backend/`) and the Next.js site (`frontend/`).
Local env files (`backend/.env`, `frontend/.env.local`) are already created and
git-ignored, wiring the site to the backend at `http://localhost:8000`.

## 1. Backend (Django API) — terminal 1
```bash
cd website-xyz/backend
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                      # first time only
python manage.py migrate                             # creates local SQLite db
python manage.py runserver 8000
```
Verify it's live: `curl http://localhost:8000/api/health/` →
`{"status":"ok","database":"connected",...}`.

## 2. Frontend (Next.js) — terminal 2
```bash
cd website-xyz/frontend
npm install        # first time only
npm run dev        # http://localhost:3000
```
With the backend running, the "backend isn't responding" banner disappears and
the contact / newsletter forms post to the live API.

## Payments — intentionally OFF
`PAYMENTS_ENABLED=False` (in `backend/.env` and by default in settings), so the
`/api/pay/*` routes are **not mounted** — there is no checkout, webhook, or
paywall surface, and the frontend renders no payment UI. All documents and
downloads are free, served as static files from `frontend/public/downloads/`.
To work on payments later, flip `PAYMENTS_ENABLED=True` and add Stripe **test**
keys; nothing user-facing changes until the frontend is given payment UI.

## Going live (public URL) — Railway, user-gated
The public site needs a one-time deploy (provision Postgres, set secrets, deploy
both services, wire DNS). Those steps are in `DEPLOY.md`. They're irreversible /
credentialed, so they're left for you to run rather than automated.
