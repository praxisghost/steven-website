import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getArticle, getCollection } from "@/lib/content";

// Source: /website/public/{animals,questions,rhythm-and-meter,tributes,
// shavian-english,criticisms,political-opinion}.html — the Writing sub-sections.
// Some (criticisms, politics) are curated hubs that link into the Blog.
export function generateStaticParams() {
  return getCollection("writing").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("writing", slug);
  return { title: a ? `${a.title} — Steven Legg` : "Writing — Steven Legg" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle("writing", slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/writing" className="text-sm text-accent hover:underline">
        ← Writing
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{a.title}</h1>
      <article className="mt-8">
        <ArticleBody blocks={a.blocks} />
      </article>
      {a.links?.length ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {a.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group rounded-lg border border-hairline p-5 transition-colors hover:border-accent"
            >
              <span className="text-lg group-hover:text-accent">{l.title}</span>
              {l.date ? <p className="mt-1 text-sm text-muted">{l.date}</p> : null}
            </Link>
          ))}
        </div>
      ) : null}
    </main>
  );
}
