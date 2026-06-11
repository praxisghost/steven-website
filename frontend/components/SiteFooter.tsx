import Link from "next/link";
import { LINKTREE } from "@/lib/nav";
import { allLocaleMeta } from "@/lib/i18n";

export default function SiteFooter() {
  const locales = allLocaleMeta();
  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="mx-auto max-w-wide px-6 py-10 text-sm text-muted">
        <p>
          No ads. No sponsors. Ever. Every opinion here is my own.{" "}
          <a href={LINKTREE} className="text-accent underline underline-offset-2">
            linktr.ee/stevenlegg
          </a>
        </p>
        {locales.length > 0 && (
          <p className="mt-2">
            Languages:{" "}
            {locales.map((l, i) => (
              <span key={l.locale}>
                {i > 0 && " · "}
                <Link href={`/${l.locale}`} className="text-accent underline underline-offset-2" lang={l.htmlLang}>
                  {l.name}
                </Link>
              </span>
            ))}
          </p>
        )}
        <p className="mt-2">© {new Date().getFullYear()} Steven Legg.</p>
      </div>
    </footer>
  );
}
