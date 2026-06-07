import PageHeader from "@/components/PageHeader";
import HubGrid from "@/components/HubGrid";

// Source: /website/public/resources.html — grouped guide lists preserved.
export const metadata = { title: "Resources — Steven Legg" };

export default function Resources() {
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader
        title="Resources"
        lead="A curated hub for the guides & reference material across this site — software tutorials, language-learning methods, language guides, and guitar."
      />
      <div className="space-y-12">
        <Group title="Software Guides" items={["Audacity", "Darktable", "GIMP", "KDenLive", "Notion", "Obsidian"]} />
        <Group
          title="Methods & Tools"
          items={[
            "Anki Cloze Cards",
            "Anki Guide / SRS Guide",
            "Comprehensible Input",
            "Extensive Reading",
            "Gold List Method",
            "HyperTTS — Batch Audio for Anki",
            "Shadowing",
            "Task-Based Output & Interaction",
            "TPRS — Teaching Proficiency through Reading & Storytelling",
          ]}
        />
        <Group title="Language Guides" items={["Language Guides — Browse"]} />
        <Group title="Guitar" items={["Guitar Learning Guide"]} />
      </div>
    </main>
  );
}

function Group({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl">{title}</h2>
      <HubGrid items={items.map((label) => ({ label }))} />
    </section>
  );
}
