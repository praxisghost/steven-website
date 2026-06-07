import PageHeader from "@/components/PageHeader";

// Source: /website/public/career.html — intro + two sections (lists were JS-rendered
// in source; preserved as headings with a placeholder until data is migrated).
export const metadata = { title: "Career — Steven Legg" };

export default function Career() {
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader
        title="Career"
        lead="Interests, aspirations, & things I want to learn more about."
      />
      <div className="space-y-10 text-ink-soft leading-relaxed">
        <section>
          <h2 className="mb-2 text-2xl">🎯 Interests</h2>
          <p className="text-muted">More detail coming as this section is migrated.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl">📖 Things I Want to Learn More About</h2>
          <p className="text-muted">More detail coming as this section is migrated.</p>
        </section>
      </div>
    </main>
  );
}
