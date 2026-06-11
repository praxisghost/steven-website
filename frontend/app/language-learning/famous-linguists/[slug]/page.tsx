import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getDirArticle, getDirCollection } from "@/lib/content";
import { articleMeta } from "@/lib/seo";

const REL = "language-learning/famous-linguists";

// Source: /website/public/famous-linguists/<slug>.html
export function generateStaticParams() {
  return getDirCollection(REL).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getDirArticle(REL, slug);
  return articleMeta(a, { fallback: "Famous Linguists", path: `/language-learning/famous-linguists/${slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getDirArticle(REL, slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/language-learning/famous-linguists" className="text-sm text-accent hover:underline">
        ← Famous Linguists
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
    </main>
  );
}
