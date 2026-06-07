import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getSubArticle, type SubParent } from "@/lib/content";

// Renders an individual technology sub-page (e.g. /technology/linux/arch).
export default function SubArticle({
  parent,
  backHref,
  backLabel,
  slug,
}: {
  parent: SubParent;
  backHref: string;
  backLabel: string;
  slug: string;
}) {
  const a = getSubArticle(parent, slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href={backHref} className="text-sm text-accent hover:underline">
        ← {backLabel}
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
    </main>
  );
}
