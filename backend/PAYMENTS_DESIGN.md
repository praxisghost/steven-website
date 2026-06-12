# Payments & Access — Backend Design

**Project:** website-xyz (stevenlegg.xyz) · **Status:** development / test-mode only — **NOT live** · **Author role:** payment-systems design pass

This document specifies a Stripe-based backend for selling a **$2.99/month Minecraft subscription** and **$0.99 one-time digital downloads** (with CSV vocab lists and Anki decks as future one-time products). It is paired with a **test-mode-only code skeleton** committed in `backend/payments/` — every endpoint is gated behind `PAYMENTS_ENABLED` (default **False**), so nothing in here is reachable on the deployed site yet.

Everything marked **[ASSUMPTION]** is a gap I filled with a sensible default; confirm or correct each before build.

---

## 1. Assumptions & Clarifications

Grounded facts (read from the existing repo, not assumed):

- **Backend** is Django 5.1.5 + Django REST Framework, single `api` app, served by gunicorn + WhiteNoise. DRF default auth is `SessionAuthentication`, default permission `AllowAny`.
- **Database** is PostgreSQL on Railway via `DATABASE_URL` (sqlite fallback locally). No Supabase.
- **Frontend** is Next.js (App Router) at `https://www.stevenlegg.xyz`; it prefers calling Django through same-origin route handlers (`API_URL` server-only / internal Railway hostname).
- **No auth system for end users exists yet** — there are no login/accounts; the only `auth` usage is Django admin. The `api` app endpoints are public (contact/newsletter/views).

Missing information I need from you (each carries a **[ASSUMPTION]** default I used so the design is complete):

1. **End-user authentication.** There is no customer login today. **[ASSUMPTION]** I assume we add Django's built-in session auth (username/email + password) for buyers, fronted by Next.js same-origin route handlers. If you'd rather use a hosted identity provider (e.g. Stripe-only "magic link by email", or an OAuth provider), the `Customer ↔ User` link stays the same but the login flow changes.
2. **Minecraft server reachability.** RCON enforcement (chosen) requires the backend to reach the game server's RCON port over a **private** network. **[ASSUMPTION]** The MC server is reachable from the Django service on Railway's private network (or a VPN), and RCON is **never** publicly exposed.
3. **Minecraft username capture.** I assume the player's MC username (Java edition) is collected at checkout and stored on `Customer.minecraft_username`. **[ASSUMPTION]** Java edition (offline-safe `whitelist add <name>`); Bedrock/Geyser would need XUID handling instead.
4. **Download hosting.** Where the $0.99 files live. **[ASSUMPTION]** Private object storage (or a Railway volume) served via short-lived signed URLs minted by Django after an entitlement check — never a public path.
5. **Tax / VAT handling.** **[ASSUMPTION]** Out of scope for MVP; enable **Stripe Tax** before going live if selling into VAT jurisdictions.
6. **One Stripe account, two modes.** **[ASSUMPTION]** Same Stripe account in test mode now, flipped to live keys at launch — no separate accounts.

Headline risks / unknowns (full treatment in §7):

- **Webhook is the only trust boundary.** If signature verification or idempotency is wrong, access can be granted without payment, or double-granted.
- **RCON side effects can fail independently of payment.** The design must record the verified payment even when the game-server call fails, and reconcile later.
- **No accounts yet** means the whole buyer-auth surface is new code and the largest unknown.
- **Venmo is not a Stripe payment method** (see §3.6) — it only matters as a *payout* destination, and Stripe does not pay out to Venmo. This changes how you withdraw funds, not how you charge.

---

## 2. System Architecture Overview

### Components

| Component | Role |
|---|---|
| **Next.js frontend** | Renders store/product pages, gates protected UI, proxies data + checkout calls to Django via **same-origin route handlers** (so the browser never holds Stripe secrets or calls Stripe directly for entitlement). |
| **Django + DRF backend** | Owns all money/access logic: creates Checkout Sessions, receives + verifies Stripe webhooks, writes the entitlement source of truth, performs the Minecraft RCON side effect, mints signed download URLs. |
| **Stripe** | Hosted Checkout (card entry, SCA/3DS), subscription billing engine, source of truth for *payment* state, sender of signed webhook events. |
| **PostgreSQL (Railway)** | Stores users, customers, products/prices, subscriptions, purchases, the derived `Entitlement` table, and the `WebhookEvent` idempotency ledger. |
| **Minecraft server** | Receives `whitelist add/remove` + `kick` over RCON on the private network. |

