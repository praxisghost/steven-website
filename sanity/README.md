# Sanity blog integration

The blog is now driven by **Sanity**. Write a post in the Studio, hit Publish, and
it appears on the site — no GitHub push, no redeploy.

- **Studio:** `studio/` in this repo — start it with `npm run write`. (The
  original standalone `../studio-steven-legg.com` project is no longer on disk;
  `studio/` was rebuilt from the live dataset's document shapes.)
- **Project:** `mo87nuz0` · **Dataset:** `production` (public — reads need no token)

## Files

| File | Does |
| --- | --- |
| `client.ts` | Sanity client + `imageUrl()` helper for `cdn.sanity.io` URLs |
| `queries.ts` | GROQ queries and their result types |
| `render.ts` | Portable Text → HTML, plus page templates matching `public/style.css` |
| `routes.ts` | The `/blog` routes, caching, and the revalidate webhook |

Mounted in `server.ts` with a single `app.use(blogRouter)`, placed **after**
`express.static` so files on disk always win.

## Routes

| Route | Behaviour |
| --- | --- |
| `GET /blog` | Sanity posts, newest first. Falls back to `public/blog.html` if Sanity has no posts or is unreachable. |
| `GET /blog/:slug` | Sanity post. Falls back to a legacy `public/blog/<slug>.html` if one exists. |
| `POST /api/blog/revalidate` | Clears the 60s cache so a new post shows immediately. |

Nothing that worked before stops working: the six hand-written posts under
`public/blog/` still resolve at both their `.html` URLs and their clean URLs.

## Local dev no longer needs Postgres

`initDB()` used to be fatal — one missing local database and the entire site
refused to boot, blog included. It now logs a warning and starts anyway:

```
[db] ⚠️  Postgres unavailable: connect ECONNREFUSED ...
[db] The site, the Sanity blog and all static pages will still serve.
```

Static pages and the blog work with no database at all. Only the endpoints that
genuinely persist something are affected:

| Endpoint | Without a database |
| --- | --- |
| `POST /api/contact` | 503 with a clear message |
| `POST /api/newsletter` | 503 with a clear message |
| `POST /api/minecraft-access` | 503 with a clear message |
| `POST /api/views` | `{"views": null}` — the counter just hides itself |
| `GET /api/minecraft-status` | `{"known": false}` |

Production is unchanged: Railway sets `DATABASE_URL`, so `dbReady` is true and
everything behaves exactly as before. To get the full set locally, either run
`createdb steven` or put a `DATABASE_URL` in `.env`.

## First-time setup

Run these **on your Mac** (the sandbox can't — it isn't logged in to Sanity, and
`node_modules` here is built for macOS):

```bash
# 1. Install the site's dependencies
cd ~/Dev4/steven-website
npm install

# 2. Start the Studio and write a post (installs studio/ deps on first run,
#    then opens http://localhost:3333 — log in with your Sanity account)
npm run write

# 3. Optional: preview the site in another terminal
npm run dev                    # http://localhost:3000
```

## Publishing instantly (optional but recommended)

Posts appear within 60 seconds by default. To make it instant:

1. Pick a long random string and set `SANITY_REVALIDATE_SECRET` to it in
   Railway's variables (and your local `.env`).
2. `npx sanity manage` → **API → Webhooks → Create webhook**
   - **URL:** `https://www.steven-legg.com/api/blog/revalidate` — the `www`
     host. The bare `steven-legg.com` is a redirect on another host and does
     not accept POSTs.
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type == "post"`
   - **HTTP method:** POST
   - **HTTP headers:** `x-revalidate-secret` = the same string

## Deploying the Studio

```bash
npm run studio:deploy  # hosts studio/ at <name>.sanity.studio
```

If a Studio was deployed before, `npx sanity manage` → your project → **Studios**
shows its hostname; reuse it to replace that deployment.

That gives you a URL you can open from any machine — including your phone — to
write posts without running anything locally.

## Migrating the old posts

The six posts in `public/blog/` are still static HTML. To move one into Sanity:
recreate it in the Studio using the **same slug**, publish, then delete the
`.html` file. The route already prefers Sanity over the static file, so the
switch happens the moment you publish.

## Gotcha: `@sanity/icons` v5

Icons were **removed from the package root** in v5. Import each from its own
subpath:

```ts
import {ImageIcon} from '@sanity/icons/Image'   // ✅
import {ImageIcon} from '@sanity/icons'         // ❌ crashes in the browser
```

The root entry still *declares* every icon (typed `never`, with a deprecation
note), so the wrong form passes `tsc` and only fails at runtime with
`Importing binding name 'ImageIcon' is not found`. Most tutorials and older docs
still show the root import.

## Content model

- **Post** — title, slug, publishedAt, excerpt, mainImage, body, author,
  categories, optional SEO overrides
- **Author** — name, slug, photo, bio
- **Category** — title, slug, description
- **blockContent** — the Portable Text type used by post bodies and author bios

Posts are hidden from the site until `publishedAt` has passed, so you can
schedule ahead. Slugs are validated as unique and lowercase-with-hyphens.
