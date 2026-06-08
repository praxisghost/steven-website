import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getDirArticle, getDirCollection } from "@/lib/content";

const REL = "language-learning/methods";

// Source: /website/public/<slug>.html (method guides linked from language-methods.html)
export function generateStaticParams() {
  return getDirCollection(REL).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getDirArticle(REL, slug);
  return { title: a ? `${a.title} — Steven Legg` : "Methods & Tools — Steven Legg" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getDirArticle(REL, slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/language-learning/methods" className="text-sm text-accent hover:underline">
        ← Methods & Tools
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
    </main>
  );
}