### Text diagram

```
                      (1) browse / buy
   Browser  ───────────────────────────────►  Next.js (App Router)
      ▲  │                                         │  same-origin route handler
      │  │ (7) signed download URL / 403           │  (server-side, API_URL internal)
      │  ▼                                         ▼
      │  hosted Checkout page  ◄──(2) redirect── Django + DRF
      │        │                                  │   create Checkout Session
      │        │ (3) pays card (SCA/3DS)          │
      │        ▼                                  │
      │      Stripe ──(4) signed webhook POST────►│  /api/pay/webhook/stripe/
      │        │      checkout.session.completed  │   verify sig → dedupe → dispatch
      │        │      invoice.paid                │        │
      │        │      customer.subscription.*     ▼        ▼
      │        │                          PostgreSQL    Minecraft (RCON)
      │        │                          Entitlement   whitelist add/remove
      └────────┴── (5) Stripe is source of truth for PAYMENT
                    DB Entitlement is source of truth for ACCESS  (6)
```

### Data flow — subscription purchase ($2.99/mo Minecraft)

1. Logged-in user clicks **Subscribe**; provides MC username (stored on `Customer`).
2. Next route handler → Django `create_checkout_session` (mode=`subscription`, `customer=cus_…`, our ids in `metadata`).
3. Browser redirected to Stripe hosted Checkout; pays (test card now).
4. Stripe fires `checkout.session.completed`, then `invoice.paid`, then `customer.subscription.updated`.
5. Django verifies each event's signature, dedupes by event id, calls `sync_subscription` → upserts `Subscription`, recomputes `Entitlement.active=True`, and on the active transition runs `whitelist add <user>` via RCON.
6. User now passes `has_access(user, "minecraft")`; the server lets them join.

### Data flow — one-time purchase ($0.99 download)

1. User clicks **Buy**; route handler → `create_checkout_session` (mode=`payment`).
2. Pay on hosted Checkout → Stripe fires `checkout.session.completed` with `payment_status=paid`.
3. Django verifies + dedupes, calls `grant_one_time` → creates `Purchase` + permanent `Entitlement`.
4. To download, the user hits a Django endpoint that checks the entitlement and mints a short-lived signed URL.

### Data flow — payment failure / cancellation

- **Card fails on renewal:** Stripe retries (dunning), subscription goes `past_due` then `unpaid`/`canceled`. We receive `invoice.payment_failed` / `customer.subscription.updated|deleted`, recompute `Entitlement.active=False`, and run `whitelist remove` + `kick`.
- **User cancels:** `cancel_at_period_end=True` keeps access until `current_period_end`; at period end Stripe fires `customer.subscription.deleted` → access revoked. (A failsafe: `Entitlement.expires_at` makes `is_valid()` fail closed even if that final webhook is missed.)

---

## 3. Stripe Implementation Design

### 3.1 Product + pricing configuration strategy

- Create **Products** and **Prices** in the Stripe dashboard (or via API) **in test mode first**. Mirror each into our DB (`Product`, `Price`) keyed by `stripe_product_id` / `stripe_price_id`, plus an internal `slug` (`minecraft`, `budget-template`) that the app references — so we can re-point to a new Stripe Price without touching app logic.
- **Minecraft:** one recurring Price, `unit_amount=299`, `currency=usd`, `interval=month`.
- **Downloads:** one one-time Price each, `unit_amount=99`. Future CSV/Anki products are just new `Product(kind=one_time)` rows — no new code (see §8 Phase 4).
- **Never trust client-sent amounts.** The browser sends only a `price` slug/id; the server resolves the real `Price`.

### 3.2 Checkout session design

Use **Stripe Checkout (hosted)** rather than a custom card form — it offloads PCI scope, SCA/3DS, and wallets to Stripe. `create_checkout_session` (see `payments/services.py`):

