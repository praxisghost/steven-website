/**
 * sanity/client.ts — read-only Sanity client for the Express site.
 *
 * The `production` dataset is public, so ordinary reads need no token. A token
 * is only required if you later make the dataset private or want to preview
 * drafts; set SANITY_API_READ_TOKEN in that case.
 */

import {createClient, type SanityClient} from '@sanity/client';
import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url';

export const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID ?? 'mo87nuz0';
export const SANITY_DATASET    = process.env.SANITY_DATASET    ?? 'production';

/** Absolute origin, used for RSS/sitemap/canonical URLs. No trailing slash. */
export const SITE_URL = (process.env.SITE_URL ?? 'https://www.steven-legg.com').replace(/\/$/, '');

// Pin the API version. Bump deliberately, never to "now".
const API_VERSION = '2026-05-15';

export const client: SanityClient = createClient({
  projectId:  SANITY_PROJECT_ID,
  dataset:    SANITY_DATASET,
  apiVersion: API_VERSION,
  // The CDN is edge-cached and plenty fresh for a blog; the webhook below
  // busts our own in-process cache the moment something is published.
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
  perspective: 'published',
});

const builder = createImageUrlBuilder(client);

/** Build a CDN image URL. Returns null when the source is missing. */
export function imageUrl(
  source: SanityImageSource | undefined | null,
  width: number,
  height?: number,
): string | null {
  if (!source) return null;
  let url = builder.image(source).width(width).auto('format').fit('crop');
  if (height) url = url.height(height);
  return url.url();
}
