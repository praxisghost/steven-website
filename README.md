# steven-legg.com

A personal blog. Express + TypeScript serving static pages, with
[Sanity](https://www.sanity.io) as the CMS so posts can be written from a laptop
or a phone without touching Git.

```
this repo                 the site (Express + TypeScript)
studio-steven-legg.com    the Sanity Studio — a SEPARATE project, not in this
                          repo and not required to run or deploy the site
```

The Studio is where posts are written. It is deployed to Sanity's own hosting,
so publishing needs nothing checked out locally. See
[`sanity/README.md`](sanity/README.md) for where it lives and how to run it.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

Postgres is optional in development. Without it the site still serves — only the
contact form, newsletter, and view counter switch off. To enable them locally
run `createdb $USER`, or set `DATABASE_URL` in `.env`.

To write posts you do not need this repo at all — use the deployed Studio. To
run the Studio locally instead, check it out separately and see
[`sanity/README.md`](sanity/README.md).

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