- `mode` derived from product kind (`subscription` vs `payment`).
- Always tied to a known `customer=cus_…` so subscriptions and purchase history attach to one Stripe Customer.
- `metadata` carries `customer_pk` + `product_slug` so the webhook maps the event back to our rows **without trusting the browser**.
- `success_url` / `cancel_url` point at Next.js pages; the success page shows "provisioning…" and polls our access endpoint rather than granting anything itself.

### 3.3 Webhook events handled

| Event | Action |
|---|---|
| `checkout.session.completed` | One-time + `payment_status=paid` → `grant_one_time` (Purchase + permanent Entitlement). Subscription mode → no-op here (handled by subscription events). |
| `invoice.paid` | Subscription renewed/started → `sync_subscription` (extend period, keep access on). |
| `invoice.payment_failed` | Renewal failed → `sync_subscription` (status `past_due` → access off when no longer entitling). |
| `customer.subscription.updated` | Status / period / cancel-at-period-end change → recompute entitlement. |
| `customer.subscription.deleted` | Subscription ended → `Entitlement.active=False` + RCON remove. |

All other event types are acknowledged with `200` (so Stripe stops retrying) and recorded for audit, but not acted on.

### 3.4 Security best practices (implemented in the skeleton)

- **Signature verification:** every request is verified with `stripe.Webhook.construct_event(payload, Stripe-Signature, STRIPE_WEBHOOK_SECRET)`. Bad/missing signature → `400`, no DB writes. The raw body is used (never re-serialized JSON), and the view is `@csrf_exempt` + `POST`-only.
- **Idempotency:** `WebhookEvent` has a `unique` `stripe_event_id`. We **insert before processing**; a duplicate delivery collides on the constraint and is skipped, so each handler runs **at most once**. Reconciliation writes use `get_or_create` / `update_or_create` keyed on Stripe ids, so they're safe to replay.
- **Retry semantics:** if a handler throws, we return `500` so Stripe retries with backoff; the event row stays unprocessed until a delivery succeeds.
- **Least trust:** entitlement is written **only** by webhook-driven service functions, never by a request handler reading client input.
- **Secrets:** all keys from env (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, RCON creds); `.env` is gitignored; `.env.example` lists keys with **no values**.

### 3.5 Test vs production separation

- **Test mode now:** `sk_test_…` / `pk_test_…`, and a webhook secret from `stripe listen`. `PAYMENTS_ENABLED=False` keeps routes unmounted entirely.
- **Production later:** swap to live keys + a dashboard-registered webhook endpoint secret, set `PAYMENTS_ENABLED=True`. `Customer.livemode` / `WebhookEvent.livemode` tag rows so test and live data never cross-grant access.

### 3.6 Venmo — feasibility and the correct flow

**Venmo is not usable as a Stripe payment method, and Stripe does not pay out to Venmo.** Two separate things get conflated here:

- **Charging customers:** Stripe's consumer-wallet support is **Cash App, Apple Pay, Google Pay, Link** — *not* Venmo. Venmo (a PayPal product) is only accept-able via PayPal/Braintree, a different processor. So you cannot "let buyers pay with Venmo" through Stripe.
- **Withdrawing your revenue:** Stripe pays out **only to a bank account** (or Stripe-issued card/Instant Payouts to a debit card). It cannot deposit into a Venmo or "Venmo Business" balance.

Per Stripe's current payout docs, eligible payout destinations are: **bank accounts**, some **virtual bank accounts** (Wise, Revolut, N26), and **debit cards** (Instant Payouts, ~1.5% fee in the US). Venmo is on none of these lists.

**Correct flow:** Stripe → your **business bank account** (standard ~2-day) or Instant Payout to a linked debit card. If you specifically want the money to land in Venmo, do it in two hops: Stripe → bank account, then bank → Venmo via Venmo's own bank link.

**The "can I just use Venmo's account number?" edge case:** Venmo issues a routing + account number (via its banking partner) for direct deposit. You *could* technically try entering those as a Stripe external bank account, but it's **not recommended**: it's a consumer account behind the scenes, name/verification mismatches commonly trigger Stripe payout holds or rejections, and it muddies business bookkeeping and tax reporting. Use a real business bank account instead.

**[ASSUMPTION]** you have (or will open) a business bank account for Stripe payouts; that's the only payout setup the backend cares about, and it's configured in the Stripe dashboard, not in code. Net: build on Stripe + bank payouts; treat Venmo as a personal-banking step downstream, not a system component.

