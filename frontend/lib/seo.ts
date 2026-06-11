import type { Metadata } from "next";
import type { Article } from "@/lib/content";
import { leadText } from "@/lib/content";

// Canonical production origin (Railway custom domain, §STACK). Used as
// metadataBase so relative OG/canonical URLs resolve to absolute ones.
export const SITE_URL = "https://www.stevenlegg.xyz";
export const SITE_NAME = "Steven Legg";
export const SITE_DESCRIPTION =
  "The personal site of Steven Legg — essays and blog posts, software & Linux guides, " +
  "language-learning resources, book reviews, projects, and more. No ads, no sponsors.";
export const OG_DEFAULT = "/og-default.png";

// Trim a string to a clean ~155-char meta description (word boundary, ellipsis).
export function excerpt(text: string | undefined, max = 155): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]\s*$/, "") + "…";
}

type ArticleMetaOpts = {
  /** Section label for the fallback title when the article is missing. */
  fallback: string;
  /** Site-absolute path of this page, e.g. `/blog/${slug}` — sets the canonical URL. */
  path: string;
  /** OG type; articles default to "article" so date/section can attach. */
  type?: "article" | "website";
};

// Builds a complete, consistent Metadata object for a content article page.
// Title stays short ("%s · Steven Legg" template lives in the root layout);
// description is derived from the article's lead paragraph; canonical + OG/Twitter
// are filled so each page is individually shareable and indexable.
export function articleMeta(a: Article | null, opts: ArticleMetaOpts): Metadata {
  const { fallback, path, type = "article" } = opts;
  const title = a ? a.title : fallback;
  const description = (a && excerpt(leadText(a.blocks))) || SITE_DESCRIPTION;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: SITE_NAME,
      images: [OG_DEFAULT],
      ...(a?.date ? { publishedTime: a.date } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_DEFAULT] },
  };
}

// Lighter helper for non-article pages (hubs, indexes) that want a description
// + canonical without per-item data.
export function pageMeta(opts: { title: string; description?: string; path: string }): Metadata {
  const { title, description = SITE_DESCRIPTION, path } = opts;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title, description, siteName: SITE_NAME, images: [OG_DEFAULT] },
    twitter: { card: "summary_large_image", title, description, images: [OG_DEFAULT] },
  };
}
