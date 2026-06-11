import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getLocaleMeta, getLocalePage, listLocales, listLocalePages } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return listLocales().flatMap((locale) =>
    listLocalePages(locale).map((page) => ({ locale, page }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;
  const m = getLocaleMeta(locale);
  const p = getLocalePage(locale, page);
  if (!p || !m) return { title: "Steven Legg" };
  return { title: `${p.title} — ${m.siteTitle} (${m.name})` };
}

export default async function LocalePageView({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;
  const m = getLocaleMeta(locale);
  const p = getLocalePage(locale, page);
  if (!m || !p) notFound();

  return (
    <main className="mx-auto max-w-content px-6 py-16" lang={m.htmlLang}>
      <Link href={`/${locale}`} className="text-sm text-accent hover:underline">
        {m.back}
      </Link>
      <header className="mt-4">
        <h1 className="text-4xl leading-tight sm:text-5xl">{p.title}</h1>
        {p.sub && <p className="mt-3 text-lg text-muted">{p.sub}</p>}
      </header>
      <article className="mt-8">
        <ArticleBody blocks={p.blocks} />
      </article>
    </main>
  );
}
