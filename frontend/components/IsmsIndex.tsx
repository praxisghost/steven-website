"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Ism } from "@/lib/isms";

// Client filter over the full -isms set.
// Hick's Law: a search box collapses a 306-item decision into a typed query.
// Gestalt (common region + proximity): results grouped under alphabetical headers.
export default function IsmsIndex({ items }: { items: Ism[] }) {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = needle
      ? items.filter((i) => i.title.toLowerCase().includes(needle))
      : items;
    const map = new Map<string, Ism[]>();
    for (const i of filtered) {
      const letter = (i.title[0] || "#").toUpperCase();
      (map.get(letter) ?? map.set(letter, []).get(letter)!).push(i);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [q, items]);

  const total = groups.reduce((n, [, g]) => n + g.length, 0);

  return (
    <div>
      <label className="block">
        <span className="sr-only">Filter -isms</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Filter ${items.length} -isms…`}
          className="w-full rounded-lg border border-hairline bg-transparent px-4 py-3 text-base outline-none focus:border-accent"
          autoComplete="off"
        />
      </label>
      <p className="mt-2 text-sm text-muted" aria-live="polite">
        {total} of {items.length}
      </p>

      {groups.length === 0 ? (
        <p className="mt-10 text-muted">No -isms match “{q}”.</p>
      ) : (
        groups.map(([letter, g]) => (
          <section key={letter} className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
              {letter}
            </h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {g.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/isms/${i.slug}`}
                    className="block rounded py-1.5 text-ink-soft hover:text-accent"
                  >
                    {i.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
