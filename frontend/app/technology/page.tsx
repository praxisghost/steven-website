import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getCollection } from "@/lib/content";

// Source: /website/public/technology.html + technology/*.html — links to migrated pages.
export const metadata = { title: "Technology — Steven Legg" };

const EMOJI: Record<string, string> = {
  "ai-prompts": "💬",
  "artificial-intelligence": "🤖",
  "foldable-phones": "📱",
  linux: "🐧",
  macos: "🍎",
  "return-to-linux": "🔁",
  "smartphone-design": "📐",
  "software-tutorials": "🛠️",
  windows: "🪟",
};

export default function Technology() {
  const items = getCollection("technology");
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader
        title="Technology"
        lead="Writing on operating systems, phones, AI, and the software I actually use."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/technology/${p.slug}`}
            className="group rounded-lg border border-hairline p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-xl">{EMOJI[p.slug] ?? "💻"}</span>
              <span className="text-lg group-hover:text-accent">{p.title}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted">
              {p.blocks.find((b) => b.type === "p")?.text}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
