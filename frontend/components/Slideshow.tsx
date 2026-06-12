"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/gallery";

// Accessible image slideshow (migrated from the source photos.html slideshow).
// One image at a time with prev/next controls, a live position readout, dot
// indicators, and ArrowLeft/ArrowRight keyboard support. The fixed 4:3 frame
// prevents layout shift; alt text is preserved per image. Manual-advance only
// (no autoplay) so it never moves focus or motion without user intent (WCAG
// 2.2.2). Falls back to nothing when a gallery is empty.
export default function Slideshow({
  images,
  label,
}: {
  images: GalleryImage[];
  label: string;
}) {
  const [i, setI] = useState(0);
  const count = images.length;

  const go = useCallback(
    (delta: number) => setI((prev) => (prev + delta + count) % count),
    [count],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (count === 0) return null;
  const img = images[i];

  return (
    <div
      className="overflow-hidden rounded-xl border border-hairline"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative aspect-[4/3] w-full bg-black/5">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          priority={i === 0}
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/80 px-3 py-2 text-lg text-ink shadow hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/80 px-3 py-2 text-lg text-ink shadow hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ›
            </button>
          </>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-muted" aria-live="polite">
          {img.alt} <span className="text-ink-soft">· {i + 1} / {count}</span>
        </p>
        {count > 1 && (
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={`${label} positions`}>
            {images.map((im, idx) => (
              <button
                key={im.src}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Go to image ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  idx === i ? "bg-accent" : "bg-hairline hover:bg-ink-soft"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
