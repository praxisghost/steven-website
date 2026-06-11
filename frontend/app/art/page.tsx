import PageHeader from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";

// Source: /website/public/art.html — "Art coming soon."
export const metadata = pageMeta({ title: "Art", description: "Visual work and art by Steven Legg.", path: "/art" });

export default function Art() {
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader title="Art" />
      <p className="text-ink-soft">Art coming soon.</p>
    </main>
  );
}
