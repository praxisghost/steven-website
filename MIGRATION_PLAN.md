# steven-legg.com — Migration Plan

**Author:** drafted for Steven
**Date:** 2026-05-21
**Status:** Awaiting review — no code changes have been made.
**Scope:** Modernize the site to Next.js 15 + TypeScript + Tailwind + Framer Motion + Drizzle ORM + Postgres + Resend + Railway, on a new branch, with zero visible redesign.

---

## 1. Executive Summary

The existing site is in unusually good shape. It is already TypeScript on the server, already on Railway, already on Postgres, already using Resend, already production-hardened (custom CSP, HSTS, rate limiting, input sanitization, graceful shutdown), and has **zero npm audit vulnerabilities**. All 57 HTML pages declare `lang="en"`, set the viewport meta, give every `<img>` an `alt`, and apply `rel="noopener noreferrer"` to every external link. There are no inline event handlers, no inline scripts, and no third-party trackers.

Because the foundation is solid, this is genuinely a *modernization* — not a rescue. The win is structural: today, page-specific CSS is duplicated across eight HTML files (~1,375 lines of inline `<style>`), and four near-identical slideshow scripts live as four separate files, as do three near-identical SRS engines. The rebuild collapses that duplication into reusable React components without changing what users see.

The plan is to spin up a `next-rebuild` branch, drop a Next.js 15 app into a new `next/` subfolder alongside the untouched legacy code, point it at the same Railway Postgres and same Resend keys (no data migration), and migrate page-by-page with visual parity as the acceptance bar. Legacy stays live on `main` the entire time.

---

## 2. Audit Findings

### 2.1 Inventory

| Layer | Count | Notes |
|---|---:|---|
| HTML pages | 57 | 51 at root, 5 under `technology/`, 1 under `blog/` |
| Site-wide JS | 1 | `script.js` — loaded on every page (view counter, contact form, newsletter, back-link arrow wrap) |
| Feature JS modules | 8 | 4 slideshows + 3 SRS engines + 1 guitar player |
| Stylesheet | 1 | `style.css`, 940 lines |
| Page-scoped inline `<style>` | 8 files | ~1,375 lines total — primarily slideshow/SRS/guitar variants of the same patterns |
| Express server | 1 | `server.ts`, 335 lines |
| Newsletter CLI | 1 | `send-newsletter.ts`, 93 lines |
| Total static assets | 2.5 MB | Images already optimized; largest is 192 KB |
| Fonts | 1 | Self-hosted `NotoSansShavian-Regular.woff2` (only used on `shavian-english.html`) |

**Page → feature-script mapping:**

| Page | Extra script |
|---|---|
| `about.html` | `about.js` (salamander slideshow — currently placeholder, no active photos) |
| `animals.html` | `animals.js` (polliwog slideshow — 3 photos) |
| `misc.html` | `misc.js` (frog slideshow — 10 photos) |
| `photos.html` | `photos.js` (dog-breed slideshow — placeholder, no active photos) |
| `guitar.html` | `guitar-scale.js` (E Major Pentatonic player + 3-variation melody engine) |
| `turkish-learning.html` | `turkish-srs.js` (100-card Turkish→English SRS) |
| `turkish-learning-de.html` | `turkish-srs-de.js` (100-card Turkish→German SRS) |
| `german-learning-tr.html` | `german-srs-tr.js` (100-card German→Turkish SRS) |

All other pages are pure content (HTML + the site-wide `script.js`).

**Hub / sub-nav pages** (parents in the navigation tree):
`career.html`, `con-lang.html`, `language-guides.html`, `language-learning.html`, `language-methods.html`, `music.html`, `writing.html`.

### 2.2 Backend (`server.ts`)

Three POST endpoints, all rate-limited, all server-validated:

| Route | Behavior | Rate limit |
|---|---|---|
| `POST /api/views` | Inserts a row into `page_views`, returns total count. | 60/min/IP |
| `POST /api/contact` | Validates name/email/message, writes to `contact_messages`, sends email via Resend (best-effort — DB write happens first so a Resend outage never loses a real message). | 10/hour/IP |
| `POST /api/newsletter` | Validates email, upserts into `newsletter_subscribers` with `ON CONFLICT DO NOTHING`. | 10/hour/IP |

**Schema** (auto-created on boot in `initDB()`):

```sql
CREATE TABLE page_views (
  id         SERIAL PRIMARY KEY,
  visited_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE contact_messages (
  id      SERIAL PRIMARY KEY,
  name    TEXT NOT NULL,
  email   TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE newsletter_subscribers (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT NOW()
);
```

**Hardening already in place** (must be preserved 1:1 in the rebuild):

