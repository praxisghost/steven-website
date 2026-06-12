import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocaleMeta, listLocales, allLocaleMeta, localeAlternates } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return listLocales().map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = getLocaleMeta(locale);
  if (!m) return { title: "Steven Legg" };
  const title = `${m.siteTitle} (${m.name})`;
  const alternates = localeAlternates(locale);
  return {
    title,
    alternates,
    openGraph: { title, type: "website", locale: m.htmlLang, url: alternates.canonical, siteName: m.siteTitle },
  };
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = getLocaleMeta(locale);
  if (!m) notFound();
  const others = allLocaleMeta().filter((o) => o.locale !== locale);

  return (
    <main className="mx-auto max-w-wide px-6 py-16" lang={m.htmlLang}>
      <header className="text-center">
        <h1 className="text-5xl">{m.siteTitle}</h1>
        {m.tagline && <p className="mt-3 text-lg text-muted">{m.tagline} 🍃</p>}
      </header>

      <p
        className="mx-auto mt-8 max-w-content rounded-lg border border-hairline bg-accent/5 px-5 py-3 text-center text-sm text-muted"
        lang="en"
      >
        This is the <strong className="text-ink">{m.name}</strong> version of the site.{" "}
        <Link href="/" className="text-accent hover:underline">
          View in English →
        </Link>
      </p>

      <nav aria-label={m.siteTitle} className="mt-10">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {m.nav.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/${locale}/${item.slug}`}
                className="block rounded-lg border border-hairline p-5 text-lg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {others.length > 0 && (
        <div className="mt-12 text-center text-sm text-muted" lang="en">
          Other language versions:{" "}
          {others.map((o, i) => (
            <span key={o.locale}>
              {i > 0 && " · "}
              <Link href={`/${o.locale}`} className="text-accent hover:underline">
                {o.name}
              </Link>
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