---

## 4. Database Schema (implemented in `payments/models.py`)

```
User (Django auth.User)                 # existing; buyer identity [ASSUMPTION: session auth added]
 └─1:1─ Customer
          id, user_id (OneToOne)
          stripe_customer_id (unique)
          livemode (bool)
          minecraft_username (char, blank)

Product
  id, slug (unique), name
  kind ∈ {subscription, one_time}
  stripe_product_id, download_key (blank), active

Price
  id, product_id (FK)
  stripe_price_id (unique)
  unit_amount (cents), currency, recurring_interval (blank|month|year), active

Subscription                            # mirror of a Stripe subscription
  id, customer_id (FK), product_id (FK)
  stripe_subscription_id (unique)
  status ∈ {trialing, active, past_due, canceled, unpaid, incomplete}
  current_period_end, cancel_at_period_end

Purchase                                # one completed one-time payment
  id, customer_id (FK), product_id (FK)
  stripe_checkout_session_id (unique)   # dedupe key
  stripe_payment_intent_id, amount_total, currency
  status ∈ {pending, paid, refunded, failed}

Entitlement                             # ← SINGLE SOURCE OF TRUTH for access
  id, customer_id (FK), product_id (FK)
  UNIQUE(customer, product)
  source ∈ {subscription, purchase}
  active (bool, indexed), expires_at (null=never), provisioned (bool)

WebhookEvent                            # idempotency + audit ledger
  id, stripe_event_id (unique), event_type, livemode
  processed_at, payload (JSON)
```

Key design points: **`Entitlement` is derived, never written by a request handler.** `expires_at` makes access **fail closed** if a revocation webhook is ever missed. `provisioned` tracks whether the external (Minecraft) side effect has actually been applied, so a failed RCON call can be retried without losing the verified payment record.

---

## 5. Access Control Logic

### Authentication flow [ASSUMPTION: new]

End users log in via Django session auth, exposed through Next.js same-origin route handlers (cookie-based). On first purchase, a `Customer` row is created and linked to a Stripe Customer. The browser never sees Stripe secrets; entitlement is never asserted client-side.

### Authorization — one function, fail-closed

All gating goes through `payments/access.py::has_access(user, product_slug)`. It returns `True` **only** when: the user is authenticated **and** has a `Customer` **and** holds an `Entitlement` for that product where `active=True` **and** (`expires_at` is null or in the future). Any uncertainty → `False`. It never consults the client, a cookie claim, or Stripe on the hot path.

### Verification method: **DB flag (the derived `Entitlement` row)**

Chosen over a JWT/role system because: it's revocable instantly (no waiting for a token to expire), it's auditable, and revocation is the whole point of a subscription product. Roles/claims would cache "paid" into a token that outlives a failed payment.

### How access is granted

- **Subscription:** `invoice.paid` / `customer.subscription.updated` with an entitling status → `Entitlement.active=True`, `expires_at=current_period_end`, RCON `whitelist add`.
- **One-time:** `checkout.session.completed` (paid) → permanent `Entitlement.active=True`, `expires_at=null`.

### How access is revoked

- **Automatic, no manual step:** `customer.subscription.deleted`, `unpaid`, or `past_due`-past-period → `Entitlement.active=False`, RCON `whitelist remove` + `kick`.
- **Failsafe:** even with a missed webhook, `is_valid()` returns `False` once `expires_at` passes. A nightly reconcile job (§8 Phase 3) re-syncs any drift and retries unprovisioned RCON changes.

### Minecraft server access control (RCON whitelist — chosen)

`payments/minecraft.py` opens a short-lived RCON connection and runs `whitelist add/remove <username>` (+ `kick` on revoke so a live session ends immediately). Properties: the backend is the single authority; the side effect is isolated and easy to stub in tests; RCON runs **private-network only**. Failures raise `RconError`; the caller leaves `provisioned=False` and the reconcile job retries — a game-server outage never discards a verified payment. (Alternative considered: a server plugin polling an entitlement API. Rejected for MVP — it needs a custom plugin and an exposed endpoint, more moving parts for the same result. Documented so it can be revisited if you want self-healing without a reconcile job.)

