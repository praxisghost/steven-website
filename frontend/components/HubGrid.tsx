// Card grid for hub/index pages. Gestalt proximity grouping of related sections.
// Items render as non-link cards until their sub-pages are migrated in later phases
// (avoids dead links / 404s). When a `href` is provided the card becomes a link.
export type HubItem = { label: string; emoji?: string; href?: string; note?: string };

function Card({ item }: { item: HubItem }) {
  const inner = (
    <>
      <div className="flex items-center gap-3">
        {item.emoji ? <span aria-hidden className="text-xl">{item.emoji}</span> : null}
        <span className="text-lg">{item.label}</span>
      </div>
      {item.note ? <p className="mt-2 text-sm text-muted">{item.note}</p> : null}
    </>
  );
  const base = "rounded-lg border border-hairline p-5";
  return item.href ? (
    <a href={item.href} className={`${base} block transition-colors hover:border-accent`}>
      {inner}
    </a>
  ) : (
    <div className={base}>{inner}</div>
  );
}

export default function HubGrid({ items }: { items: HubItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((i) => (
        <Card key={i.label} item={i} />
      ))}
    </div>
  );
}
