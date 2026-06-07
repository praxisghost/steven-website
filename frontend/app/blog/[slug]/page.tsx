import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getArticle, getCollection } from "@/lib/content";

// Source: /website/public/blog/<slug>.html
export function generateStaticParams() {
  return getCollection("blog").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("blog", slug);
  return { title: a ? `${a.title} — Steven Legg` : "Blog — Steven Legg" };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("blog", slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/blog" className="text-sm text-accent hover:underline">
        ← Blog
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      {a.date ? <p className="mt-2 text-sm text-muted">{a.date}</p> : null}
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
    </main>
  );
}
