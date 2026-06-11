import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getCollection, getSubCollection, getDirCollection, type Collection } from "@/lib/content";
import { getGuides } from "@/lib/pronunciation";
import { listLocales, listLocalePages } from "@/lib/i18n";

// Generated at build time from the same fs loaders the pages use, so the sitemap
// always matches the rendered routes. Thin -isms placeholders are intentionally
// excluded (they carry robots: noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;
  const out: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") =>
    out.push({ url: url(path), lastModified: now, changeFrequency, priority });

  // Home + primary hubs
  add("/", 1.0, "weekly");
  const hubs = [
    "/about", "/writing", "/projects", "/language-learning", "/book-reviews",
    "/resources", "/career", "/sports", "/art", "/media", "/misc", "/contact",
    "/blog", "/technology", "/technology/linux", "/technology/software-tutorials",
    "/retro-gaming", "/self-improvement", "/isms", "/resources/guitar",
    "/language-learning/methods", "/language-learning/con-lang",
    "/language-learning/pronunciation", "/language-learning/famous-linguists",
  ];
  for (const h of hubs) add(h, 0.8, "weekly");

  // Article collections
  const collections: [Collection, string][] = [
    ["blog", "/blog"], ["projects", "/projects"], ["technology", "/technology"],
    ["book-reviews", "/book-reviews"], ["self-improvement", "/self-improvement"],
    ["retro-gaming", "/retro-gaming"], ["writing", "/writing"],
  ];
  for (const [name, base] of collections)
    for (const a of getCollection(name)) add(`${base}/${a.slug}`, 0.6);

  // Technology sub-collections
  for (const a of getSubCollection("linux")) add(`/technology/linux/${a.slug}`, 0.6);
  for (const a of getSubCollection("software-tutorials")) add(`/technology/software-tutorials/${a.slug}`, 0.6);

  // Dir collections
  const dirs: [string, string][] = [
    ["language-learning/methods", "/language-learning/methods"],
    ["language-learning/con-lang", "/language-learning/con-lang"],
    ["language-learning/famous-linguists", "/language-learning/famous-linguists"],
    ["career", "/career"],
  ];
  for (const [rel, base] of dirs)
    for (const a of getDirCollection(rel)) add(`${base}/${a.slug}`, 0.6);

  // Pronunciation guides
  for (const g of getGuides()) add(`/language-learning/pronunciation/${g.slug}`, 0.5);

  // i18n locale mirrors (lower priority)
  for (const loc of listLocales()) {
    add(`/${loc}`, 0.3);
    for (const slug of listLocalePages(loc)) add(`/${loc}/${slug}`, 0.2);
  }

  return out;
}
