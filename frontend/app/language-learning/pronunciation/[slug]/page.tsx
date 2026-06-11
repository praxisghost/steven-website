import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getGuide, getGuides } from "@/lib/pronunciation";

// Source: /website/content/pronunciation-guides/generated/<slug>.md
export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  return g
    ? pageMeta({ title: g.title, description: `Pronunciation guide — how to pronounce ${g.l2_name} for ${g.l1_name} speakers, with IPA and examples.`, path: `/language-learning/pronunciation/${slug}` })
    : { title: "Pronunciation Guides" };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/language-learning/pronunciation" className="text-sm text-accent hover:underline">
        ← Pronunciation Guides
      </Link>
      {/* Content is migrated from trusted first-party markdown (tables preserved). */}
      <article
        className="guide mt-8"
        dangerouslySetInnerHTML={{ __html: g.html }}
      />
    </main>
  );
}
