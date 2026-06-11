import CollectionArticle from "@/components/CollectionArticle";
import { getArticle, getCollection } from "@/lib/content";
import { articleMeta } from "@/lib/seo";

// Source: /website/public/book-reviews/<slug>.html
export function generateStaticParams() {
  return getCollection("book-reviews").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("book-reviews", slug);
  return articleMeta(a, { fallback: "Book Reviews", path: `/book-reviews/${slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionArticle name="book-reviews" backLabel="Book Reviews" slug={slug} />;
}
