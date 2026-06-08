import SubHub from "@/components/SubHub";
import { getDirCollection, type Article } from "@/lib/content";

// Source: /website/public/career.html (hub) + career-interests.html + career-learn.html.
// The two sub-sections are real static prose (migrated to content/career/*.json),
// not JS-rendered as an earlier run had assumed without source access.
export const metadata = { title: "Career — Steven Legg" };

const HUB: Article = {
  slug: "career",
  title: "Career",
  source: "/website/public/career.html",
  blocks: [
    {
      type: "p",
      text: "Interests, aspirations, & things I want to learn more about.",
    },
  ],
};

export default function Career() {
  return <SubHub hub={HUB} base="/career" items={getDirCollection("career")} />;
}
