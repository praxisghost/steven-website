/**
 * sanity/queries.ts — GROQ queries and their result types.
 *
 * Every query filters on `defined(slug.current)` and `publishedAt <= now()`
 * so half-finished posts and future-dated posts never leak onto the site.
 */

import groq from 'groq';
import type {PortableTextBlock} from '@portabletext/types';
import type {SanityImageSource} from '@sanity/image-url';

const PUBLISHED = `_type == "post" && defined(slug.current) && publishedAt <= now()`;

/** Fields shared by every list view. */
const SUMMARY_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage,
  "mainImageAlt": mainImage.alt,
  featured,
  "categories": categories[]->{ title, "slug": slug.current },
  tags
`;

export interface CategoryRef {
  title: string;
  slug: string;
}

export interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string | null;
  mainImage: SanityImageSource | null;
  mainImageAlt: string | null;
  featured: boolean | null;
  categories: CategoryRef[] | null;
  tags: string[] | null;
}

export interface PostDetail extends PostSummary {
  body: PortableTextBlock[] | null;
  authorName: string | null;
  authorImage: SanityImageSource | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface AdjacentPost {
  title: string;
  slug: string;
}

export const POSTS_QUERY = groq`
  *[${PUBLISHED}] | order(publishedAt desc) { ${SUMMARY_FIELDS} }
`;

/**
 * Full bodies, for the RSS feed. Substack (and most readers) import whatever the
 * feed gives them — excerpt-only feeds produce truncated imports, so the feed
 * carries the whole post.
 */
export const FEED_QUERY = groq`
  *[${PUBLISHED}] | order(publishedAt desc)[0...30] {
    ${SUMMARY_FIELDS},
    body,
    "authorName": author->name
  }
`;

export interface FeedPost extends PostSummary {
  body: PortableTextBlock[] | null;
  authorName: string | null;
}

/** Most recent N, used by the sidebar. */
export const RECENT_POSTS_QUERY = groq`
  *[${PUBLISHED}] | order(publishedAt desc)[0...$limit] { ${SUMMARY_FIELDS} }
`;

export const POST_QUERY = groq`
  *[${PUBLISHED} && slug.current == $slug][0] {
    ${SUMMARY_FIELDS},
    body,
    "authorName": author->name,
    "authorImage": author->image,
    "seoTitle": seo.title,
    "seoDescription": seo.description
  }
`;

/** Neighbouring posts by date, for the prev/next footer. */
export const PREV_POST_QUERY = groq`
  *[${PUBLISHED} && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
    title, "slug": slug.current
  }
`;

export const NEXT_POST_QUERY = groq`
  *[${PUBLISHED} && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
    title, "slug": slug.current
  }
`;

export const POSTS_BY_CATEGORY_QUERY = groq`
  *[${PUBLISHED} && $slug in categories[]->slug.current] | order(publishedAt desc) {
    ${SUMMARY_FIELDS}
  }
`;

export const CATEGORY_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0] {
    title, "slug": slug.current, description
  }
`;

export const POSTS_BY_TAG_QUERY = groq`
  *[${PUBLISHED} && $tag in tags] | order(publishedAt desc) { ${SUMMARY_FIELDS} }
`;

/** Every category that has at least one published post — powers the sidebar. */
export const CATEGORIES_QUERY = groq`
  *[_type == "category" && count(*[${PUBLISHED} && references(^._id)]) > 0]
    | order(title asc) {
      title,
      "slug": slug.current,
      "count": count(*[${PUBLISHED} && references(^._id)])
    }
`;

export interface CategoryWithCount extends CategoryRef {
  count: number;
}

export interface CategoryDetail extends CategoryRef {
  description: string | null;
}