- Custom CSP: `default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data:`, `font-src 'self' data:`, `connect-src 'self'`, `frame-src https://www.youtube-nocookie.com`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'`.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-XSS-Protection: 0`, `Strict-Transport-Security: max-age=31536000; includeSubDomains` (prod only).
- `app.set('trust proxy', 1)` for Railway.
- JSON body cap at 32 KB.
- In-memory token-bucket rate limiter with periodic pruning.
- Email regex + control-character stripping in `sanitize()`.
- Graceful shutdown on SIGINT/SIGTERM with 10 s force-exit fallback.

**Env vars** (from `.env.example`):
`DATABASE_URL`, `NODE_ENV`, `PORT`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.

**External outbound contacts:** YouTube nocookie embed (guitar page only) and Resend API. No analytics, no fonts CDN, no tag managers.

### 2.3 Interactive systems

#### 2.3.1 Slideshows (`about.js`, `animals.js`, `misc.js`, `photos.js`)

All four are minor variants of one pattern:

- Read an array of `{slug, name, latin?}` entries; build deck of items with an active image.
- Fisher–Yates shuffle on load → randomized first order.
- Auto-advance every 8,000 ms; pause when `document.hidden`.
- Prev / Next buttons reset the interval.
- Image preload via a temporary `Image()` object, with a generational `inflight` guard so a late-arriving load can never overwrite a newer selection.
- CSS class transitions: `*-loading` (opacity 0) → `*-loaded` (opacity 1), 0.5 s ease.
- Each variant uses a unique DOM-element prefix (`frog-img`, `polliwog-img`, `sal-img`, `dog-img`) and a unique placeholder class (`.frog-placeholder`, etc.).
- about.js / photos.js have an `active: false/true` flag per entry so the deck only includes items with real photos; if nothing is active, controls disable and the caption shows "Photos coming soon".

→ **Refactor opportunity:** one `<Slideshow>` React component, parameterized by `items`, `autoMs`, prefix-free DOM, and an optional caption renderer. Behavior preserved exactly; ~430 lines of JS collapse to ~80.

#### 2.3.2 SRS engines (`turkish-srs.js`, `turkish-srs-de.js`, `german-srs-tr.js`)

All three are identical engines pointed at different 100-card decks:

- SM-2-lite scheduler: `interval`, `ef` (1.3–2.5), `reps`, `due` (days since epoch).
- Two-grade UI: **1 = Again** (resets reps, ef -= 0.2, due tomorrow), **3 = Good** (interval grows by ef; ef += 0.1 capped at 2.5).
- Daily session: due cards first, then up to 20 new; "Again" cards re-queue at the end of the session.
- LocalStorage persistence per deck — keys are `srs-turkish-v1`, `srs-turkish-de-v1`, `srs-german-tr-v1` (these keys must not change, or returning users will lose progress).
- Keyboard: Space/Enter to reveal, `1` for Again, `3` for Good.
- Renders into a single `#srs-root` element; uses `innerHTML` but escapes user-visible text via an `esc()` helper that maps `& < > "`.

→ **Refactor opportunity:** one `<SRSDeck>` React component + one `useSRS` hook + three deck data files. Behavior, storage keys, and keyboard shortcuts preserved 1:1.

#### 2.3.3 Guitar scale + melody player (`guitar-scale.js`)

The most intricate piece on the site. 731 lines.

- **Audio:** Web Audio API — `AudioContext` (lazy, with `webkitAudioContext` fallback), one master `GainNode`, triangle oscillator → biquad lowpass → envelope gain → master. Click sound (sine) for the 4-beat count-in.
- **Scheduling:** lookahead scheduler running on `setInterval(80ms)` with a 400 ms look-ahead window; visual updates fire via `setTimeout` aligned to `AudioContext.currentTime`. A monotonic `gen` counter invalidates stale callbacks on stop/switch.
- **Three modes:** `stopped`, `scale` (ascending → descending E Major Pentatonic loop), `melody` (one of three predefined melodies, advanced by pressing the Melody button again).
- **SVG notation:** static `<g id="sn-scale-group">` with eight pre-placed note slots (`sn-head-0..7`, `sn-stem-0..7`, `sn-acc-0..7`) for the scale view; dynamic `<g id="sn-melody-group">` rebuilt per melody using `document.createElementNS`. Highlights are CSS-class swaps only — notes never reposition during playback.
- **Tempo:** BPM = 96; beat = 0.625 s; count-in is 4 clicks before the first melody note.
- **Stop:** linear-ramps master gain to 0 over 25 ms, disconnects, resets state.

