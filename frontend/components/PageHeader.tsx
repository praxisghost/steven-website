import Link from "next/link";

// Reusable page intro. F-pattern: left-aligned title + scannable lead.
export default function PageHeader({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-10">
      <Link href="/" className="text-sm text-accent hover:underline">
        ← Back
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{title}</h1>
      {lead ? <p className="mt-4 max-w-content text-lg text-ink-soft">{lead}</p> : null}
    </div>
  );
}
