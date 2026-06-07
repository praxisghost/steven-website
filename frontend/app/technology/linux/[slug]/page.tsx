import SubArticle from "@/components/SubArticle";
import { getSubArticle, getSubCollection } from "@/lib/content";

// Source: /website/public/technology/linux/<slug>.html
export function generateStaticParams() {
  return getSubCollection("linux").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getSubArticle("linux", slug);
  return { title: a ? `${a.title} — Steven Legg` : "Linux — Steven Legg" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SubArticle parent="linux" backHref="/technology/linux" backLabel="Linux" slug={slug} />;
}