→ **Porting strategy:** keep the audio engine and scheduler as a plain TS module (no React state in the audio hot path — `setTimeout`-driven visual updates only). Render the SVG declaratively in React using `refs` for the elements the scheduler needs to toggle classes on. Generational invalidation pattern carries over unchanged.

#### 2.3.4 Site-wide script (`script.js`)

- View counter: POSTs `/api/views`, paints "Total site views: N" into `#view-count` (About page footer only).
- Contact form: serializes `#contact-form` to JSON, posts to `/api/contact`, shows status into `#form-status`.
- Newsletter form: same pattern with `#newsletter-form` → `/api/newsletter`.
- Back-link arrow wrap: scans for `a.back-link`, peels off the leading `←`/`↑`/`→`/`↓` and wraps it in a `<span class="arrow">` so CSS can give it extra weight.

→ Each piece becomes its own small React component / server action.

### 2.4 Design system / CSS

`style.css` (940 lines) is well-structured and already uses CSS variables:

```css
:root {
  --font-body:    'Times New Roman', Times, 'Liberation Serif', serif;
  --font-display: 'Times New Roman', Times, 'Liberation Serif', serif;
}
```

**Color palette (extracted, to become Tailwind theme tokens):**

| Role | Hex | Used for |
|---|---|---|
| Background | `#000` | Body |
| Foreground | `#fff` | Body text, h1, h2 |
| Text-muted | `#ccc` | Article paragraphs |
| Text-dimmer | `#999`, `#888`, `#777`, `#666`, `#555` | Captions, hint text, footer links |
| Hairline | `#1a1a1a`, `#1e1e1e`, `#222` | Borders, dividers |
| Card surface | `#0a0a0a`, `#0c0c0c`, `#0d0d0d`, `#111` | Cards, inputs |
| Accent blue | `#7eb8f7` | Language-page links, "em" highlights |
| Accent green | `#7ed895`, `#6ecf8c`, `#5aaa6e` | Beginner badges, "current" markers, download icons |
| Accent red | `#f07878` | Advanced badges, stop button |
| Accent indigo | `#9b8df0` | Rainbow hover step 6 |
| Accent violet | `#c888f0` | Rainbow hover step 7 |
| Accent orange | `#f0a878` | Rainbow hover step 2 |
| Accent yellow | `#e8d878` | Rainbow hover step 3 |

**The "rainbow hover" cycle** (7-color sequence on every navigational list — main nav, sub-nav, blog list, playlists list, cycling with `:nth-child(7n+k)`) is a *signature visual identity element*. It must be reproduced exactly. In Tailwind it becomes a small helper in the component layer or a custom plugin that emits the same `:nth-child` rules.

**Breakpoints:** single mobile breakpoint at `max-width: 480px`. Tailwind's `sm:` (640px) is wider, so the rebuild keeps a custom breakpoint `xs: 480px` for parity.

**Typography:** entire site is Times New Roman — no web fonts at all (except Noto Sans Shavian, narrowly scoped to U+10450–U+1047F via `unicode-range`). This is intentional and should not change.

**The 1,375 lines of page-scoped inline `<style>`** divide into three families:

1. **Slideshow chrome** (about, animals, misc, photos): frame, image fade, caption, prev/next buttons, placeholder emoji. → Single `<Slideshow>` styling.
2. **SRS chrome** (turkish, turkish-de, german-tr): meta bar, progress bar, card front/back, action buttons, keyboard hint. → Single `<SRSDeck>` styling.
3. **Guitar player** (guitar): scale pills, control buttons, notation panel, SVG note styles, melody-mode wrappers. → `<GuitarPlayer>` styling, kept on the guitar route.

### 2.5 Security, performance, accessibility, SEO

| Category | Status | Action |
|---|---|---|
| `npm audit` | 0 vulnerabilities | Maintain — re-audit after `next` install. |
| CSP / security headers | Production-grade | Reproduce identically in Next.js `headers()` config. |
| Body-size limit (32 KB) | Present | Reproduce in route handlers. |
| Rate limiting | In-memory token bucket | Keep semantics; in the rebuild use the same approach (or upgrade to a Postgres-backed limiter if multi-instance later — out of scope for v1). |
| Input sanitization + email regex | Present | Reproduce in route handlers; consider Zod for richer typed validation. |
| `lang="en"` on `<html>` | All 57 pages | Inherit from root layout. |
| Viewport meta | All 57 pages | Default in Next.js. |
| `<img alt>` coverage | 100% | Preserve — convert to `next/image` where it doesn't change layout. |
| `rel="noopener noreferrer"` on `target="_blank"` | All external links | Preserve. |
| Heading hierarchy | Clean on spot checks | Preserve. |
| ARIA usage | Present where it matters (forms, slideshow controls, scale-player region) | Preserve. |
| **Meta descriptions** | 36/57 pages have one | **Improvement:** add for the remaining 21 in the rebuild. |
| **Open Graph / Twitter Cards** | Absent | **Improvement:** add a per-page OG image + tags helper. |
| **`rel="canonical"`** | Absent | **Improvement:** Next.js metadata API handles this automatically. |
| **sitemap.xml** | Absent | **Improvement:** generate at build time via Next.js `app/sitemap.ts`. |
| **robots.txt** | Absent | **Improvement:** `app/robots.ts`. |
| **favicon** | Absent | **Improvement:** add `app/icon.png` + `app/apple-icon.png`. |
| Static asset cache headers | `Cache-Control: public, max-age=300, must-revalidate` for HTML; 1 h for others | Next.js does immutable hashed assets by default — strictly an improvement; HTML page revalidation policy carries over. |

