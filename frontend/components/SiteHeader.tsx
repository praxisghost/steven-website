import Link from "next/link";
import { NAV } from "@/lib/nav";

// Persistent top nav. Fitts's Law: large tap targets; Hick's Law: flat, scannable set.
export default function SiteHeader() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-wide flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4">
        <Link href="/" className="font-display text-lg tracking-tight text-ink">
          Steven Legg
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {NAV.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="rounded px-1 py-0.5 transition-colors hover:text-accent focus-visible:text-accent"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