### File-download protection

Files are **never** at a public URL. Flow: user requests download → Django checks `has_access(user, slug)` → if true, mint a **short-lived signed URL** (or stream the file with an auth check); if false, `403` rendered by the frontend's branded error component. `Product.download_key` holds the private object key, never exposed to the browser.

---

## 6. Testing Strategy

### Stripe test mode setup

1. Stripe dashboard in **test mode** → create the Minecraft Product/Price ($2.99/mo) and a download Product/Price ($0.99); copy the price ids into the DB `Price` rows.
2. `.env`: `PAYMENTS_ENABLED=True` (locally only), `STRIPE_SECRET_KEY=sk_test_…`, `STRIPE_PUBLISHABLE_KEY=pk_test_…`.
3. Use Stripe **test cards**: `4242 4242 4242 4242` (success), `4000 0000 0000 0341` (attaches but fails on renewal), `4000 0000 0000 9995` (declined).

### Webhook testing approach

- Install the **Stripe CLI** and run:
  `stripe listen --forward-to localhost:8000/api/pay/webhook/stripe/`
  Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
- Drive real flows through hosted Checkout, **or** simulate single events:
  `stripe trigger checkout.session.completed`, `stripe trigger invoice.payment_failed`, `stripe trigger customer.subscription.deleted`.
- Verify idempotency by replaying the same event id twice (re-send from the CLI / dashboard) and asserting no duplicate `Entitlement`/`Purchase`.

### Automated tests (shipped — `payments/tests.py`)

The suite runs **without `stripe`/`mcrcon` installed** (lazy imports, mocked side effects), so it works in CI and the sandbox:

| Case | Test |
|---|---|
| Successful subscription | `test_active_subscription_grants_and_whitelists` — entitlement on + `grant_access` called once. |
| Failed / past-due payment | `test_past_due_does_not_entitle` — no access on `past_due`. |
| Cancelled subscription | `test_cancel_revokes_and_removes` — access off + `revoke_access` called. |
| One-time purchase verification | `test_grant_creates_purchase_and_entitlement` + `test_grant_is_idempotent`. |
| Access fail-closed | `AccessTests` — no/expired entitlement and anonymous user all denied. |
| Webhook idempotency | `test_duplicate_event_id_blocked_by_unique`. |

Run: `python manage.py test payments`. The app ships a hand-authored `migrations/0001_initial.py` that `makemigrations --check` confirms matches the models exactly, so `migrate` works out of the box (regenerate with `makemigrations` if you change the models).

**Verification status (this batch):** run against real Django 5.1.5 — `manage.py check` clean, `makemigrations --check` reports no drift, and **all 15 tests pass** with the migration applied. The endpoint-gating property was verified: with `PAYMENTS_ENABLED` unset, `/api/pay/*` falls through to the `api` JSON-404 catch-all; only with the flag on does it reach the payments views. `check --deploy` is clean aside from two project-wide warnings (set `SECURE_HSTS_SECONDS` and a strong `DJANGO_SECRET_KEY` in the Railway env before launch).

---

## 7. Risk & Failure Analysis

| Risk | Scenario | Mitigation (in design) |
|---|---|---|
| **Payment bypass** | Client tries to assert "I paid" to unlock content. | Entitlement written **only** from signature-verified webhooks; `has_access` never reads client input. |
| **Forged webhook** | Attacker POSTs a fake `checkout.session.completed`. | `construct_event` signature check with `STRIPE_WEBHOOK_SECRET`; bad sig → 400, zero DB writes. |
| **Duplicate delivery** | Stripe re-sends an event → double grant / double charge record. | `WebhookEvent.stripe_event_id` unique, insert-before-process; reconcilers use `get_or_create` on Stripe ids. |
| **Webhook missed / endpoint down** | Revocation event never arrives → access lingers. | `Entitlement.expires_at` fails closed at period end; nightly reconcile job re-syncs from Stripe (Phase 3). |
| **RCON outage** | Payment succeeds but `whitelist add` fails (or vice-versa). | Side effect isolated; `provisioned` flag + reconcile retry; payment state always recorded regardless. |
| **Data inconsistency** | DB and Stripe disagree on status. | Stripe = source of truth for payment; periodic reconcile pulls subscription status and rewrites entitlements. |
| **Fraud / chargebacks** | Stolen card buys a download then disputes. | Stripe Radar (test it in test mode); on `charge.dispute.created` (Phase 4) auto-revoke; low price limits exposure. |
| **Refund leaves access on** | Refunded purchase still entitles. | Handle `charge.refunded` → set `Purchase.refunded` + `Entitlement.active=False` (Phase 4 hook; noted, not yet wired). |
| **Secret leak** | Stripe/RCON creds committed. | All secrets via env; `.env` gitignored; `.env.example` valueless; never logged. |
| **Premature exposure** | Endpoints reachable before launch. | `PAYMENTS_ENABLED=False` default → URLs not mounted at all. |

