import CollectionArticle from "@/components/CollectionArticle";
import { getArticle, getCollection } from "@/lib/content";
import { articleMeta } from "@/lib/seo";

// Source: /website/public/self-improvement/<slug>.html
export function generateStaticParams() {
  return getCollection("self-improvement").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("self-improvement", slug);
  return articleMeta(a, { fallback: "Self Improvement", path: `/self-improvement/${slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionArticle name="self-improvement" backLabel="Self Improvement" slug={slug} />;
}