None of the SEO additions change what users see — they only change what Googlebot, Slack unfurls, and Twitter previews see.

---

## 3. Target Architecture

### 3.1 Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router, React 19) | Server components for the static content (no JS shipped), client components only where interactivity is needed (slideshows, SRS, guitar player, forms). |
| Language | **TypeScript** (strict) | Already TS on the server; carry through. |
| Styling | **Tailwind CSS v4** + a thin custom layer | Reproduces the design tokens; `@layer components` for the rainbow nav and SRS/guitar/slideshow chrome. |
| Components | **shadcn/ui primitives** (Button, Input, Textarea, Form, Toast/Sonner) | Unstyled, themable, type-safe; we restyle to match the existing dark serif aesthetic exactly. |
| Animation | **Framer Motion** | Used sparingly — for the existing 0.18 s card hover-lift, the 0.5 s slideshow fade, the back-link transitions. Replicates the current transitions without changing them. |
| ORM | **Drizzle ORM** | Lightweight, type-safe; schema lives in code; reuses the existing tables verbatim. |
| Database | **Postgres on Railway** (same instance) | No data migration. |
| Email | **Resend** (same account / API key) | Same `react-email` templates can be added later for richer emails; v1 stays plain-text. |
| Deployment | **Railway** | Same project, new service for the rebuild; once parity is signed off, traffic cuts over by swapping the custom domain. |
| Forms | **React Hook Form + Zod** | Type-safe, accessible, mirrors the existing client-side validation. |
| Linting / formatting | ESLint (Next defaults) + Prettier | New. |
| Tests | Vitest + Playwright | Vitest for SRS engine + audio-scheduler unit tests; Playwright for visual-regression / parity checks against legacy. |

### 3.2 Folder structure

