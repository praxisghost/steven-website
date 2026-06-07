import fs from "node:fs";
import path from "node:path";

// Pronunciation guides migrated from /website/content/pronunciation-guides/generated/*.md
// (markdown -> HTML at migration time, tables preserved). Read at build time via fs.
export type GuideMeta = { slug: string; title: string; l1_name: string; l2_name: string };
export type Guide = GuideMeta & {
  l1: string;
  l2: string;
  source: string;
  html: string;
};

const DIR = path.join(process.cwd(), "content", "pronunciation");

export function getGuides(): GuideMeta[] {
  const idx = JSON.parse(
    fs.readFileSync(path.join(DIR, "index.json"), "utf-8")
  ) as { items: GuideMeta[] };
  return [...idx.items].sort((a, b) => a.l2_name.localeCompare(b.l2_name));
}

export function getGuide(slug: string): Guide | null {
  const file = path.join(DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as Guide;
}
