import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getDirArticle, getDirCollection } from "@/lib/content";

const REL = "language-learning/con-lang";

// Source: /website/public/<slug>.html (con-lang guides linked from con-lang.html)
export function generateStaticParams() {
  return getDirCollection(REL).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getDirArticle(REL, slug);
  return { title: a ? `${a.title} — Steven Legg` : "Con-Lang — Steven Legg" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getDirArticle(REL, slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/language-learning/con-lang" className="text-sm text-accent hover:underline">
        ← Con-Lang
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
    </main>
  );
}
