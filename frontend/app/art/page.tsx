import PageHeader from "@/components/PageHeader";

// Source: /website/public/art.html — "Art coming soon."
export const metadata = { title: "Art — Steven Legg" };

export default function Art() {
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader title="Art" />
      <p className="text-ink-soft">Art coming soon.</p>
    </main>
  );
}
