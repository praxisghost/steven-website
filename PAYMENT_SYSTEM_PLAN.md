# PAYMENT_SYSTEM_PLAN.md

Canonical plan for the Stripe payment + access-control system on `website-xyz`
(branch `stevenlegg-xyz`). This is the high-level plan and **deployment-readiness
checklist**; the full engineering design (data-flow diagrams, per-event handling,
risk matrix, testing matrix) lives in **`backend/PAYMENTS_DESIGN.md`**, and the
implementation is the **`backend/payments/`** Django app.

**Status:** designed + scaffolded + **verified against real Django 5.1.5** (check
clean, flake8 clean, 15/15 tests pass). **NOT deployed. NOT live.** All endpoints
are gated behind `PAYMENTS_ENABLED` (default **False**) — they do not exist on the
deployed app until deliberately enabled after the Stripe test pass.

> **Assumptions** (labeled per project rules; confirm before build): end-user
> auth does not exist yet — design assumes Django session auth fronted by Next.js
> route handlers; the Minecraft server is reachable from Django over Railway's
> **private** network with RCON never publicly exposed; protected downloads live
> in a **private** dir or signed-URL object storage; one Stripe account, test mode
> now → live keys at launch. Full assumption list in `backend/PAYMENTS_DESIGN.md` §1.

---

## 1. Stripe architecture (summary)

- **Hosted Stripe Checkout** (not a custom card form) → offloads PCI scope, SCA/3DS,
  and wallets to Stripe.
- **Stripe = source of truth for *payment*; the DB `Entitlement` row = source of
  truth for *access*.** Entitlement is written **only** by signature-verified,
  idempotent webhook handlers — never from client input.
- **Two product modes:** `$2.99/mo` Minecraft subscription (recurring) and `$0.99`
  one-time digital downloads (CSV vocab lists, Anki decks, Excel/budget templates
  are future one-time products — new DB rows, no new code).
- **Minecraft access** enforced via **RCON whitelist add/remove** (+ kick on revoke),
  isolated in `payments/minecraft.py` so a game-server outage never discards a
  verified payment.
- **Webhooks handled:** `checkout.session.completed`, `invoice.paid`,
  `invoice.payment_failed`, `customer.subscription.updated`,
  `customer.subscription.deleted`, `charge.refunded`.
- **Failsafe reconcile job** (`manage.py reconcile_entitlements`, nightly) expires
  stale subscription entitlements if a webhook is missed and retries drifted RCON
  provisioning.

## 2. Data model (in `payments/models.py`)

`Customer` (1:1 auth user ↔ Stripe customer + MC username) · `Product`
(kind: subscription|one_time) · `Price` (cents/interval) · `Subscription`
(Stripe mirror) · `Purchase` (one-time, dedupe key = checkout session id) ·
**`Entitlement`** (derived single-source-of-truth; `UNIQUE(customer, product)`;
`active` + `expires_at` fail-closed + `provisioned` for external side effects) ·
`WebhookEvent` (unique `stripe_event_id` → idempotency ledger). Schema diagram +
column detail in `backend/PAYMENTS_DESIGN.md` §4; migration `0001_initial.py` is
`makemigrations --check`-clean.

## 3. Access control model

- **One gate function:** `payments/access.py::has_access(user, slug)` — fail-closed
  (auth + customer + active entitlement + not expired). Never consults the client.
- **Grant:** webhook → `Entitlement.active=True` (+ RCON add for Minecraft / +
  permanent flag for downloads).
- **Revoke (automatic, no manual step):** cancel / past-due / unpaid / deleted /
  refunded → `active=False` (+ RCON remove + kick). `expires_at` fails closed even
  if the final webhook is missed; reconcile job re-syncs drift.
- **Download protection:** `payments/downloads.py` — entitlement check **before**
  delivery, then a short-lived signed URL (object storage) or a path-traversal-safe
  private-file stream. Files never sit at a public URL.

## 4. Security requirements (implemented)

- Webhook **signature verification** (`construct_event` + `STRIPE_WEBHOOK_SECRET`);
  bad/missing signature → 400, zero DB writes.
- **Idempotency:** insert-before-process on unique `stripe_event_id`; reconcilers
  use `get_or_create`/`update_or_create` on Stripe ids → handlers run at most once.
- **No client-trusted payment confirmation** anywhere.
- **Secrets** only from env (`.env` gitignored, `.env.example` valueless); never
  logged, never committed. RCON creds private-network only.
- **Test/prod separation:** `PAYMENTS_ENABLED` flag unmounts all routes pre-launch;
  `Customer.livemode`/`WebhookEvent.livemode` tag rows so test ≠ live access.

## 5. Stripe payout flow & Venmo

- Stripe pays out to **bank accounts**, some **virtual bank accounts** (Wise,
  Revolut, N26), and **debit cards** (Instant Payouts, ~1.5% US fee).
- **Venmo is NOT a Stripe payout destination, and NOT a Stripe payment method.**
  You cannot deposit Stripe revenue into a Venmo / "Venmo Business" balance.
