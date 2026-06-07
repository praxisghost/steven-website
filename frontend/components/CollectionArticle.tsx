import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getArticle, type Collection } from "@/lib/content";

// Reusable article page for a single-level collection. Visual hierarchy: H1 > body.
export default function CollectionArticle({
  name,
  backLabel,
  slug,
}: {
  name: Collection;
  backLabel: string;
  slug: string;
}) {
  const a = getArticle(name, slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href={`/${name}`} className="text-sm text-accent hover:underline">
        ← {backLabel}
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      {a.date ? <p className="mt-2 text-sm text-muted">{a.date}</p> : null}
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
    </main>
  );
}
