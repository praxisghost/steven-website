import type { Metadata } from "next";
import Link from "next/link";
import { NAV } from "@/lib/nav";
import { SITE_DESCRIPTION, OG_DEFAULT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  // Absolute title so the homepage isn't suffixed by the layout template.
  title: { absolute: "Steven Legg — Writing, projects & language learning" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: "Steven Legg — Writing, projects & language learning",
    description: SITE_DESCRIPTION,
    images: [OG_DEFAULT],
  },
};

// Home. Source: /website/public/index.html ("Just following my rainbow").
// Redesign: editorial hero + Gestalt card grid (proximity grouping) instead of
// the source's emoji link list — visibly distinct, content preserved.
export default function Home() {
  return (
    <main className="mx-auto max-w-wide px-6 py-16 sm:py-24">
      <section className="max-w-content">
        <p className="text-sm uppercase tracking-widest text-accent">Personal site</p>
        <h1 className="mt-3 text-5xl leading-tight sm:text-6xl">Steven Legg</h1>
        <p className="mt-6 text-lg text-ink-soft">
          Writer, teacher, builder, and language tinkerer. A portfolio, blog, and
          learning-resource hub — a place to document what I&apos;m working on and
          share things I&apos;ve found useful. Just following my rainbow. 🍃
        </p>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NAV.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="group rounded-lg border border-hairline p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-2xl">{i.emoji}</span>
              <h2 className="text-xl group-hover:text-accent">{i.label}</h2>
            </div>
            <p className="mt-2 text-sm text-muted">{i.blurb}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
