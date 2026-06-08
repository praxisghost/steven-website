import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getCollection, leadText, type Collection } from "@/lib/content";

// Reusable hub: lists every article in a collection as a card linking to its page.
// Gestalt proximity (uniform card grid), Fitts's Law (large targets), F-pattern leads.
export default function CollectionIndex({
  name,
  title,
  lead,
  emoji = "📄",
}: {
  name: Collection;
  title: string;
  lead: string;
  emoji?: string;
}) {
  const items = getCollection(name);
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader title={title} lead={lead} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/${name}/${p.slug}`}
            className="group rounded-lg border border-hairline p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-xl">{emoji}</span>
              <span className="text-lg group-hover:text-accent">{p.title}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted">
              {leadText(p.blocks)}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