```
website/                                    ← repo root (existing)
├── public/                                 ← legacy static site (UNTOUCHED on next-rebuild branch)
├── server.ts                               ← legacy Express server (UNTOUCHED)
├── send-newsletter.ts                      ← legacy newsletter CLI (UNTOUCHED)
├── MIGRATION_PLAN.md                       ← this file
└── next/                                   ← NEW — Next.js app lives here
    ├── app/
    │   ├── layout.tsx                      ← root layout: <html lang="en">, header, footer, nav
    │   ├── page.tsx                        ← index ( = current index.html)
    │   ├── about/page.tsx
    │   ├── contact/page.tsx
    │   ├── art/page.tsx
    │   ├── music/page.tsx                  ← hub
    │   ├── music/guitar/page.tsx           ← embeds <GuitarPlayer/>
    │   ├── music/mandolin/page.tsx
    │   ├── music/ocarina/page.tsx
    │   ├── music/playlists/page.tsx
    │   ├── music/rhythm-and-meter/page.tsx
    │   ├── writing/page.tsx                ← hub
    │   ├── writing/political-opinion/page.tsx
    │   ├── writing/criticisms/page.tsx
    │   ├── writing/self-improvement/page.tsx
    │   ├── writing/questions/page.tsx
    │   ├── writing/retro-gaming/page.tsx
    │   ├── writing/shavian-english/page.tsx
    │   ├── language-learning/page.tsx      ← hub
    │   ├── language-learning/[lang]/page.tsx   ← turkish, german, mandarin, cantonese, spanish
    │   ├── language-learning/[lang]-de/page.tsx
    │   ├── language-learning/methods/page.tsx  ← hub
    │   ├── language-learning/methods/*/page.tsx (shadowing, tprs, comprehensible-input, …)
    │   ├── language-learning/guides/*/page.tsx (anki, hypertts, gold-list, …)
    │   ├── language-learning/con-lang/*/page.tsx (esperanto, interlingua, intergermanic, kesin)
    │   ├── career/page.tsx                 ← hub
    │   ├── career/interests/page.tsx
    │   ├── career/learn/page.tsx
    │   ├── photos/page.tsx                 ← embeds <Slideshow deck={DOGS}/>
    │   ├── animals/page.tsx                ← embeds <Slideshow deck={POLLIWOGS}/>
    │   ├── misc/page.tsx                   ← embeds <Slideshow deck={FROGS}/>
    │   ├── sports/page.tsx
    │   ├── blog/page.tsx
    │   ├── blog/[slug]/page.tsx
    │   ├── technology/page.tsx
    │   ├── technology/[slug]/page.tsx
    │   ├── api/views/route.ts              ← POST → INSERT page_views, return count
    │   ├── api/contact/route.ts            ← POST → contact_messages + Resend
    │   ├── api/newsletter/route.ts         ← POST → newsletter_subscribers
    │   ├── sitemap.ts                      ← NEW
    │   ├── robots.ts                       ← NEW
    │   └── icon.png / apple-icon.png       ← NEW
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── BackLink.tsx                ← bakes the arrow-weight bump in; no DOM-rewrite hack
    │   │   ├── Nav.tsx                     ← rainbow hover via :nth-child
    │   │   └── SubNav.tsx
    │   ├── slideshow/
    │   │   ├── Slideshow.tsx               ← one component replaces about/animals/misc/photos JS
    │   │   └── decks.ts                    ← FROGS, POLLIWOGS, DOGS, SALAMANDERS data
    │   ├── srs/
    │   │   ├── SRSDeck.tsx                 ← UI
    │   │   ├── useSRS.ts                   ← state hook (SM-2 lite, localStorage)
    │   │   ├── algorithm.ts                ← pure schedule() — unit-testable
    │   │   └── decks/
    │   │       ├── turkish-en.ts           ← 100 cards
    │   │       ├── turkish-de.ts
    │   │       └── german-tr.ts
    │   ├── guitar/
    │   │   ├── GuitarPlayer.tsx            ← React shell
    │   │   ├── audio-engine.ts             ← AudioContext, oscillator, scheduler
    │   │   ├── notation.tsx                ← declarative SVG
    │   │   └── melodies.ts                 ← 3 melody definitions
    │   ├── forms/
    │   │   ├── ContactForm.tsx
    │   │   └── NewsletterForm.tsx
    │   └── ui/                             ← shadcn primitives (Button, Input, …)
    │
    ├── lib/
    │   ├── db/
    │   │   ├── schema.ts                   ← Drizzle table definitions matching legacy DDL
    │   │   ├── client.ts                   ← node-postgres pool + drizzle instance
    │   │   └── migrations/                 ← drizzle-kit migration files
    │   ├── email/
    │   │   └── resend.ts                   ← Resend client + sendContactNotification()
    │   ├── rate-limit.ts                   ← same in-memory token bucket
    │   ├── security/
    │   │   ├── headers.ts                  ← CSP + all other headers (used by middleware)
    │   │   └── sanitize.ts                 ← email regex + control-char strip
    │   └── seo/
    │       └── metadata.ts                 ← per-page metadata helpers
    │
    ├── content/                            ← MDX for blog + technology articles
    │   ├── blog/
    │   │   └── may-2026-update.mdx
    │   └── technology/
    │       ├── ai-prompts.mdx
    │       ├── artificial-intelligence.mdx
    │       ├── foldable-phones.mdx
    │       ├── return-to-linux.mdx
    │       └── smartphone-design.mdx
    │
    ├── public/
    │   ├── img/                            ← copied 1:1 from legacy /public/img
    │   ├── fonts/                          ← copied 1:1 (Noto Sans Shavian + LICENSE)
    │   └── downloads/                      ← monthly-budget-template.xlsx, spending-log-template.xlsx
    │
    ├── middleware.ts                       ← attaches CSP + security headers
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── drizzle.config.ts
    ├── next.config.ts
    ├── tsconfig.json
    ├── eslint.config.mjs
    ├── package.json
    └── .env.example                        ← same vars as legacy
```

The legacy `/public`, `server.ts`, `send-newsletter.ts`, and `package.json` are not touched on the `next-rebuild` branch. The new app is fully isolated under `next/`. The branch's root `package.json` gets `"workspaces": ["next"]` (or we leave it alone and use the inner `next/package.json` directly — either is fine; I'd default to keeping them separate, no workspace).

### 3.3 Data layer (Drizzle)

`lib/db/schema.ts` mirrors the legacy DDL exactly:

```ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const pageViews = pgTable('page_views', {
  id:        serial('id').primaryKey(),
  visitedAt: timestamp('visited_at').defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
  id:      serial('id').primaryKey(),
  name:    text('name').notNull(),
  email:   text('email').notNull(),
  message: text('message').notNull(),
  sentAt:  timestamp('sent_at').defaultNow(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id:           serial('id').primaryKey(),
  email:        text('email').notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
});
```

The first migration is a no-op (`CREATE TABLE IF NOT EXISTS` matches existing tables). `drizzle-kit introspect` confirms the schema matches the live DB before we run anything destructive.

### 3.4 Routes (Next.js App Router)

`app/api/views/route.ts`, `app/api/contact/route.ts`, `app/api/newsletter/route.ts` — each a thin POST handler that:

1. Runs the in-memory rate limiter (`lib/rate-limit.ts`) keyed by `request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'`.
2. Parses + validates the body with Zod (`{ name: z.string().min(1).max(100), email: z.string().email().max(254), message: z.string().min(1).max(5000) }`).
3. Hits Drizzle.
4. Returns the same JSON shapes the existing clients already expect — `{ views: number }`, `{ ok: true }`, `{ error: string }` — so even if a stray legacy tab is open mid-rollout, nothing breaks.

### 3.5 Security parity (Next.js middleware)

