/**
 * sanity/routes.ts — every reader-facing route, backed by Sanity.
 *
 *   GET  /                    → blog home (featured post + list + sidebar)
 *   GET  /blog                → alias of /
 *   GET  /blog/:slug          → a post
 *   GET  /category/:slug      → posts in a category
 *   GET  /tag/:tag            → posts with a tag
 *   GET  /feed.xml            → RSS 2.0
 *   GET  /sitemap.xml         → sitemap
 *   POST /api/blog/revalidate → webhook; clears the cache on publish
 *
 * Responses are cached in-process for CACHE_TTL_MS so Sanity stays out of the
 * hot path. The webhook makes publishing feel instant regardless.
 */

import {Router, type Request, type Response, type NextFunction} from 'express';
import path from 'path';
import fs from 'fs';
import {timingSafeEqual} from 'crypto';

import {client, SITE_URL, imageUrl} from './client';
import {
  POSTS_QUERY,
  FEED_QUERY,
  type FeedPost,
  POST_QUERY,
  RECENT_POSTS_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_QUERY,
  POSTS_BY_CATEGORY_QUERY,
  POSTS_BY_TAG_QUERY,
  PREV_POST_QUERY,
  NEXT_POST_QUERY,
  type AdjacentPost,
  type CategoryDetail,
  type CategoryWithCount,
  type PostDetail,
  type PostSummary,
} from './queries';
import {
  renderIndex,
  renderPost,
  renderArchive,
  renderNotFound,
  renderBody,
  esc,
  readingTime,
  type SidebarData,
} from './render';

const CACHE_TTL_MS = 60_000;
const SLUG_RE = /^[a-z0-9-]{1,96}$/;
const TAG_RE = /^[a-z0-9 -]{1,48}$/i;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// ── tiny TTL cache ───────────────────────────────────────────────────────────
interface Entry { html: string; expires: number }
const cache = new Map<string, Entry>();

function getCached(key: string): string | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) { cache.delete(key); return null; }
  return hit.html;
}
function setCached(key: string, html: string): void {
  cache.set(key, {html, expires: Date.now() + CACHE_TTL_MS});
}
export function clearBlogCache(): void { cache.clear(); }

// ── helpers ──────────────────────────────────────────────────────────────────
function sendHtml(res: Response, html: string, status = 200): void {
  res.status(status).type('html')
     .setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
  res.send(html);
}

function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Sidebar needs recent posts + categories on nearly every page. */
async function loadSidebar(): Promise<SidebarData> {
  const [recent, categories] = await Promise.all([
    client.fetch<PostSummary[]>(RECENT_POSTS_QUERY, {limit: 6}),
    client.fetch<CategoryWithCount[]>(CATEGORIES_QUERY),
  ]);
  return {recent: recent ?? [], categories: categories ?? []};
}

function logFail(what: string, err: unknown): void {
  console.error(`[sanity] ${what} failed:`, err instanceof Error ? err.message : err);
}

export const blogRouter = Router();

// ── Home / blog index ────────────────────────────────────────────────────────
async function indexHandler(_req: Request, res: Response): Promise<void> {
  const cached = getCached('index');
  if (cached) { sendHtml(res, cached); return; }

  try {
    const [posts, side] = await Promise.all([
      client.fetch<PostSummary[]>(POSTS_QUERY),
      loadSidebar(),
    ]);
    const html = renderIndex(posts ?? [], side);
    setCached('index', html);
    sendHtml(res, html);
  } catch (err) {
    logFail('blog index', err);
    sendHtml(res, renderIndex([], {recent: [], categories: []}), 503);
  }
}

blogRouter.get('/', indexHandler);
blogRouter.get('/blog', indexHandler);

