import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getIsm, getIsms } from "@/lib/isms";

export function generateStaticParams() {
  return getIsms().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ism = getIsm(slug);
  return {
    title: ism ? ism.title : "-isms",
    description: ism ? `${ism.title}: an entry in the -isms glossary — definition in progress.` : undefined,
    alternates: { canonical: `/isms/${slug}` },
    robots: { index: false, follow: true },
  };
}

// Source: /website/public/isms/<slug>.html — placeholder pages preserved faithfully.
export default async function IsmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ism = getIsm(slug);
  if (!ism) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader title={ism.title} />
      <p className="italic text-muted">
        This page is a placeholder — content coming soon.
      </p>
      <p className="mt-8">
        <Link href="/isms" className="text-accent hover:underline">← All -isms</Link>
      </p>
    </main>
  );
}