`middleware.ts` attaches every header the legacy server sets — exact same CSP string, exact same HSTS, etc. CSP gets one update: `frame-src https://www.youtube-nocookie.com` is preserved, and we keep `style-src 'self' 'unsafe-inline'` because Next.js streams critical CSS inline. (We could move to a nonce-based CSP later, but that's a v2 nicety — out of scope for parity.)

### 3.6 Component strategy

- **Server components by default.** All static content pages are server components with zero JS shipped to the browser.
- **Client components only at the islands of interactivity:** `Slideshow`, `SRSDeck`, `GuitarPlayer`, `ContactForm`, `NewsletterForm`, `ViewCounter`.
- **Framer Motion** wraps the existing transitions: blog/playlist card hover-lift (`transform: translateY(-3px)` + box-shadow), slideshow image cross-fade (0.5 s), back-link color transitions. No new motion is introduced.

### 3.7 Deployment

- Add a second Railway service called `steven-website-next` against the `next-rebuild` branch.
- Wire it to the same Postgres add-on (same `DATABASE_URL`) and copy `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` into its env.
- Give it a preview hostname (e.g. `next.steven-legg.com` via a CNAME) for parity testing.
- Cut over by swapping the apex DNS once the parity checklist is fully signed off; the legacy service stays running for 7 days as a rollback hedge, then is decommissioned.

---

## 4. Migration phases

Each phase ends with a checkpoint where the new site is compared side-by-side with `steven-legg.com` and signed off before proceeding.

### Phase 0 — Branch + scaffold (½ day)

- `git checkout -b next-rebuild`
- `npx create-next-app@latest next --typescript --tailwind --app --eslint --src-dir false --import-alias "@/*"`
- Install Drizzle (`drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg`), Resend, Framer Motion, React Hook Form, Zod, shadcn-ui CLI.
- Initialize Tailwind config with the design tokens from §2.4.
- Drop a `middleware.ts` with the legacy CSP / security headers.
- Add `.env.example` matching legacy.
- Boot `next dev` — confirm it serves the default page on `:3000`.

**Checkpoint:** empty scaffold runs locally, lint passes, `drizzle-kit introspect` reproduces the legacy schema.

### Phase 1 — Design system + chrome (1 day)

- Author `tailwind.config.ts` color tokens, `xs: 480px` breakpoint, `font-display` family token.
- Implement `Header`, `Footer`, `Nav` (with the 7-color rainbow hover), `SubNav`, `BackLink` as React components.
- Implement the global `RootLayout` with `<html lang="en">` and the body padding/max-width from legacy.
- Side-by-side compare with `index.html` (the simplest page) — pixel-level diff.

**Checkpoint:** the home page in Next renders pixel-equivalent to legacy on desktop and at 480 px.

### Phase 2 — Content pages, no interactivity (2–3 days)

- Migrate the 49 static pages (everything except the 8 interactive ones) to server components.
- Convert any HTML content that already uses `<style>` blocks but is purely cosmetic into Tailwind classes; preserve all wording and structure exactly.
- For blog + technology articles: move the body content into MDX files under `content/` and render them through a thin MDX route.
- Add the missing 21 meta descriptions; add OG tags and `rel="canonical"` automatically via Next.js metadata API.
- Generate `app/sitemap.ts` and `app/robots.ts`.

**Checkpoint:** all 49 content pages render identically to legacy in side-by-side Playwright screenshots.

### Phase 3 — Forms + view counter (½ day)

- Implement `ContactForm` + `NewsletterForm` as client components using React Hook Form + Zod.
- Implement `ViewCounter` as a client component that POSTs to `/api/views` on mount.
- Wire up `app/api/views/route.ts`, `app/api/contact/route.ts`, `app/api/newsletter/route.ts` with the rate limiter, Drizzle inserts, and Resend send.
- Run the existing `send-newsletter.ts` against the new schema unchanged (it already only reads `email`).

**Checkpoint:** submit a test message and a test newsletter signup against a non-prod Postgres instance; confirm both row insertion and Resend delivery.

### Phase 4 — Slideshow component (½ day)

- Build `<Slideshow>` from the four legacy variants. Identical visual behavior: 8 s auto-advance, shuffle on mount, prev/next reset interval, pause on `visibilitychange`, image preload with inflight guard.
- Wire it into `/misc` (frogs), `/animals` (polliwogs), `/photos` (dogs, placeholder until activated), `/about` (salamanders, placeholder).
- Wrap fades with Framer Motion's `<AnimatePresence>` (functionally equivalent to the legacy CSS opacity transition).

**Checkpoint:** click through all four pages; confirm auto-advance cadence, prev/next behavior, and tab-hidden pause all match legacy.

### Phase 5 — SRS engine (1 day)

- Extract the SM-2 lite scheduler into `lib/srs/algorithm.ts` (pure, unit-tested with Vitest — same inputs produce same outputs as legacy).
- Build `<SRSDeck>` using the existing storage keys (`srs-turkish-v1`, `srs-turkish-de-v1`, `srs-german-tr-v1`) so returning users keep their progress.
- Wire keyboard shortcuts (Space/Enter to reveal, `1`=Again, `3`=Good) at the document level with a ref-based listener.
- Mount into the three deck pages.

**Checkpoint:** load a deck, grade a few cards, refresh the page, confirm state persists. Open the legacy site in one tab and the new site in another with the same localStorage keys — progress must be interchangeable.

### Phase 6 — Guitar scale + melody player (1–2 days)

- Port `guitar-scale.js` into `components/guitar/audio-engine.ts` (TS, no React) — preserves the generational `gen` invalidation pattern, scheduler look-ahead, count-in.
- Build `<GuitarPlayer>` shell with declarative SVG (no `document.createElementNS`); pass `refs` to the audio engine for class toggles.
- Verify melody-mode SVG viewBox / barlines / accidentals render identically by overlaying with the legacy SVG.
- Verify audio: count-in clicks, scale ascending/descending loop, three melody variations, stop fades.

**Checkpoint:** record a 30 s clip of legacy and a 30 s clip of new in identical browser conditions; spectrum-analyze to confirm equivalent frequencies and timing.

### Phase 7 — SEO, accessibility, perf polish (½ day)

- Per-page `Metadata` for all 57 pages: title, description, OG title/description/image, canonical.
- Default OG image (1200×630) — a black background with "Steven Legg" in serif white.
- Run Lighthouse / axe — fix any net-new regressions (target: ≥ legacy on every category).
- Run `next build` and inspect bundle sizes; budget the per-route client JS at ≤ 30 KB for content pages and ≤ 80 KB for interactive pages.

**Checkpoint:** Lighthouse mobile + desktop scores ≥ legacy on Performance, Accessibility, Best Practices, SEO.

### Phase 8 — Staging deploy + parity sign-off (½ day)

- Push branch to GitHub; Railway auto-deploys the new service to `next.steven-legg.com`.
- Steven walks every page, every interactive feature.
- Run a Playwright visual-regression suite (one screenshot per page at desktop + mobile) against the legacy domain and the new domain; diff each pair.

**Checkpoint:** no visual diffs > 0.5%; every interactive system behaves identically.

### Phase 9 — Cutover + monitor (¼ day + 7-day watch)

- Update apex DNS to point to the new service. Legacy service stays running on a `legacy.steven-legg.com` subdomain.
- Watch error logs and Postgres for 7 days. If anything breaks, flip DNS back in < 5 minutes.
- After 7 clean days, decommission legacy and merge `next-rebuild` → `main`.

**Total effort:** ~7–9 working days end-to-end.

---

## 5. Parity checklist (acceptance criteria)

A page is "done" only when *all* of the following are true:

- [ ] DOM contains the same headings (text + level + order) as legacy.
- [ ] Same body copy, including line breaks and punctuation.
- [ ] Same external links with same `target` + `rel`.
- [ ] Pixel diff under 0.5% at 1280×800 and 380×800.
- [ ] Same `<title>`. Description either matches legacy or — for the 21 pages currently missing one — uses the new description, reviewed by Steven.
- [ ] Page weight (HTML + JS + CSS) ≤ legacy.
- [ ] Lighthouse a11y score ≥ legacy.
- [ ] Keyboard navigation reaches every interactive control.

An interactive system is "done" when:

- [ ] All buttons present, in the same order, with the same labels.
- [ ] All keyboard shortcuts intact.
- [ ] All visible animations / fades / cross-fades match legacy timing (8 s slideshow, 0.5 s fade, 25 ms guitar stop ramp, etc.).
- [ ] localStorage keys unchanged (`srs-turkish-v1`, `srs-turkish-de-v1`, `srs-german-tr-v1`).
- [ ] Same network behavior (same endpoints, same JSON shapes, same rate-limit thresholds).

---

## 6. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Guitar audio scheduler drifts under React strict-mode double-effects | Medium | Audible glitch on initial play | Keep audio engine outside React; only refs + class toggles cross the boundary. Validate in dev + prod builds. |
| SRS users lose progress | Low | High (user trust) | Preserve exact storage keys. Add a one-shot migration that no-ops if data already exists in the new key. Document rollback path. |
| Rainbow nth-child hover misses an item when Next reorders nav links | Low | Visual regression | Snapshot test against the legacy color sequence. |
| CSP breaks on first deploy because Next.js inlines styles differently | Medium | Whitescreen | Keep `style-src 'self' 'unsafe-inline'` for parity; tighten later. |
| Rate limiter scoped per process — Railway may run multiple instances | Low | Limits ineffective at scale | Document; only migrate to a shared store if observed traffic warrants. |
| Drizzle migrations clash with the legacy `CREATE TABLE IF NOT EXISTS` autorun | Medium | Migration error on first prod run | First migration is a no-op generated via `drizzle-kit introspect` against the live DB. Disable the legacy `initDB()` once the legacy service is decommissioned. |
| Resend "from" address verification differs for the new service | Low | Email delivery fails silently | Reuse the existing verified domain + same `CONTACT_FROM_EMAIL`. Manual delivery test in phase 3. |
| MDX rendering changes whitespace in blog/technology articles | Medium | Subtle copy drift | Snapshot-compare rendered HTML against legacy before sign-off; tweak MDX components to preserve `<p>` boundaries. |

---

## 7. Open questions for Steven

1. **Branch name** — `next-rebuild`, `v2`, `rebuild/next-15`? Default if you don't specify: `next-rebuild`.
2. **OG image** — happy with a generated dark-serif "Steven Legg" 1200×630, or do you want to design one?
3. **Pages currently hidden in legacy nav** — the changelog mentions "hide incomplete pages." Are there any pages in `/public` that should *not* be migrated (i.e. fully deleted from the rebuild)? *(Verification pass already found one orphan: `steven.html` is a "More about Steven coming soon" placeholder linked from nowhere. Default unless you say otherwise: drop it from the rebuild.)*
4. **The 21 pages missing meta descriptions** — happy for me to draft them, or do you want a list to write yourself?
5. **Newsletter sending** — `send-newsletter.ts` is currently a manual CLI. Keep as a script in the new repo, or graduate to an admin UI later? (Out of scope for parity.)
6. **Analytics** — none today. Add anything (Plausible, Vercel analytics, server-side counters) in v1, or stay analytics-free?
7. **`monthly-budget.xlsx` and `spending-log.xlsx`** at repo root — these are personal files, not website content. Leave them where they are, or move under a `_local/` (gitignored) folder?

---

## 8. What this plan deliberately does *not* change

- Typography (Times New Roman everywhere).
- Color palette.
- Page hierarchy / URL structure (`/about`, `/contact`, `/language-learning/turkish` etc. — same paths).
- Wording or content of any educational material.
- Rainbow hover sequence.
- The behavior of any interactive feature (slideshow cadence, SRS algorithm, guitar timing).
- DB schema or table names.
- Resend "from" address or email format.
- CSP allowlist (still only YouTube nocookie + self).

The user-visible end state is "this is the same site, but loads slightly faster and has proper social-media link previews."

---

## 9. Acceptance criteria for THIS DOCUMENT

This plan is signed off when Steven confirms:

- [ ] Stack choices in §3.1 are acceptable.
- [ ] Folder structure in §3.2 is acceptable (especially the `next/` subfolder vs. monorepo decision).
- [ ] Phase sequencing in §4 fits Steven's review cadence.
- [ ] Open questions in §7 have been answered (or deferred explicitly).

Once signed off, I'll proceed to Phase 0 (branch + scaffold) and pause again for review before Phase 1.
