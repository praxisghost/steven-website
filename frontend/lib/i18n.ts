import fs from "node:fs";
import path from "node:path";
import type { Block } from "@/lib/content";

// Constructed-language mirror sites migrated from /website/public/{io,ia,isv,nov}.
// Faithfully preserved as static locale-prefixed routes (/[locale], /[locale]/[page]).
export type NavItem = { slug: string; label: string };
export type LocaleMeta = {
  locale: string;
  name: string; // English display name (e.g. "Ido")
  htmlLang: string; // <html lang> from source
  siteTitle: string;
  tagline: string;
  back: string; // localized "← back" label
  nav: NavItem[];
  source: string;
};
export type LocalePage = {
  slug: string;
  title: string;
  sub: string;
  blocks: Block[];
  source: string;
};

const ROOT = path.join(process.cwd(), "content", "i18n");

export function listLocales(): string[] {
  if (!fs.existsSync(ROOT)) return [];
  return fs
    .readdirSync(ROOT)
    .filter((d) => fs.existsSync(path.join(ROOT, d, "_meta.json")))
    .sort();
}

export function getLocaleMeta(locale: string): LocaleMeta | null {
  const file = path.join(ROOT, locale, "_meta.json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as LocaleMeta;
}

export function getLocalePage(locale: string, slug: string): LocalePage | null {
  const file = path.join(ROOT, locale, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as LocalePage;
}

export function listLocalePages(locale: string): string[] {
  const dir = path.join(ROOT, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "_meta.json")
    .map((f) => f.slice(0, -5));
}

// All English display names, for cross-locale switchers.
export function allLocaleMeta(): LocaleMeta[] {
  return listLocales()
    .map((l) => getLocaleMeta(l))
    .filter((m): m is LocaleMeta => m !== null);
}
