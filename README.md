# steven-legg.com

A personal blog. Express + TypeScript serving static pages, with
[Sanity](https://www.sanity.io) as the CMS so posts can be written from a laptop
or a phone without touching Git.

```
website/                  this repo — the site
studio-steven-legg.com/   sibling folder — the Sanity Studio
```

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

Postgres is optional in development. Without it the site still serves — only the
contact form, newsletter, and view counter switch off. To enable them locally
run `createdb $USER`, or set `DATABASE_URL` in `.env`.

To write posts, run the Studio in a second terminal:

```bash
cd ../studio-steven-legg.com && npm run dev    # http://localhost:3333
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

## Layout

```
server.ts          Express app: security headers, rate limiting, API endpoints
sanity/
  client.ts        Sanity client + image URL helper
  queries.ts       GROQ queries and their types
  render.ts        Portable Text → HTML, page templates, site chrome
  routes.ts        Blog routes, caching, RSS, sitemap, revalidate webhook
public/            Static pages, CSS, images, legacy posts
send-newsletter.ts CLI for sending an issue to subscribers
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

Railway builds from `main` and runs `npm start`. Set the environment variables in
Railway rather than committing them.
