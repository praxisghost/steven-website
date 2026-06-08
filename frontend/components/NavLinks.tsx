"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav";

// Client nav: wayfinding (aria-current + active style) + responsive disclosure.
// Desktop (lg+): the flat, scannable 12-item set inline. Narrow / foldable
// (<lg, incl. ~280px Fold cover & ~344px outer formats): a single hamburger
// toggle reveals a stacked list — Hick's Law (one resting choice instead of a
// 12-item block that wraps 3–4 rows deep on tiny screens) and Fitts's Law
// (full-width tap rows, py-2). Isolated client boundary keeps SiteHeader server-only.
export default function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Auto-close after navigating (route change).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the open menu (keyboard accessibility).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const ring =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

  return (
    <>
      {/* Disclosure toggle — narrow widths only; hidden once the inline nav fits. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="primary-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className={`ml-auto inline-flex items-center gap-2 rounded px-2 py-1 text-sm text-muted hover:text-accent lg:hidden ${ring}`}
      >
        <span aria-hidden="true" className="text-base leading-none">
          {open ? "✕" : "☰"}
        </span>
        Menu
      </button>

      <nav
        id="primary-nav"
        aria-label="Primary"
        className={[
          "basis-full gap-x-4 gap-y-1 text-sm",
          // Mobile: stacked rows, toggled open/closed.
          open ? "flex flex-col" : "hidden",
          // Desktop: always inline, right-aligned, wrapping as before.
          "lg:ml-auto lg:flex lg:basis-auto lg:flex-row lg:flex-wrap",
        ].join(" ")}
      >
        {NAV.map((i) => {
          const active = isActive(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={active ? "page" : undefined}
              className={[
                "rounded px-1 py-2 transition-colors lg:py-0.5",
                ring,
                active
                  ? "font-medium text-accent"
                  : "text-muted hover:text-accent",
              ].join(" ")}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
