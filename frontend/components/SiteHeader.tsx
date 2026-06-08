import Link from "next/link";
import NavLinks from "@/components/NavLinks";

// Persistent top nav. Fitts's Law: large tap targets; Hick's Law: flat, scannable set.
// Wayfinding (active state) lives in the NavLinks client component.
export default function SiteHeader() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-wide flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4">
        <Link
          href="/"
          className="rounded font-display text-lg tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Steven Legg
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
