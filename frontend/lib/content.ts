import fs from "node:fs";
import path from "node:path";

// Loads article content extracted from /website source into JSON
// (frontend/content/{blog,projects}/*.json). Read at build time via fs.
export type Block = { type: "h2" | "h3" | "p" | "li" | "quote"; text: string };
// Curated cross-reference into another section (e.g. Writing→Blog topical hubs).
export type CuratedLink = { title: string; href: string; date?: string };
export type Article = {
  slug: string;
  title: string;
  date?: string;
  source: string;
  blocks: Block[];
  links?: CuratedLink[];
};

const ROOT = path.join(process.cwd(), "content");
const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];

function dateKey(d?: string): number {
  if (!d) return 0;
  const m = d.match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
  if (!m) return 0;
  const mo = MONTHS.indexOf(m[1].toLowerCase());
  return Number(m[3]) * 10000 + (mo + 1) * 100 + Number(m[2]);
}

export type Collection =
  | "blog"
  | "projects"
  | "technology"
  | "book-reviews"
  | "self-improvement"
  | "retro-gaming"
  | "writing";

export function getCollection(name: Collection): Article[] {
  const dir = path.join(ROOT, name);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const items = files.map(
    (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Article
  );
  // Blog: newest first by date. Projects/technology: alphabetical by title.
  if (name === "blog") return items.sort((a, b) => dateKey(b.date) - dateKey(a.date));
  return items.sort((a, b) => a.title.localeCompare(b.title));
}

export function getArticle(name: Collection, slug: string): Article | null {
  const file = path.join(ROOT, name, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as Article;
}

// Technology sub-sections (technology/<parent>/*.json), e.g. linux, software-tutorials.
export type SubParent = "linux" | "software-tutorials";

export function getSubCollection(parent: SubParent): Article[] {
  const dir = path.join(ROOT, "technology", parent);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Article)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getSubArticle(parent: SubParent, slug: string): Article | null {
  const file = path.join(ROOT, "technology", parent, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as Article;
}