---

## 8. Recommended MVP Build Plan

**Phase 1 — Minimal working backend (test mode).** ✅ *scaffolded in this batch.* `payments` app: models + migrations, admin, lazy Stripe/RCON imports, URLs gated behind `PAYMENTS_ENABLED`. Create test-mode Products/Prices and mirror into the DB. *Exit:* `manage.py test payments` green; `manage.py check` clean.

**Phase 2 — Secure payment validation.** Wire `create_checkout_session` to a Next.js route handler; run the webhook receiver under `stripe listen`; confirm signature verification + idempotency end-to-end with the CLI and test cards. *Exit:* a test subscription and a test download both produce correct `Entitlement` rows, and replays don't duplicate.

**Phase 3 — Access control integration.** Add buyer auth [ASSUMPTION], the signed-download endpoint, and the Minecraft RCON path against a **staging** MC server. Add the nightly reconcile job (pull Stripe status → rewrite entitlements → retry unprovisioned RCON). *Exit:* subscribe → auto-whitelist; cancel → auto-remove + kick; download gated by `has_access`.

**Phase 4 — Scale for multiple products + go-live.** CSV vocab lists and Anki decks are just new `Product(kind=one_time)` rows — no new code. Add `charge.refunded` / `charge.dispute.created` handlers, Stripe Tax if needed, dashboard webhook endpoint with live secret, then flip live keys + `PAYMENTS_ENABLED=True`. *Exit:* live SSL endpoint receiving real events, error rate < 1% on Railway metrics.

---

## File map (this batch)

```
backend/payments/
  models.py      Customer, Product, Price, Subscription, Purchase, Entitlement, WebhookEvent
  services.py    get_or_create_customer, create_checkout_session, grant_one_time,
                 sync_subscription, refund_purchase, entitlement reconcile
  views.py       stripe_webhook (verify→dedupe→dispatch), create_checkout,
                 access_check, download (entitlement-gated)
  access.py      has_access(user, slug)  ← the one gate function
  downloads.py   signed_download_url (object storage) / stream_private_file (traversal-safe)
  minecraft.py   grant_access / revoke_access via RCON (lazy mcrcon, fail-safe)
  admin.py       admin for all models
  urls.py        /webhook/stripe/, /checkout/, /access/check/, /download/<slug>/
                 (mounted only if PAYMENTS_ENABLED)
  tests.py       access, one-time, subscription, RCON, idempotency, refund,
                 customer bootstrap, checkout metadata, reconcile  (15 tests, all pass)
  migrations/0001_initial.py            schema (matches models; makemigrations-clean)
  management/commands/reconcile_entitlements.py   nightly failsafe job
backend/config/
  settings.py    + payments app, PAYMENTS_ENABLED flag, Stripe + RCON + download/redirect env keys
  urls.py        gated include of payments.urls (declared before /api/ catch-all)
backend/
  requirements.txt  + stripe==11.4.1, mcrcon==0.7.0 (pinned)
  .env.example      + payment/RCON/download keys (NO values)
```

**Schedule the reconcile job** (Railway cron or the project's scheduled-task runner):
`python manage.py reconcile_entitlements` nightly — it expires stale subscription
entitlements (covers a missed webhook) and retries any drifted Minecraft whitelist
state. Safe to run repeatedly; `--dry-run` reports without applying.

**Safety reminder:** `PAYMENTS_ENABLED` defaults to **False** — the webhook and access endpoints do not exist on the deployed app until you deliberately enable them after the test pass.
