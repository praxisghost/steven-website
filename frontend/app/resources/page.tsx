import PageHeader from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";
import HubGrid, { HubItem } from "@/components/HubGrid";

// Source: /website/public/resources.html — grouped guide lists preserved.
// Dead-card sweep (run 20): wired every card to its already-migrated destination
// (software-tutorials, language-learning/methods, language-learning). Guitar guide
// migrated (run 21): source /website/public/guitar.html + guitar-scale.js →
// /resources/guitar (interactive scale player). Card now links.
export const metadata = pageMeta({ title: "Resources", description: "Guides and reference material — software tutorials, language methods and learning resources.", path: "/resources" });

const software: HubItem[] = [
  { label: "Audacity", href: "/technology/software-tutorials/audacity" },
  { label: "Darktable", href: "/technology/software-tutorials/darktable" },
  { label: "GIMP", href: "/technology/software-tutorials/gimp" },
  { label: "KDenLive", href: "/technology/software-tutorials/kdenlive" },
  { label: "Notion", href: "/technology/software-tutorials/notion" },
  { label: "Obsidian", href: "/technology/software-tutorials/obsidian" },
];

const methods: HubItem[] = [
  { label: "Anki Cloze Cards", href: "/language-learning/methods/anki-cloze-cards" },
  { label: "Anki Guide / SRS Guide", href: "/language-learning/methods/anki-guide" },
  { label: "Comprehensible Input", href: "/language-learning/methods/comprehensible-input" },
  { label: "Extensive Reading", href: "/language-learning/methods/extensive-reading" },
  { label: "Gold List Method", href: "/language-learning/methods/gold-list" },
  { label: "HyperTTS — Batch Audio for Anki", href: "/language-learning/methods/hypertts" },
  { label: "Shadowing", href: "/language-learning/methods/shadowing" },
  { label: "Task-Based Output & Interaction", href: "/language-learning/methods/task-based-output" },
  { label: "TPRS — Teaching Proficiency through Reading & Storytelling", href: "/language-learning/methods/tprs" },
];

const language: HubItem[] = [
  { label: "Language Guides — Browse", href: "/language-learning", note: "Pronunciation, methods, con-langs & more." },
];

const guitar: HubItem[] = [
  { label: "Guitar Learning Guide", href: "/resources/guitar", note: "Scale roadmap + an interactive E Major Pentatonic player." },
];

export default function Resources() {
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader
        title="Resources"
        lead="A curated hub for the guides & reference material across this site — software tutorials, language-learning methods, language guides, and guitar."
      />
      <div className="space-y-12">
        <Group title="Software Guides" items={software} />
        <Group title="Methods & Tools" items={methods} />
        <Group title="Language Guides" items={language} />
        <Group title="Guitar" items={guitar} />
      </div>
    </main>
  );
}

function Group({ title, items }: { title: string; items: HubItem[] }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl">{title}</h2>
      <HubGrid items={items} />
    </section>
  );
}