- **Recommended production approach:** Stripe → **business bank account** (standard
  ~2-day) or Instant Payout to a debit card; move bank → Venmo separately if desired.
  Entering Venmo's direct-deposit routing/account numbers as a Stripe destination is
  **not recommended** (consumer account → payout holds/verification mismatches,
  bookkeeping/tax noise). Payout setup is a Stripe-dashboard task, not code.
- Sources: Stripe — Receive payouts (`docs.stripe.com/payouts`); Institution support
  for Instant Payouts (`docs.stripe.com/payouts/instant-payouts-banks`).

---

## 6. Payment validation status (Stripe test plan)

| Requirement | Method | Status |
|---|---|---|
| Server-side verification | webhook signature + idempotency | ✅ implemented + unit-tested |
| Successful subscription | unit test + `stripe trigger` (manual) | ✅ unit-tested · ⏳ live CLI run pending keys |
| Failed payment | `invoice.payment_failed` → no access | ✅ unit-tested · ⏳ live CLI run pending |
| Cancellation | `customer.subscription.deleted` → revoke + kick | ✅ unit-tested · ⏳ live CLI run pending |
| One-time purchase | `checkout.session.completed` → entitlement | ✅ unit-tested · ⏳ live CLI run pending |
| Refund | `charge.refunded` → revoke | ✅ unit-tested · ⏳ live CLI run pending |
| Webhook simulation | Stripe CLI `listen`/`trigger` | ⏳ requires test keys + `stripe` CLI |

Automated suite: `python manage.py test payments` → **15/15 pass** against real
Django (migration applied). Live CLI simulation is the one remaining step and needs
your Stripe **test** keys in a local `.env` (never committed).

---

## 7. Deployment-readiness checklist

Nothing here is auto-executed — deploy/DB/credential items are **HIGH risk** and
need your explicit go-ahead. Order matters.

### Pre-flight (before enabling payments)
- [ ] Add buyer **authentication** (assumption — does not exist yet). Without it,
      `has_access` always denies and checkout has no user to attach.
- [ ] Create a local `.env` (outside git) with **Stripe TEST keys**
      (`sk_test_…`, `pk_test_…`) and `STRIPE_WEBHOOK_SECRET` from `stripe listen`.
- [ ] Create Stripe **test-mode** Products + Prices ($2.99/mo Minecraft; $0.99
      download); mirror ids into DB `Product`/`Price` rows.
- [ ] Run `stripe listen --forward-to localhost:8000/api/pay/webhook/stripe/`; drive
      a full subscribe → cancel and a one-time purchase; confirm correct `Entitlement`
      rows and that replays don't duplicate.
- [ ] Stand up a **staging** Minecraft server; verify RCON add/remove + kick over the
      private network; verify the reconcile job heals a forced drift.
- [ ] Configure protected downloads (`PAYMENTS_DOWNLOAD_DIR` private dir **or**
      `PAYMENTS_STORAGE_SIGNED=True` object storage); confirm a 403 without entitlement.

### Backend deploy (Railway) — HIGH risk, request approval
- [ ] Set service env: `DJANGO_DEBUG=False`, strong `DJANGO_SECRET_KEY` (≥50 chars),
      `SECURE_HSTS_SECONDS` (e.g. 31536000), `DATABASE_URL` (reference, not literal),
      `STRIPE_*` (live), `RCON_*`, `FRONTEND_BASE_URL`, `PAYMENTS_*`.
- [ ] `pip install -r requirements.txt` includes pinned `stripe==11.4.1`,
      `mcrcon==0.7.0`.
- [ ] Run DB migration against Railway Postgres (**HIGH risk** — confirm target is
      not a prod DB you can't roll back; back up first).
- [ ] `python manage.py check --deploy` clean (HSTS + SECRET_KEY are the two known
      warnings to clear via env).
- [ ] Register the **production** webhook endpoint in the Stripe dashboard; copy its
      signing secret into `STRIPE_WEBHOOK_SECRET`.
- [ ] CORS allows only `https://www.stevenlegg.xyz`.

### Go-live flip
- [ ] Switch Stripe keys test → **live**.
- [ ] Set `PAYMENTS_ENABLED=True` (mounts `/api/pay/*`).
- [ ] Schedule `manage.py reconcile_entitlements` nightly (Railway cron).
- [ ] Confirm payout **business bank account** is set in Stripe (not Venmo).
- [ ] Post-deploy: watch Railway error rate (< 1%); smoke-test one real purchase +
      refund; verify `/api/health/` and `/healthz` return 200.

### Rollback
- [ ] Keep the previous deployment available; if health checks fail > 90s, Railway
      auto-reverts (configured once by the user).
- [ ] To disable payments instantly without redeploying code: set
      `PAYMENTS_ENABLED=False` → routes unmount.

---

## Files

- Plan (this file): `PAYMENT_SYSTEM_PLAN.md`
- Full design: `backend/PAYMENTS_DESIGN.md`
- Implementation: `backend/payments/` (models, services, views, access, downloads,
  minecraft, admin, urls, tests, `migrations/0001_initial.py`,
  `management/commands/reconcile_entitlements.py`)
- Settings/flag: `backend/config/{settings.py,urls.py}` · env template:
  `backend/.env.example` · lint config: `backend/setup.cfg`
