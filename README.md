# steven-legg.com

A personal blog. Express + TypeScript serving static pages, with
[Sanity](https://www.sanity.io) as the CMS so posts can be written from a laptop
or a phone without touching Git.

```
this repo                 the site (Express + TypeScript)
studio/                   the Sanity Studio (own package.json; not part of the
                          site build and not required to run or deploy it)
```

The Studio is where posts are written: run it locally with `npm run write`, or
deploy it to Sanity's own hosting with `npm run studio:deploy`. See
[`sanity/README.md`](sanity/README.md) for where it lives and how to run it.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

Postgres is optional in development. Without it the site still serves — only the
contact form, newsletter, and view counter switch off. To enable them locally
run `createdb $USER`, or set `DATABASE_URL` in `.env`.

## Writing a post (quick start)

```bash
cd ~/Dev4/steven-website
npm run write        # opens the Studio at http://localhost:3333
```

1. Log in with your Sanity account (first time only).
2. **Post → +** (pencil icon). Fill in **Title**, click **Generate** next to
   **Slug**, write the **Body**, add an **Excerpt** and optional **Main image**
   (with alt text). Set **Categories** / **Tags** under **Details**.
3. **Published at** defaults to now; set a future time to schedule.
4. Click **Publish**. The post is live at `https://www.steven-legg.com/blog/<slug>`
   within 60 seconds (instantly if the revalidate webhook is set up).

No commit or deploy is needed to publish — posts live in Sanity, not Git. The
Studio source is in `studio/` (needs Node 22.12+; `npm run write` switches to
it via fnm automatically). `npm run studio:deploy` hosts it at
`<name>.sanity.studio` so you can post from any device.

The database schema is **not** created at boot. Create it once with:

```bash
npm run migrate
```

## Routes

| Route | Source |
| --- | --- |
| `/` and `/blog` | Sanity — featured post, list, sidebar |
| `/blog/:slug` | Sanity, falling back to `public/blog/*.html` for older posts |
| `/category/:slug` | Sanity |
| `/tag/:tag` | Sanity |
| `/about`, `/projects`, `/contact` | static files in `public/` |
| `/feed.xml`, `/sitemap.xml` | generated from Sanity |
| `/api/contact`, `/api/newsletter` | Postgres + Resend |
| `/api/blog/revalidate` | webhook — clears the cache on publish |
| `/healthz` | liveness probe — 200 whenever HTTP is serving; reports db state |

## Layout

```
server.ts          Express app: security headers, rate limiting, API endpoints
sanity/
  client.ts        Sanity client + image URL helper
  queries.ts       GROQ queries and their types
  render.ts        Portable Text → HTML, page templates, site chrome
  routes.ts        Blog routes, caching, RSS, sitemap, revalidate webhook
public/            Static pages, CSS, images, legacy posts
scripts/
  migrate.ts       Schema migration — the only DDL, run once per release
  import-legacy-posts.ts  One-off importer for the old static posts
send-newsletter.ts CLI for sending an issue to subscribers
_archive/          Content moved deliberately out of the served tree
_to_delete/        Staged for removal — nothing here is referenced
```

Full CMS notes — publishing workflow, webhook setup, deploying the Studio — are
in [`sanity/README.md`](sanity/README.md).

## Environment

See `.env.example`. Nothing is required to boot; each variable degrades cleanly
when absent.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres. Enables contact, newsletter, view counter |
| `RESEND_API_KEY` | Sends contact emails and newsletters |
| `SANITY_PROJECT_ID` / `SANITY_DATASET` | Defaults baked in; override to repoint |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the publish webhook |
| `SITE_URL` | Absolute origin for RSS, sitemap, canonicals |

## Deployment

Railway builds from `main`. `railway.toml` pins the sequence:

| Phase | Command | Runs |
| --- | --- | --- |
| Pre-deploy | `npm run migrate` | once per release — a non-zero exit fails the release and leaves the previous version serving |
| Start | `npm start` | once per instance |
| Health | `GET /healthz` | polled; 200 whenever HTTP is serving |

Set environment variables in Railway rather than committing them. `npm run
migrate` refuses to run without `DATABASE_URL` rather than starting against no
schema, and the server refuses to mark itself database-ready if any expected
table is missing.
