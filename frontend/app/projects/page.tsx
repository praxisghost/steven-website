import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getCollection } from "@/lib/content";

// Source: /website/public/projects.html + projects/*.html — links to migrated pages.
export const metadata = { title: "Projects — Steven Legg" };

const EMOJI: Record<string, string> = {
  aquaponics: "🐟",
  circuits: "⚡",
  ai: "🤖",
  "visual-literary-arts": "🎭",
  "501c-coop": "🤝",
};

export default function Projects() {
  const projects = getCollection("projects");
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader
        title="Projects"
        lead="Things I'm building, growing, tinkering with, or dreaming about."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group rounded-lg border border-hairline p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-xl">{EMOJI[p.slug] ?? "🔧"}</span>
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
