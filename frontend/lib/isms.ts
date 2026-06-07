import fs from "node:fs";
import path from "node:path";

// Loads the -isms manifest (content/isms.json) migrated from /website/public/isms/*.html.
// Source pages are placeholders ("content coming soon"); we preserve every title + slug.
export type Ism = { slug: string; title: string; status: "placeholder" | "stub" };
type Manifest = { source: string; count: number; items: Ism[] };

const FILE = path.join(process.cwd(), "content", "isms.json");

export function getIsms(): Ism[] {
  const data = JSON.parse(fs.readFileSync(FILE, "utf-8")) as Manifest;
  return [...data.items].sort((a, b) => a.title.localeCompare(b.title));
}

export function getIsm(slug: string): Ism | null {
  return getIsms().find((i) => i.slug === slug) ?? null;
}
