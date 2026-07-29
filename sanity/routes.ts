/**
 * sanity/routes.ts — the /blog routes, backed by Sanity.
 *
 * Behaviour is deliberately additive: nothing that worked before stops
 * working.
 *
 *   GET  /blog             → Sanity posts. Falls back to the hand-written
 *                            public/blog.html if Sanity has no posts yet or
 *                            is unreachable.
 *   GET  /blog/:slug       → Sanity post. Falls back to a legacy static file
 *                            at public/blog/<slug>.html if one exists, so the
 *                            older posts keep resolving while you migrate.
 *   POST /api/blog/revalidate → webhook target; clears the cache so a newly
 *                            published post appears immediately.
 *
 * Responses are cached in-process for CACHE_TTL_MS. That keeps Sanity out of
 * the hot path without making the site feel stale — and the webhook makes
 * publishing instant regardless.
 */

import {Router, type Request, type Response, type NextFunction} from 'express';
import path from 'path';
import fs from 'fs';
import {timingSafeEqual} from 'crypto';

import {client} from './client';
import {POSTS_QUERY, POST_QUERY, type PostDetail, type PostSummary} from './queries';
import {renderIndex, renderPost, renderNotFound} from './render';

const CACHE_TTL_MS = 60_000;
const SLUG_RE = /^[a-z0-9-]{1,96}$/;

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const LEGACY_INDEX = path.join(PUBLIC_DIR, 'blog.html');

// ── tiny TTL cache ───────────────────────────────────────────────────────────
interface Entry {
  html: string;
  expires: number;
}
const cache = new Map<string, Entry>();

function getCached(key: string): string | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.html;
}

function setCached(key: string, html: string): void {
  cache.set(key, {html, expires: Date.now() + CACHE_TTL_MS});
}

export function clearBlogCache(): void {
  cache.clear();
}

// ── helpers ──────────────────────────────────────────────────────────────────

function sendHtml(res: Response, html: string, status = 200): void {
  res
    .status(status)
    .type('html')
    .setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
  res.send(html);
}

/** Constant-time secret comparison that tolerates differing lengths. */
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ── router ───────────────────────────────────────────────────────────────────

export const blogRouter = Router();

/** Blog index. */
blogRouter.get('/blog', async (_req: Request, res: Response) => {
  const cached = getCached('index');
  if (cached) return sendHtml(res, cached);

  try {
    const posts = await client.fetch<PostSummary[]>(POSTS_QUERY);

    // Nothing in Sanity yet — keep serving the existing hand-written index so
    // the site never regresses to an empty page.
    if (!posts || posts.length === 0) {
      if (fs.existsSync(LEGACY_INDEX)) return res.sendFile(LEGACY_INDEX);
      return sendHtml(res, renderIndex([]));
    }

    const html = renderIndex(posts);
    setCached('index', html);
    return sendHtml(res, html);
  } catch (err) {
    console.error('[sanity] blog index failed:', err instanceof Error ? err.message : err);
    if (fs.existsSync(LEGACY_INDEX)) return res.sendFile(LEGACY_INDEX);
    return sendHtml(res, renderNotFound(), 503);
  }
});

/** Individual post. */
blogRouter.get('/blog/:slug', async (req: Request, res: Response, next: NextFunction) => {
  // Express types allow repeated params as string[]; only a single plain
  // string is ever a valid slug here.
  const raw = req.params.slug;
  const slug = typeof raw === 'string' ? raw : '';

  // Anything that could climb the tree is refused outright.
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    return sendHtml(res, renderNotFound(), 404);
  }

  // Not slug-shaped — most likely a real file such as /blog/my-post.html.
  // Hand it back to express.static rather than 404-ing here.
  if (!SLUG_RE.test(slug)) return next();

  const cacheKey = `post:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return sendHtml(res, cached);

  const legacyFile = path.join(PUBLIC_DIR, 'blog', `${slug}.html`);

  try {
    const post = await client.fetch<PostDetail | null>(POST_QUERY, {slug});

    if (!post) {
      // Not in Sanity — fall back to a legacy static post if one exists.
      if (fs.existsSync(legacyFile)) return res.sendFile(legacyFile);
      return sendHtml(res, renderNotFound(), 404);
    }

    const html = renderPost(post);
    setCached(cacheKey, html);
    return sendHtml(res, html);
  } catch (err) {
    console.error(`[sanity] post "${slug}" failed:`, err instanceof Error ? err.message : err);
    if (fs.existsSync(legacyFile)) return res.sendFile(legacyFile);
    return sendHtml(res, renderNotFound(), 503);
  }
});

/**
 * Webhook target. Point a Sanity webhook at POST /api/blog/revalidate so the
 * cache clears the instant you publish.
 *
 * If SANITY_REVALIDATE_SECRET is set, the request must carry it in either the
 * `x-revalidate-secret` header or a `?secret=` query param.
 */
blogRouter.post('/api/blog/revalidate', (req: Request, res: Response) => {
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (expected) {
    const header = req.get('x-revalidate-secret');
    const query = typeof req.query.secret === 'string' ? req.query.secret : undefined;
    const provided = header ?? query ?? '';
    if (!secretMatches(provided, expected)) {
      return res.status(401).json({error: 'Unauthorized'});
    }
  }

  clearBlogCache();
  console.log('[sanity] blog cache cleared via webhook');
  return res.json({revalidated: true});
});
