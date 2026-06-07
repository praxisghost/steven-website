import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, getGuides } from "@/lib/pronunciation";

// Source: /website/content/pronunciation-guides/generated/<slug>.md
export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  return { title: g ? `${g.title} — Steven Legg` : "Pronunciation Guides — Steven Legg" };
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
