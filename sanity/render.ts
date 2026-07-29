/**
 * sanity/render.ts — turns Sanity documents into HTML that matches the rest
 * of the site: same stylesheet, same back-link / header / article / footer
 * skeleton as the hand-written pages in public/.
 *
 * All interpolated values go through esc(). Portable Text is rendered by
 * @portabletext/to-html, which escapes text nodes itself.
 */

import {toHTML, type PortableTextHtmlComponents} from '@portabletext/to-html';
import {imageUrl} from './client';
import type {PostDetail, PostSummary} from './queries';

const SITE_NAME = 'Steven Legg';
const LINKTREE  = 'https://linktr.ee/stevenlegg';

/** Escape a string for safe interpolation into HTML text or attributes. */
export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** "June 1, 2026" — used in post headers. */
function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** "June 2026" — used on the index, matching the existing blog.html. */
function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
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
      const safe = /^(https?:\/\/|mailto:|tel:|\/)/i.test(href);
      if (!safe) return children;
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
// PAGE SHELL
// ─────────────────────────────────────────────────────────────────────────────

interface ShellOptions {
  title: string;
  description?: string | null;
  backHref: string;
  backLabel: string;
  heading: string;
  subheading?: string | null;
  bodyHtml: string;
  ogImage?: string | null;
  canonical?: string | null;
}

function shell(o: ShellOptions): string {
  const meta = o.description
    ? `\n  <meta name="description" content="${esc(o.description)}">`
    : '';
  const canonical = o.canonical
    ? `\n  <link rel="canonical" href="${esc(o.canonical)}">`
    : '';
  const og = o.ogImage
    ? `\n  <meta property="og:image" content="${esc(o.ogImage)}">`
    : '';
  const sub = o.subheading ? `\n    <p>${esc(o.subheading)}</p>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(o.title)} — ${SITE_NAME}</title>${meta}${canonical}
  <meta property="og:title" content="${esc(o.title)}">
  <meta property="og:type" content="article">${og}
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <a class="back-link" href="${esc(o.backHref)}">← ${esc(o.backLabel)}</a>

  <header>
    <h1>${esc(o.heading)}</h1>${sub}
  </header>

${o.bodyHtml}

  <footer>
    <a href="${LINKTREE}" target="_blank" rel="noopener noreferrer">${LINKTREE}</a>
  </footer>

  <script src="/script.js"></script>
</body>
</html>
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────────────────────────────────────

export function renderIndex(posts: PostSummary[]): string {
  const items = posts
    .map((post) => {
      const thumb = imageUrl(post.mainImage, 160, 160);
      const thumbHtml = thumb
        ? `
          <div class="article-thumb" aria-hidden="true">
            <img src="${esc(thumb)}" alt="${esc(post.mainImageAlt ?? post.title)}" loading="lazy">
          </div>`
        : '';

      return `      <li>
        <div class="article-card-left">${thumbHtml}
          <a href="/blog/${esc(post.slug)}">${esc(post.title)}</a>
        </div>
        <span class="blog-date">${esc(monthYear(post.publishedAt))}</span>
      </li>`;
    })
    .join('\n');

  const body = `  <article>
    <p class="blog-intro">Longer thoughts. Updated when something feels worth writing down.</p>

    <ul class="blog-list">
${items}
    </ul>
  </article>`;

  return shell({
    title: 'Blog',
    description: 'Longer thoughts from Steven Legg — language learning, politics, and building things.',
    backHref: '/writing.html',
    backLabel: 'Writing',
    heading: 'Blog',
    bodyHtml: body,
  });
}

export function renderPost(post: PostDetail): string {
  const hero = imageUrl(post.mainImage, 1200);
  const heroHtml = hero
    ? `    <figure class="post-hero">
      <img src="${esc(hero)}" alt="${esc(post.mainImageAlt ?? post.title)}">
    </figure>
`
    : '';

  const body = `  <article>
${heroHtml}${renderBody(post.body)}
  </article>`;

  return shell({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    backHref: '/blog',
    backLabel: 'Blog',
    heading: post.title,
    subheading: longDate(post.publishedAt),
    bodyHtml: body,
    ogImage: hero,
  });
}

export function renderNotFound(): string {
  return shell({
    title: 'Post not found',
    backHref: '/blog',
    backLabel: 'Blog',
    heading: 'Post not found',
    bodyHtml: `  <article>
    <p>That post doesn't exist, or it hasn't been published yet.</p>
    <p><a href="/blog">Back to the blog</a></p>
  </article>`,
  });
}
