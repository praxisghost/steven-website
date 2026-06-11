import CollectionArticle from "@/components/CollectionArticle";
import { getArticle, getCollection } from "@/lib/content";
import { articleMeta } from "@/lib/seo";

// Source: /website/public/retro-gaming/<slug>.html
export function generateStaticParams() {
  return getCollection("retro-gaming").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("retro-gaming", slug);
  return articleMeta(a, { fallback: "Retro Gaming", path: `/retro-gaming/${slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionArticle name="retro-gaming" backLabel="Retro Gaming" slug={slug} />;
}
