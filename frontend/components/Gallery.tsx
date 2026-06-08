import Image from "next/image";
import type { GalleryImage } from "@/lib/gallery";

// Responsive image grid. Gestalt proximity (even gutters group the set),
// uniform 4:3 frames for a calm visual rhythm. next/image lazy-loads and
// serves AVIF/WebP at responsive widths, holding the layout via the 4:3
// box so there is no cumulative layout shift (perf budget, §8/§10).
export default function Gallery({
  images,
  cols = 3,
}: {
  images: GalleryImage[];
  cols?: 2 | 3 | 4;
}) {
  if (images.length === 0) return null;
  const colClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-3 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  // Tell the optimizer the rendered width per breakpoint so it ships the
  // smallest sufficient image instead of the full-resolution source.
  const sizes =
    cols === 2
      ? "(min-width: 640px) 50vw, 100vw"
      : cols === 4
        ? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
  return (
    <ul className={`grid grid-cols-1 gap-4 ${colClass}`}>
      {images.map((img) => (
        <li
          key={img.src}
          className="overflow-hidden rounded-lg border border-hairline"
        >
          <div className="relative aspect-[4/3] w-full bg-black/5">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={sizes}
              quality={85}
              className="object-cover"
            />
          </div>
          <p className="px-3 py-2 text-sm text-muted">{img.alt}</p>
        </li>
      ))}
    </ul>
  );
}
