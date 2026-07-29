/**
 * scripts/import-legacy-posts.ts
 *
 * One-off (but safely repeatable) import of the pre-v3 blog posts into Sanity.
 *
 * The source is git, not the working tree: these files were deleted in the v3.0
 * redesign, so the script reads them straight out of commit SOURCE_COMMIT. That
 * keeps the import reproducible without re-committing 6 MB of old HTML.
 *
 * Idempotency comes from `legacySlug`. Every post carries its original path, so
 * a second run patches the existing document instead of creating a duplicate.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=sk... npx tsx scripts/import-legacy-posts.ts --dry-run
 *   SANITY_WRITE_TOKEN=sk... npx tsx scripts/import-legacy-posts.ts
 */

import {execFileSync} from 'child_process';
import {createClient} from '@sanity/client';
import {htmlToBlocks} from '@portabletext/block-tools';
import {JSDOM} from 'jsdom';
import {Schema} from '@sanity/schema';

const SOURCE_COMMIT = 'd590445';
const DRY_RUN = process.argv.includes('--dry-run');

const token = process.env.SANITY_WRITE_TOKEN;
if (!token && !DRY_RUN) {
  console.error(
    'SANITY_WRITE_TOKEN is not set.\n' +
    'Create one at https://sanity.io/manage → API → Tokens (Editor permission),\n' +
    'then re-run:  SANITY_WRITE_TOKEN=sk... npx tsx scripts/import-legacy-posts.ts',
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? 'mo87nuz0',
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-05-15',
  token,
  useCdn: false,
});

// ── The posts, with the editorial metadata the old HTML didn't carry ─────────
interface Source {
  path: string;          // path under public/ in SOURCE_COMMIT
  slug: string;          // new URL slug
  category: string;      // category title (created if missing)
  tags: string[];
  date: string;          // ISO — the old pages only had "May 2026" at best
  featured?: boolean;
}

const SOURCES: Source[] = [
  // ── Personal writing ──────────────────────────────────────────────────────
  {path: 'blog/american-education-what-we-owe.html', slug: 'american-education-what-we-are-owed',
   category: 'Essays', tags: ['education', 'politics'], date: '2026-06-04', featured: true},
  {path: 'blog/divide-and-the-road-ahead.html', slug: 'the-divide-and-the-road-ahead',
   category: 'Essays', tags: ['politics'], date: '2026-06-04'},
  {path: 'blog/june-1st-2026.html', slug: 'june-1st-2026',
   category: 'Month notes', tags: ['update'], date: '2026-06-01'},
  {path: 'blog/may-2026-update.html', slug: 'may-2026-update',
   category: 'Month notes', tags: ['update'], date: '2026-05-31'},

  // ── Tech opinion ──────────────────────────────────────────────────────────
  {path: 'technology/foldable-phones.html', slug: 'why-i-love-foldable-phones',
   category: 'Technology', tags: ['phones', 'hardware'], date: '2026-05-15'},
  {path: 'technology/smartphone-design.html', slug: 'what-i-miss-from-2014-smartphones',
   category: 'Technology', tags: ['phones', 'design'], date: '2026-05-10'},
  {path: 'technology/return-to-linux.html', slug: 'my-recent-return-to-linux',
   category: 'Technology', tags: ['linux'], date: '2026-04-20'},
  {path: 'technology/macos.html', slug: 'macos',
   category: 'Technology', tags: ['macos'], date: '2026-04-10'},
  {path: 'technology/windows.html', slug: 'windows-11-guide',
   category: 'Technology', tags: ['windows'], date: '2026-04-05'},
  {path: 'technology/linux/fedora-kde-experience.html', slug: 'fedora-kde-my-experience',
   category: 'Technology', tags: ['linux', 'fedora'], date: '2026-04-18'},
  {path: 'technology/linux/fedora-kde-guide.html', slug: 'fedora-kde-guide',
   category: 'Technology', tags: ['linux', 'fedora'], date: '2026-04-16'},
  {path: 'technology/linux/arch.html', slug: 'arch-linux',
   category: 'Technology', tags: ['linux', 'arch'], date: '2026-04-12'},
  {path: 'technology/linux/mint.html', slug: 'linux-mint',
   category: 'Technology', tags: ['linux', 'mint'], date: '2026-04-08'},

  // ── Software tutorials ────────────────────────────────────────────────────
  {path: 'technology/software-tutorials/audacity.html', slug: 'audacity-tutorial',
   category: 'Tutorials', tags: ['audio', 'software'], date: '2026-03-20'},
  {path: 'technology/software-tutorials/gimp.html', slug: 'gimp-tutorial',
   category: 'Tutorials', tags: ['images', 'software'], date: '2026-03-18'},
  {path: 'technology/software-tutorials/kdenlive.html', slug: 'kdenlive-tutorial',
   category: 'Tutorials', tags: ['video', 'software'], date: '2026-03-16'},
  {path: 'technology/software-tutorials/darktable.html', slug: 'darktable-tutorial',
   category: 'Tutorials', tags: ['photography', 'software'], date: '2026-03-14'},
  {path: 'technology/software-tutorials/obsidian.html', slug: 'obsidian-tutorial',
   category: 'Tutorials', tags: ['notes', 'software'], date: '2026-03-12'},
  {path: 'technology/software-tutorials/notion.html', slug: 'notion-tutorial',
   category: 'Tutorials', tags: ['notes', 'software'], date: '2026-03-10'},

  // ── Other ─────────────────────────────────────────────────────────────────
  {path: 'book-reviews/midnight-library-matt-haig.html', slug: 'the-midnight-library-matt-haig',
   category: 'Books', tags: ['fiction'], date: '2026-02-20'},
  {path: 'retro-gaming/playstation-2.html', slug: 'playstation-2',
   category: 'Games', tags: ['retro'], date: '2026-02-10'},
];

