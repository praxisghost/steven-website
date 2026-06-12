import PageHeader from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";
import HubGrid from "@/components/HubGrid";

// Source: /website/public/language-learning.html — sections preserved.
export const metadata = pageMeta({ title: "Language Learning", description: "Language-learning methods, tools, pronunciation guides and study resources from Steven Legg.", path: "/language-learning" });

export default function LanguageLearning() {
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader
        title="Language Learning"
        lead="Curated resources, method guides, & study materials for languages I am actively learning."
      />
      <HubGrid
        items={[
          {
            label: "Language Guides",
            emoji: "🗺️",
            href: "/language-learning/guides",
            note: "Browse study guides by your native language across 50+ target languages.",
          },
          {
            label: "Methods & Tools",
            emoji: "🛠️",
            href: "/language-learning/methods",
            note: "Anki, comprehensible input, shadowing, TPRS & more.",
          },
          {
            label: "Pronunciation Guides",
            emoji: "📘",
            href: "/language-learning/pronunciation",
            note: "Writing systems, IPA & common mistakes across dozens of languages.",
          },
          {
            label: "Con-Lang",
            emoji: "🌐",
            href: "/language-learning/con-lang",
            note: "Esperanto, Novial, Ido, Interslavic, Klingon & Interlingua.",
          },
          {
            label: "Famous Linguists",
            emoji: "📚",
            href: "/language-learning/famous-linguists",
            note: "Plain-English profiles of Krashen, VanPatten, Swain, Long & Ellis.",
          },
        ]}
      />
    </main>
  );
}
