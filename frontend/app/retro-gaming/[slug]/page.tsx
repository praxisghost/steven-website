import CollectionArticle from "@/components/CollectionArticle";
import { getArticle, getCollection } from "@/lib/content";

// Source: /website/public/retro-gaming/<slug>.html
export function generateStaticParams() {
  return getCollection("retro-gaming").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("retro-gaming", slug);
  return { title: a ? `${a.title} — Steven Legg` : "Retro Gaming — Steven Legg" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionArticle name="retro-gaming" backLabel="Retro Gaming" slug={slug} />;
}