// ── Portable Text target schema ──────────────────────────────────────────────
// block-tools needs the compiled block type to know which styles/marks are legal.
const schema = Schema.compile({
  name: 'import',
  types: [
    {
      name: 'blockContent',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Heading', value: 'h2'},
            {title: 'Subheading', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Numbered', value: 'number'}],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {name: 'link', type: 'object', title: 'Link',
               fields: [{name: 'href', type: 'url', title: 'URL'}]},
            ],
          },
        },
      ],
    },
  ],
});
const blockContentType = schema.get('blockContent');

// ── Helpers ──────────────────────────────────────────────────────────────────

function fromGit(path: string): string {
  return execFileSync('git', ['show', `${SOURCE_COMMIT}:public/${path}`], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
}

function imageFromGit(path: string): Buffer {
  return execFileSync('git', ['show', `${SOURCE_COMMIT}:public/${path}`], {
    maxBuffer: 64 * 1024 * 1024,
    encoding: 'buffer',
  }) as unknown as Buffer;
}

/** Resolve an old relative src (../img/foo.jpeg) to a repo path (img/foo.jpeg). */
function resolveImg(src: string): string | null {
  const cleaned = src.replace(/^(\.\.\/)+/, '').replace(/^\//, '');
  return cleaned.startsWith('img/') ? cleaned : null;
}

interface Parsed {
  title: string;
  description: string | null;
  heroSrc: string | null;
  heroAlt: string | null;
  bodyHtml: string;
}

function parse(html: string): Parsed {
  const doc = new JSDOM(html).window.document;

  const title = (doc.querySelector('header h1')?.textContent
    ?? doc.querySelector('title')?.textContent
    ?? 'Untitled').replace(/\s*—\s*Steven Legg\s*$/, '').trim();

  const description =
    doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? null;

  const article = doc.querySelector('article') ?? doc.body;

  // The first .article-hero (or first image) becomes mainImage, not body content.
  const heroEl = article.querySelector('img.article-hero') ?? article.querySelector('img');
  const heroSrc = heroEl?.getAttribute('src') ?? null;
  const heroAlt = heroEl?.getAttribute('alt') ?? null;
  heroEl?.remove();

  // Strip chrome that shouldn't survive into the body.
  article.querySelectorAll('script, style, nav, .back-link, .article-backlink').forEach((el) => el.remove());

  return {title, description, heroSrc, heroAlt, bodyHtml: article.innerHTML};
}

const assetCache = new Map<string, string>();

async function uploadImage(repoPath: string): Promise<string | null> {
  if (assetCache.has(repoPath)) return assetCache.get(repoPath)!;
  try {
    const buf = imageFromGit(repoPath);
    if (!buf?.length) return null;
    const asset = await client.assets.upload('image', buf, {
      filename: repoPath.split('/').pop(),
    });
    assetCache.set(repoPath, asset._id);
    return asset._id;
  } catch (err) {
    console.warn(`    ! image failed (${repoPath}):`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function ensureCategory(title: string): Promise<string> {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existing = await client.fetch<{_id: string} | null>(
    `*[_type == "category" && slug.current == $slug][0]{_id}`, {slug},
  );
  if (existing?._id) return existing._id;
  if (DRY_RUN) return `dry-run-category-${slug}`;
  const created = await client.create({
    _type: 'category',
    title,
    slug: {_type: 'slug', current: slug},
  });
  console.log(`  + category "${title}"`);
  return created._id;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${DRY_RUN ? 'DRY RUN — nothing will be written' : 'Importing'} from ${SOURCE_COMMIT}\n`);

  const categoryIds = new Map<string, string>();
  let created = 0, updated = 0, failed = 0;

  for (const src of SOURCES) {
    process.stdout.write(`  ${src.slug} … `);
    try {
      const parsed = parse(fromGit(src.path));

      // Pre-pass: upload every inline image and map src → asset id. Doing this
      // up front means the deserialize rule below can emit the image *in place*
      // rather than appending screenshots to the bottom of the post.
      const assets = new Map<string, string>();
      {
        const probe = new JSDOM(parsed.bodyHtml).window.document;
        for (const img of Array.from(probe.querySelectorAll('img'))) {
          const rawSrc = img.getAttribute('src') ?? '';
          const p = resolveImg(rawSrc);
          if (!p) continue;
          const ref = DRY_RUN ? 'dry-run-asset' : await uploadImage(p);
          if (ref) assets.set(rawSrc, ref);
        }
      }

      let imgSeq = 0;

      // HTML → Portable Text
      const body = htmlToBlocks(parsed.bodyHtml, blockContentType, {
        parseHtml: (h) => new JSDOM(h).window.document,
        rules: [
          {
            deserialize(el: any, next: any, block: any) {
              const tag = el.tagName?.toLowerCase();

              if (tag === 'a') {
                const href = el.getAttribute('href');
                if (!href) return undefined;
                // Old relative links pointed at pages that no longer exist;
                // keep only absolute and root-relative ones.
                if (!/^(https?:\/\/|mailto:|\/)/i.test(href)) return next(el.childNodes);
                return {
                  _type: '__annotation',
                  markDef: {_type: 'link', href},
                  children: next(el.childNodes),
                };
              }

              if (tag === 'img') {
                const ref = assets.get(el.getAttribute('src') ?? '');
                if (!ref) return undefined; // unresolved image — drop it
                return block({
                  _type: 'contentImage',
                  _key: `img-${imgSeq++}`,
                  alt: el.getAttribute('alt') || '',
                  asset: {_type: 'reference', _ref: ref},
                });
              }

              return undefined;
            },
          },
        ],
      });

      // Hero
      let mainImage: Record<string, unknown> | undefined;
      const heroPath = parsed.heroSrc ? resolveImg(parsed.heroSrc) : null;
      if (heroPath) {
        const ref = DRY_RUN ? 'dry-run-asset' : await uploadImage(heroPath);
        if (ref) {
          mainImage = {
            _type: 'image',
            asset: {_type: 'reference', _ref: ref},
            alt: parsed.heroAlt || parsed.title,
          };
        }
      }

      // Category
      if (!categoryIds.has(src.category)) {
        categoryIds.set(src.category, await ensureCategory(src.category));
      }

      const docBody = {
        _type: 'post' as const,
        title: parsed.title,
        slug: {_type: 'slug' as const, current: src.slug},
        publishedAt: `${src.date}T12:00:00Z`,
        excerpt: parsed.description?.slice(0, 200) ?? undefined,
        body,
        ...(mainImage ? {mainImage} : {}),
        categories: [{
          _type: 'reference' as const,
          _key: `cat-${src.category.toLowerCase().replace(/\W+/g, '')}`,
          _ref: categoryIds.get(src.category)!,
        }],
        tags: src.tags,
        featured: src.featured ?? false,
        legacySlug: src.path.replace(/\.html$/, ''),
      };

      if (DRY_RUN) {
        console.log(`ok (${body.length} blocks${mainImage ? ', hero' : ''}${assets.size ? `, ${assets.size} inline img` : ''})`);
        created++;
        continue;
      }

      const existing = await client.fetch<{_id: string} | null>(
        `*[_type == "post" && legacySlug == $legacy][0]{_id}`,
        {legacy: docBody.legacySlug},
      );

      if (existing?._id) {
        await client.patch(existing._id).set(docBody).commit();
        console.log(`updated (${body.length} blocks)`);
        updated++;
      } else {
        await client.create(docBody);
        console.log(`created (${body.length} blocks)`);
        created++;
      }
    } catch (err) {
      console.log('FAILED');
      console.error(`    ${err instanceof Error ? err.message : err}`);
      failed++;
    }
  }

  console.log(
    `\n${failed === 0 ? '✅' : '⚠️'}  ${created} created, ${updated} updated, ${failed} failed\n`,
  );
  if (!DRY_RUN && failed === 0) {
    console.log('Next: open the Studio and spot-check a few, then clear the site cache:');
    console.log('  curl -X POST https://www.steven-legg.com/api/blog/revalidate \\');
    console.log('    -H "x-revalidate-secret: $SANITY_REVALIDATE_SECRET"\n');
  }
}

main().catch((err) => {
  console.error('\nImport aborted:', err);
  process.exit(1);
});
