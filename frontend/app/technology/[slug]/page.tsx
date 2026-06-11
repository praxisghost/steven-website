import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getArticle, getCollection } from "@/lib/content";
import { articleMeta } from "@/lib/seo";

// Source: /website/public/technology/<slug>.html
// linux & software-tutorials have dedicated hub routes (static segments) — exclude
// them here so they don't conflict with this dynamic route at build time.
const HUBS = new Set(["linux", "software-tutorials"]);

export function generateStaticParams() {
  return getCollection("technology")
    .filter((p) => !HUBS.has(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("technology", slug);
  return articleMeta(a, { fallback: "Technology", path: `/technology/${slug}` });
}

export default async function TechPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("technology", slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/technology" className="text-sm text-accent hover:underline">
        ← Technology
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      {a.date ? <p className="mt-2 text-sm text-muted">{a.date}</p> : null}
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
    </main>
  );
}
