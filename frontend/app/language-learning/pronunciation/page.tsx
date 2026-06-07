import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import PronIndex from "@/components/PronIndex";
import { getGuides } from "@/lib/pronunciation";

// Source: /website/content/pronunciation-guides/generated/*.md
export const metadata = { title: "Pronunciation Guides — Steven Legg" };

export default function PronunciationGuides() {
  const items = getGuides();
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <Link href="/language-learning" className="text-sm text-accent hover:underline">
        ← Language Learning
      </Link>
      <PageHeader
        title="Pronunciation Guides"
        lead="How pronunciation works across dozens of languages — writing systems, IPA, approximations, difficult sounds, and common mistakes, written for second-language learners."
      />
      <PronIndex items={items} />
    </main>
  );
}
