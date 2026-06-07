import CollectionArticle from "@/components/CollectionArticle";
import { getArticle, getCollection } from "@/lib/content";

// Source: /website/public/book-reviews/<slug>.html
export function generateStaticParams() {
  return getCollection("book-reviews").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("book-reviews", slug);
  return { title: a ? `${a.title} — Steven Legg` : "Book Reviews — Steven Legg" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionArticle name="book-reviews" backLabel="Book Reviews" slug={slug} />;
}
