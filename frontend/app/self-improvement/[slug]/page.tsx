import CollectionArticle from "@/components/CollectionArticle";
import { getArticle, getCollection } from "@/lib/content";

// Source: /website/public/self-improvement/<slug>.html
export function generateStaticParams() {
  return getCollection("self-improvement").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("self-improvement", slug);
  return { title: a ? `${a.title} — Steven Legg` : "Self Improvement — Steven Legg" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionArticle name="self-improvement" backLabel="Self Improvement" slug={slug} />;
}
