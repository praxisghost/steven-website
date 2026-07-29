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

export interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string | null;
  mainImage: SanityImageSource | null;
  mainImageAlt: string | null;
}

export interface PostDetail extends PostSummary {
  body: PortableTextBlock[] | null;
  authorName: string | null;
  categories: string[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export const POSTS_QUERY = groq`
  *[${PUBLISHED}] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    "mainImageAlt": mainImage.alt
  }
`;

export const POST_QUERY = groq`
  *[${PUBLISHED} && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    "mainImageAlt": mainImage.alt,
    body,
    "authorName": author->name,
    "categories": categories[]->title,
    "seoTitle": seo.title,
    "seoDescription": seo.description
  }
`;

/** Slugs only — used to warm the cache and to build the sitemap later. */
export const POST_SLUGS_QUERY = groq`
  *[${PUBLISHED}].slug.current
`;
