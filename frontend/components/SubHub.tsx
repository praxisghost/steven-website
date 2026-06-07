import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import type { Article } from "@/lib/content";

// Hub for a technology sub-section: section intro + card grid of child pages.
// Gestalt proximity (uniform grid), Fitts's Law (large card targets).
export default function SubHub({
  hub,
  base,
  items,
}: {
  hub: Article;
  base: string;
  items: Article[];
}) {
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader title={hub.title} lead={hub.blocks.find((b) => b.type === "p")?.text} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`${base}/${p.slug}`}
            className="group rounded-lg border border-hairline p-5 transition-colors hover:border-accent"
          >
            <span className="text-lg group-hover:text-accent">{p.title}</span>
            <p className="mt-2 line-clamp-2 text-sm text-muted">
              {p.blocks.find((b) => b.type === "p")?.text}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
