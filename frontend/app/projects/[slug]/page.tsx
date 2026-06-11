import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getArticle, getCollection } from "@/lib/content";
import { articleMeta } from "@/lib/seo";

// Source: /website/public/projects/<slug>.html
export function generateStaticParams() {
  return getCollection("projects").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("projects", slug);
  return articleMeta(a, { fallback: "Projects", path: `/projects/${slug}` });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("projects", slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/projects" className="text-sm text-accent hover:underline">
        ← Projects
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
    </main>
  );
}
