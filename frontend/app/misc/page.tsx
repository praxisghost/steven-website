import PageHeader from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";
import Gallery from "@/components/Gallery";
import { listImages } from "@/lib/gallery";

// Source: /website/public/misc.html — Frogs gallery + Personal Finance Templates.
// Frog images migrated to frontend/public/img/frogs; spreadsheets to
// frontend/public/downloads/{spending-log,monthly-budget}.xlsx (Phase 3 step 3).
export const metadata = pageMeta({ title: "Misc", description: "Odds and ends — the things that don't fit anywhere else.", path: "/misc" });

export default function Misc() {
  const frogs = listImages("frogs");
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader title="Misc" lead="Odds & ends that don't fit anywhere else. More coming." />

      <section className="mb-12">
        <h2 className="mb-2 text-2xl">Frogs of North America 🐸</h2>
        <p className="mb-5 text-ink-soft">A rotating gallery of native species. Purely for joy.</p>
        <Gallery images={frogs} cols={3} />
      </section>

      <section>
        <h2 className="mb-2 text-2xl">Personal Finance Templates</h2>
        <p className="mb-4 text-ink-soft">
          Two free open spreadsheets to help you start tracking your money. No sign-up,
          no strings — just download and use.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a href="/downloads/spending-log.xlsx" className="rounded-lg border border-hairline p-5 transition-colors hover:border-accent">
            <span className="text-lg">Spending Log</span>
            <p className="mt-2 text-sm text-muted">
              Log every purchase by date, category, and payment method. A good place to
              start if you&apos;ve never tracked spending before. Free .xlsx
            </p>
          </a>
          <a href="/downloads/monthly-budget.xlsx" className="rounded-lg border border-hairline p-5 transition-colors hover:border-accent">
            <span className="text-lg">Monthly Budget</span>
            <p className="mt-2 text-sm text-muted">
              Plan your monthly income and expenses across all categories. Tracks
              planned vs. actual and shows your net position. Free .xlsx
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}