// ── Category archive ─────────────────────────────────────────────────────────
blogRouter.get('/category/:slug', async (req: Request, res: Response) => {
  const raw = req.params.slug;
  const slug = typeof raw === 'string' ? raw : '';
  if (!SLUG_RE.test(slug)) { sendHtml(res, renderNotFound(), 404); return; }

  const key = `cat:${slug}`;
  const cached = getCached(key);
  if (cached) { sendHtml(res, cached); return; }

  try {
    const [category, posts, side] = await Promise.all([
      client.fetch<CategoryDetail | null>(CATEGORY_QUERY, {slug}),
      client.fetch<PostSummary[]>(POSTS_BY_CATEGORY_QUERY, {slug}),
      loadSidebar(),
    ]);
    if (!category) { sendHtml(res, renderNotFound(), 404); return; }

    const html = renderArchive({
      heading: category.title,
      description: category.description,
      posts: posts ?? [],
      side,
    });
    setCached(key, html);
    sendHtml(res, html);
  } catch (err) {
    logFail(`category "${slug}"`, err);
    sendHtml(res, renderNotFound(), 503);
  }
});

// ── Tag archive ──────────────────────────────────────────────────────────────
blogRouter.get('/tag/:tag', async (req: Request, res: Response) => {
  const raw = req.params.tag;
  const tag = typeof raw === 'string' ? decodeURIComponent(raw) : '';
  if (!TAG_RE.test(tag)) { sendHtml(res, renderNotFound(), 404); return; }

  const key = `tag:${tag.toLowerCase()}`;
  const cached = getCached(key);
  if (cached) { sendHtml(res, cached); return; }

  try {
    const [posts, side] = await Promise.all([
      // groq's inferred param type for `$tag in tags` is too narrow; the query
      // genuinely takes a string, so pass it through a plain param record.
      client.fetch<PostSummary[]>(POSTS_BY_TAG_QUERY, {tag} as Record<string, string>),
      loadSidebar(),
    ]);
    const html = renderArchive({
      heading: `#${tag}`,
      description: `Posts tagged “${tag}”.`,
      posts: posts ?? [],
      side,
      emptyText: 'Nothing carries this tag yet.',
    });
    setCached(key, html);
    sendHtml(res, html);
  } catch (err) {
    logFail(`tag "${tag}"`, err);
    sendHtml(res, renderNotFound(), 503);
  }
});

// ── Individual post ──────────────────────────────────────────────────────────
blogRouter.get('/blog/:slug', async (req: Request, res: Response, next: NextFunction) => {
  const raw = req.params.slug;
  const slug = typeof raw === 'string' ? raw : '';

  // Anything that could climb the tree is refused outright.
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    sendHtml(res, renderNotFound(), 404);
    return;
  }
  // Not slug-shaped — most likely a real file such as /blog/my-post.html.
  // Hand it to express.static rather than 404-ing here.
  if (!SLUG_RE.test(slug)) { next(); return; }

  const key = `post:${slug}`;
  const cached = getCached(key);
  if (cached) { sendHtml(res, cached); return; }

  const legacyFile = path.join(PUBLIC_DIR, 'blog', `${slug}.html`);

  try {
    const post = await client.fetch<PostDetail | null>(POST_QUERY, {slug});

    if (!post) {
      // Fall back to a legacy static post if one still exists.
      if (fs.existsSync(legacyFile)) { res.sendFile(legacyFile); return; }
      sendHtml(res, renderNotFound(), 404);
      return;
    }

    const [side, prev, nxt] = await Promise.all([
      loadSidebar(),
      client.fetch<AdjacentPost | null>(PREV_POST_QUERY, {publishedAt: post.publishedAt}),
      client.fetch<AdjacentPost | null>(NEXT_POST_QUERY, {publishedAt: post.publishedAt}),
    ]);

    const html = renderPost(post, side, prev, nxt);
    setCached(key, html);
    sendHtml(res, html);
  } catch (err) {
    logFail(`post "${slug}"`, err);
    if (fs.existsSync(legacyFile)) { res.sendFile(legacyFile); return; }
    sendHtml(res, renderNotFound(), 503);
  }
});

