/**
 * sanity/render.ts — Sanity documents → HTML.
 *
 * Everything the blog renders comes through here: the site chrome (header,
 * sidebar, footer), the index, individual posts, and the category/tag archives.
 *
 * All interpolated values go through esc(). Portable Text is rendered by
 * @portabletext/to-html, which escapes text nodes itself.
 */

import {toHTML, type PortableTextHtmlComponents} from '@portabletext/to-html';
import {imageUrl} from './client';
import type {
  AdjacentPost,
  CategoryWithCount,
  PostDetail,
  PostSummary,
} from './queries';

const SITE_NAME = 'Steven Legg';
const SITE_TAGLINE = 'Notes on learning, work, and getting better at things';
const LINKTREE = 'https://linktr.ee/stevenlegg';
const AVATAR = '/img/frogs/avatar.jpeg';

/** Escape a string for safe interpolation into HTML text or attributes. */
export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** "June 1, 2026" — post headers and cards. */
function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

/** "Jun 1, 2026" — tight spaces like the sidebar. */
function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  });
}

/**
 * Reading time from Portable Text. Counts words in span children only, so
 * image and embed nodes don't inflate the estimate. 220 wpm is the usual
 * figure for adult non-technical prose.
 */
export function readingTime(body: PostDetail['body']): number {
  if (!body?.length) return 1;
  let words = 0;
  for (const block of body as unknown as Array<Record<string, unknown>>) {
    const children = block?.children;
    if (!Array.isArray(children)) continue;
    for (const child of children as Array<Record<string, unknown>>) {
      if (typeof child?.text === 'string') {
        words += child.text.trim().split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return Math.max(1, Math.round(words / 220));
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTABLE TEXT
// ─────────────────────────────────────────────────────────────────────────────

const components: Partial<PortableTextHtmlComponents> = {
  types: {
    contentImage: ({value}) => {
      const src = imageUrl(value, 1200);
      if (!src) return '';
      const img = `<img src="${esc(src)}" alt="${esc(value?.alt ?? '')}" loading="lazy">`;
      return value?.caption
        ? `<figure>${img}<figcaption>${esc(value.caption)}</figcaption></figure>`
        : `<figure>${img}</figure>`;
    },
  },
  marks: {
    link: ({children, value}) => {
      const href = String(value?.href ?? '');
      // Only http(s), mailto, tel and site-relative links — no javascript: URLs.
      if (!/^(https?:\/\/|mailto:|tel:|\/)/i.test(href)) return children;
      const external = /^https?:\/\//i.test(href);
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${esc(href)}"${rel}>${children}</a>`;
    },
  },
};

export function renderBody(body: PostDetail['body']): string {
  if (!body || body.length === 0) return '';
  return toHTML(body, {components});
}

// ─────────────────────────────────────────────────────────────────────────────
// CHROME
// ─────────────────────────────────────────────────────────────────────────────

type NavKey = 'blog' | 'about' | 'projects' | 'contact' | null;

function header(active: NavKey): string {
  const item = (href: string, label: string, key: NavKey) =>
    `<li><a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a></li>`;

  return `  <header class="site-header">
    <div class="site-header__inner">
      <p class="site-title">
        <a href="/">${SITE_NAME}</a>
        <span class="site-title__tag">Personal blog</span>
      </p>
      <nav class="site-nav" aria-label="Main">
        <ul>
${item('/', 'Blog', 'blog')}
${item('/about', 'About', 'about')}
${item('/projects', 'Projects', 'projects')}
${item('/contact', 'Contact', 'contact')}
        </ul>
      </nav>
    </div>
  </header>`;
}

function footer(): string {
  const year = new Date().getUTCFullYear();
  return `  <footer class="site-footer">
    <div class="site-footer__inner">
      <p>© ${year} ${SITE_NAME}</p>
      <nav aria-label="Footer">
        <ul>
          <li><a href="/">Blog</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/feed.xml">RSS</a></li>
          <li><a href="${LINKTREE}" target="_blank" rel="noopener noreferrer">Elsewhere</a></li>
        </ul>
      </nav>
    </div>
  </footer>`;
}

/** Newsletter card — the same markup wherever it appears. */
export function newsletterCard(): string {
  return `      <section class="card newsletter" aria-labelledby="nl-title">
        <h2 class="card__title" id="nl-title">Newsletter</h2>
        <p class="newsletter__pitch">New posts in your inbox. No spam, no schedule — just when something's worth sending.</p>
        <form class="field" id="newsletter-form" novalidate>
          <label class="visually-hidden" for="nl-email">Email address</label>
          <input type="email" id="nl-email" name="email" placeholder="you@example.com" autocomplete="email" required>
          <button type="submit" class="btn">Subscribe</button>
        </form>
        <p class="form-note" id="newsletter-note" role="status" aria-live="polite"></p>
      </section>`;
}

function bioCard(): string {
  return `      <section class="card bio" aria-labelledby="bio-title">
        <h2 class="visually-hidden" id="bio-title">About the author</h2>
        <img class="bio__avatar" src="${AVATAR}" alt="Steven Legg" width="96" height="96"
             onerror="this.style.display='none'">
        <p class="bio__name">Steven Legg</p>
        <p class="bio__text">Boston. Languages, politics, and the slow work of building better habits. I write here to think out loud.</p>
        <a class="chip" href="/about">Read more</a>
      </section>`;
}

function recentCard(posts: PostSummary[], excludeSlug?: string): string {
  const items = posts
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, 5)
    .map((p) => {
      const thumb = imageUrl(p.mainImage, 124, 124);
      const media = thumb
        ? `<a class="mini-post__media" href="/blog/${esc(p.slug)}"><img src="${esc(thumb)}" alt="" loading="lazy"></a>`
        : '';
      return `          <li class="mini-post${thumb ? '' : ' mini-post--nomedia'}">
${media ? media + '\n' : ''}            <div>
              <h4><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h4>
              <time datetime="${esc(p.publishedAt)}">${esc(shortDate(p.publishedAt))}</time>
            </div>
          </li>`;
    })
    .join('\n');

  if (!items) return '';
  return `      <section class="card" aria-labelledby="recent-title">
        <h2 class="card__title" id="recent-title">Latest posts</h2>
        <ul class="mini-list">
${items}
        </ul>
      </section>`;
}

function categoriesCard(categories: CategoryWithCount[]): string {
  if (!categories.length) return '';
  const chips = categories
    .map((c) => `<li><a class="chip" href="/category/${esc(c.slug)}">${esc(c.title)} (${c.count})</a></li>`)
    .join('\n            ');
  return `      <section class="card" aria-labelledby="cat-title">
        <h2 class="card__title" id="cat-title">Categories</h2>
        <ul class="chips">
            ${chips}
        </ul>
      </section>`;
}

export interface SidebarData {
  recent: PostSummary[];
  categories: CategoryWithCount[];
  excludeSlug?: string;
}

function sidebar(data: SidebarData): string {
  return `    <aside class="sidebar">
${bioCard()}
${newsletterCard()}
${recentCard(data.recent, data.excludeSlug)}
${categoriesCard(data.categories)}
    </aside>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE SHELL
// ─────────────────────────────────────────────────────────────────────────────

interface ShellOptions {
  title: string;
  description?: string | null;
  bodyHtml: string;
  active?: NavKey;
  ogImage?: string | null;
  ogType?: string;
  canonical?: string | null;
  extraHead?: string;
}

export function shell(o: ShellOptions): string {
  const meta = o.description ? `\n  <meta name="description" content="${esc(o.description)}">` : '';
  const canonical = o.canonical ? `\n  <link rel="canonical" href="${esc(o.canonical)}">` : '';
  const og = o.ogImage ? `\n  <meta property="og:image" content="${esc(o.ogImage)}">` : '';
  const ogDesc = o.description ? `\n  <meta property="og:description" content="${esc(o.description)}">` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(o.title)} — ${SITE_NAME}</title>${meta}${canonical}
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${esc(o.title)}">
  <meta property="og:type" content="${esc(o.ogType ?? 'website')}">${ogDesc}${og}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="alternate" type="application/rss+xml" title="${SITE_NAME}" href="/feed.xml">
  <link rel="stylesheet" href="/style.css">${o.extraHead ?? ''}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header(o.active ?? null)}

${o.bodyHtml}

${footer()}
  <script src="/script.js"></script>
</body>
</html>
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTIALS
// ─────────────────────────────────────────────────────────────────────────────

function chipsFor(post: PostSummary): string {
  if (!post.categories?.length) return '';
  const items = post.categories
    .map((c) => `<li><a class="chip" href="/category/${esc(c.slug)}">${esc(c.title)}</a></li>`)
    .join('');
  return `<ul class="chips">${items}</ul>`;
}

function metaLine(post: PostSummary, minutes?: number): string {
  const parts = [`<time datetime="${esc(post.publishedAt)}">${esc(longDate(post.publishedAt))}</time>`];
  if (minutes) parts.push(`<span>${minutes} min read</span>`);
  return `<p class="post-meta">${parts.join('<span class="post-meta__sep">·</span>')}</p>`;
}

function featuredBlock(post: PostSummary): string {
  const hero = imageUrl(post.mainImage, 1100, 620);
  const media = hero
    ? `      <a class="featured__media" href="/blog/${esc(post.slug)}">
        <img src="${esc(hero)}" alt="${esc(post.mainImageAlt ?? post.title)}">
      </a>\n`
    : '';
  const excerpt = post.excerpt ? `      <p class="featured__excerpt">${esc(post.excerpt)}</p>\n` : '';

  return `    <article class="featured">
${media}      ${chipsFor(post)}
      <h2><a href="/blog/${esc(post.slug)}">${esc(post.title)}</a></h2>
${excerpt}      ${metaLine(post)}
    </article>`;
}

function postCard(post: PostSummary): string {
  const thumb = imageUrl(post.mainImage, 300, 225);
  const media = thumb
    ? `        <a class="post-card__media" href="/blog/${esc(post.slug)}">
          <img src="${esc(thumb)}" alt="${esc(post.mainImageAlt ?? post.title)}" loading="lazy">
        </a>\n`
    : '';
  const excerpt = post.excerpt ? `          <p class="post-card__excerpt">${esc(post.excerpt)}</p>\n` : '';

  return `      <li class="post-card${thumb ? '' : ' post-card--nomedia'}">
${media}        <div>
          ${chipsFor(post)}
          <h3><a href="/blog/${esc(post.slug)}">${esc(post.title)}</a></h3>
${excerpt}          ${metaLine(post)}
        </div>
      </li>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────────────────────────────────────

export function renderIndex(posts: PostSummary[], side: SidebarData): string {
  let main: string;

  if (!posts.length) {
    main = `    <div class="empty">
      <h2>Nothing published yet</h2>
      <p>The first post is on its way.</p>
    </div>`;
  } else {
    // Newest post flagged "featured" gets the big slot; otherwise the newest post.
    const featured = posts.find((p) => p.featured) ?? posts[0];
    const rest = posts.filter((p) => p._id !== featured._id);
    const list = rest.length
      ? `    <ul class="post-list">
${rest.map(postCard).join('\n')}
    </ul>`
      : '';
    main = `${featuredBlock(featured)}
${list}`;
  }

  const body = `  <div class="shell shell--with-sidebar">
    <main id="main">
${main}
    </main>
${sidebar(side)}
  </div>`;

  return shell({
    title: 'Blog',
    description: SITE_TAGLINE,
    bodyHtml: body,
    active: 'blog',
    canonical: '/',
  });
}

export function renderArchive(opts: {
  heading: string;
  description?: string | null;
  posts: PostSummary[];
  side: SidebarData;
  emptyText?: string;
}): string {
  const list = opts.posts.length
    ? `    <ul class="post-list">
${opts.posts.map(postCard).join('\n')}
    </ul>`
    : `    <div class="empty">
      <h2>Nothing here yet</h2>
      <p>${esc(opts.emptyText ?? 'No posts have been filed under this one.')}</p>
    </div>`;

  const body = `  <div class="shell shell--with-sidebar">
    <main id="main">
      <a class="back-link" href="/">← All posts</a>
      <div class="page-head">
        <h1>${esc(opts.heading)}</h1>
${opts.description ? `        <p>${esc(opts.description)}</p>\n` : ''}      </div>
${list}
    </main>
${sidebar(opts.side)}
  </div>`;

  return shell({
    title: opts.heading,
    description: opts.description ?? `Posts filed under ${opts.heading}.`,
    bodyHtml: body,
    active: 'blog',
  });
}

export function renderPost(
  post: PostDetail,
  side: SidebarData,
  prev: AdjacentPost | null,
  next: AdjacentPost | null,
): string {
  const hero = imageUrl(post.mainImage, 1200);
  const minutes = readingTime(post.body);

  const heroHtml = hero
    ? `      <figure class="post-hero">
        <img src="${esc(hero)}" alt="${esc(post.mainImageAlt ?? post.title)}">
      </figure>\n`
    : '';

  const avatar = imageUrl(post.authorImage, 80, 80) ?? AVATAR;
  const byline = `      <div class="post-byline">
        <img src="${esc(avatar)}" alt="" width="40" height="40" onerror="this.style.display='none'">
        <div>
          <p class="post-byline__name">${esc(post.authorName ?? SITE_NAME)}</p>
          <p class="post-byline__meta">${esc(longDate(post.publishedAt))} · ${minutes} min read</p>
        </div>
      </div>`;

  const tags = post.tags?.length
    ? `<ul class="chips">${post.tags.map((t) => `<li><a class="chip" href="/tag/${encodeURIComponent(t)}">#${esc(t)}</a></li>`).join('')}</ul>`
    : '';

  const prevNext = (prev || next)
    ? `      <nav class="post-nav" aria-label="More posts">
${prev ? `        <a href="/blog/${esc(prev.slug)}"><span>← Previous</span><strong>${esc(prev.title)}</strong></a>` : '<div></div>'}
${next ? `        <a class="post-nav--next" href="/blog/${esc(next.slug)}"><span>Next →</span><strong>${esc(next.title)}</strong></a>` : '<div></div>'}
      </nav>`
    : '';

  const body = `  <div class="shell shell--with-sidebar">
    <main id="main">
      <a class="back-link" href="/">← All posts</a>
      <article>
        <header class="post-header">
          ${chipsFor(post)}
          <h1>${esc(post.title)}</h1>
${byline}
        </header>
${heroHtml}        <div class="prose">
${renderBody(post.body)}
        </div>
        <footer class="post-footer">
          ${tags}
        </footer>
      </article>
${prevNext}
    </main>
${sidebar({...side, excludeSlug: post.slug})}
  </div>`;

  return shell({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    bodyHtml: body,
    active: 'blog',
    ogImage: hero,
    ogType: 'article',
    canonical: `/blog/${post.slug}`,
  });
}

export function renderNotFound(): string {
  const body = `  <div class="shell shell--narrow">
    <main id="main">
      <div class="empty">
        <h2>Page not found</h2>
        <p>That page doesn't exist, or it hasn't been published yet.</p>
        <p style="margin-top:1.25rem"><a href="/">← Back to the blog</a></p>
      </div>
    </main>
  </div>`;
  return shell({title: 'Not found', bodyHtml: body});
}
