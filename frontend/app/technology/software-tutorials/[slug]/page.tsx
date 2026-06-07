import SubArticle from "@/components/SubArticle";
import { getSubArticle, getSubCollection } from "@/lib/content";

// Source: /website/public/technology/software-tutorials/<slug>.html
export function generateStaticParams() {
  return getSubCollection("software-tutorials").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getSubArticle("software-tutorials", slug);
  return { title: a ? `${a.title} — Steven Legg` : "Software Tutorials — Steven Legg" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <SubArticle
      parent="software-tutorials"
      backHref="/technology/software-tutorials"
      backLabel="Software Tutorials"
      slug={slug}
    />
  );
}
