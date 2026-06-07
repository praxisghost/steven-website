import type { GalleryImage } from "@/lib/gallery";

// Responsive image grid. Gestalt proximity (even gutters group the set),
// uniform 4:3 frames for a calm visual rhythm, lazy-loaded for performance.
// Plain <img> (not next/image) keeps the static export simple and build-safe.
export default function Gallery({
  images,
  cols = 3,
}: {
  images: GalleryImage[];
  cols?: 2 | 3 | 4;
}) {
  if (images.length === 0) return null;
  const colClass =
    cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`grid grid-cols-1 gap-4 ${colClass}`}>
      {images.map((img) => (
        <li key={img.src} className="overflow-hidden rounded-lg border border-hairline">
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className="aspect-[4/3] w-full bg-black/5 object-cover"
          />
          <p className="px-3 py-2 text-sm text-muted">{img.alt}</p>
        </li>
      ))}
    </ul>
  );
}