// ── RSS ──────────────────────────────────────────────────────────────────────
blogRouter.get('/feed.xml', async (_req: Request, res: Response) => {
  const cached = getCached('feed');
  if (cached) { res.type('application/xml').send(cached); return; }

  try {
    const posts = (await client.fetch<FeedPost[]>(FEED_QUERY)) ?? [];

    const items = posts.map((p) => {
      const url = `${SITE_URL}/blog/${esc(p.slug)}`;

      // Full HTML body, with a hero image on top and relative URLs made
      // absolute — feed readers and Substack have no page to resolve against.
      const hero = imageUrl(p.mainImage, 1200);
      const bodyHtml = (hero ? `<p><img src="${esc(hero)}" alt="${esc(p.mainImageAlt ?? p.title)}"></p>` : '')
        + renderBody(p.body).replace(/(href|src)="\//g, `$1="${SITE_URL}/`);

      const cats = (p.categories ?? [])
        .map((c) => `      <category>${esc(c.title)}</category>`)
        .join('\n');

      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${esc(p.authorName ?? 'Steven Legg')}</dc:creator>
${cats}${cats ? '\n' : ''}${p.excerpt ? `      <description>${esc(p.excerpt)}</description>\n` : ''}      <content:encoded><![CDATA[${bodyHtml.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Steven Legg</title>
    <link>${SITE_URL}</link>
    <description>Notes on learning, work, and getting better at things.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
    setCached('feed', xml);
    res.type('application/xml').send(xml);
  } catch (err) {
    logFail('rss feed', err);
    res.status(503).type('text/plain').send('Feed temporarily unavailable');
  }
});

// ── Sitemap ──────────────────────────────────────────────────────────────────
blogRouter.get('/sitemap.xml', async (_req: Request, res: Response) => {
  const cached = getCached('sitemap');
  if (cached) { res.type('application/xml').send(cached); return; }

  try {
    const [posts, categories] = await Promise.all([
      client.fetch<PostSummary[]>(POSTS_QUERY),
      client.fetch<CategoryWithCount[]>(CATEGORIES_QUERY),
    ]);

    const urls: string[] = [
      `  <url><loc>${SITE_URL}/</loc></url>`,
      `  <url><loc>${SITE_URL}/about</loc></url>`,
      `  <url><loc>${SITE_URL}/projects</loc></url>`,
      `  <url><loc>${SITE_URL}/contact</loc></url>`,
    ];
    for (const p of posts ?? []) {
      urls.push(`  <url><loc>${SITE_URL}/blog/${esc(p.slug)}</loc><lastmod>${new Date(p.publishedAt).toISOString().slice(0, 10)}</lastmod></url>`);
    }
    for (const c of categories ?? []) {
      urls.push(`  <url><loc>${SITE_URL}/category/${esc(c.slug)}</loc></url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
    setCached('sitemap', xml);
    res.type('application/xml').send(xml);
  } catch (err) {
    logFail('sitemap', err);
    res.status(503).type('text/plain').send('Sitemap temporarily unavailable');
  }
});

// ── Revalidate webhook ───────────────────────────────────────────────────────
blogRouter.post('/api/blog/revalidate', (req: Request, res: Response) => {
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  // This is a write-like endpoint: never leave a cache-purge trigger open on
  // a public deployment. The normal 60-second cache expiry remains available
  // until the hosting environment is configured with a shared webhook secret.
  if (!expected) {
    res.status(503).json({error: 'Webhook is not configured.'});
    return;
  }

  const header = req.get('x-revalidate-secret');
  const query = typeof req.query.secret === 'string' ? req.query.secret : undefined;
  if (!secretMatches(header ?? query ?? '', expected)) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }

  clearBlogCache();
  console.log('[sanity] blog cache cleared via webhook');
  res.json({revalidated: true});
});

export {readingTime};
