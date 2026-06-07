import fs from "node:fs";
import path from "node:path";

// Lists image assets copied from /website/public/img into frontend/public/img.
// Read at build time via fs. Filters non-image helper files (e.g. README.md).
export type GalleryImage = { src: string; alt: string };

const IMG_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;

// Turn "american-green-tree-frog.jpg" -> "American green tree frog".
function toAlt(file: string): string {
  const base = file.replace(IMG_EXT, "").replace(/[-_]+/g, " ").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function listImages(folder: string): GalleryImage[] {
  const dir = path.join(process.cwd(), "public", "img", folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMG_EXT.test(f))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => ({ src: `/img/${folder}/${f}`, alt: toAlt(f) }));
}
