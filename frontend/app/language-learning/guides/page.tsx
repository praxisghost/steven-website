import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

// Source: /website/public/language-guides.html — the master index of
// per-language study guides, grouped by the reader's native language.
// Migrated faithfully as a browsable catalogue. The interactive flashcard
// trainers each entry will eventually link to are still being ported from
// the original site (see CONTENT_INVENTORY.md, "SRS vocabulary trainers"),
// so entries render as a catalogue here with no dead links until each is wired.

export const metadata = pageMeta({
  title: "Language Guides",
  description:
    "Browse language study guides by native language — pick the language you speak to see the target languages you can study.",
  path: "/language-learning/guides",
});

type Lang = { name: string; slug: string };
type Group = { label: string; langs: Lang[] };
type Guides = { title: string; intro: string; note: string; groups: Group[] };

function getGuides(): Guides {
  const file = path.join(process.cwd(), "content", "language-learning", "guides.json");
  return JSON.parse(fs.readFileSync(file, "utf-8")) as Guides;
}

export default function LanguageGuides() {
  const { intro, note, groups } = getGuides();
  const total = groups.reduce((n, g) => n + g.langs.length, 0);

  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <Link href="/language-learning" className="text-sm text-accent hover:underline">
        ← Language Learning
      </Link>
      <header className="mt-4 max-w-content">
        <h1 className="text-4xl leading-tight sm:text-5xl">Language Guides</h1>
        <p className="mt-3 text-lg text-muted">{intro}</p>
        <p className="mt-4 rounded-lg border border-hairline bg-accent/5 px-4 py-3 text-sm text-muted">
          {note}
        </p>
      </header>

      <p className="mt-8 text-sm text-muted">
        {total} guides across {groups.length} source languages.
      </p>

      <div className="mt-6 space-y-10">
        {groups.map((g) => (
          <section key={g.label} aria-label={g.label}>
            <h2 className="text-xl font-medium">{g.label}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {g.langs.map((l) => (
                <li
                  key={`${g.label}-${l.slug}`}
                  className="rounded-full border border-hairline px-3 py-1 text-sm text-ink-soft"
                >
                  {l.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
