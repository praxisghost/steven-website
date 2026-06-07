"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GuideMeta } from "@/lib/pronunciation";

// Searchable index over the pronunciation guides.
// Hick's Law: a filter box collapses a long list into a typed query.
// Gestalt (common region + proximity): results grouped under alphabetical headers.
export default function PronIndex({ items }: { items: GuideMeta[] }) {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = needle
      ? items.filter((i) => i.l2_name.toLowerCase().includes(needle))
      : items;
    const map = new Map<string, GuideMeta[]>();
    for (const i of filtered) {
      const letter = (i.l2_name[0] || "#").toUpperCase();
      (map.get(letter) ?? map.set(letter, []).get(letter)!).push(i);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [q, items]);

  const total = groups.reduce((n, [, g]) => n + g.length, 0);

  return (
    <div>
      <label className="block">
        <span className="sr-only">Filter pronunciation guides</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Filter ${items.length} languages…`}
          className="w-full rounded-lg border border-hairline bg-transparent px-4 py-3 text-base outline-none focus:border-accent"
          autoComplete="off"
        />
      </label>
      <p className="mt-2 text-sm text-muted">
        {total} {total === 1 ? "guide" : "guides"}
      </p>

      {groups.map(([letter, gs]) => (
        <section key={letter} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{letter}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {gs.map((g) => (
              <Link
                key={g.slug}
                href={`/language-learning/pronunciation/${g.slug}`}
                className="group rounded-lg border border-hairline p-4 transition-colors hover:border-accent"
              >
                <span className="text-base group-hover:text-accent">{g.l2_name}</span>
                <p className="mt-1 text-xs text-muted">for {g.l1_name} speakers</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {total === 0 ? (
        <p className="mt-8 text-muted">No languages match “{q}”.</p>
      ) : null}
    </div>
  );
}
