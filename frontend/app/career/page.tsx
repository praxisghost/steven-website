import SubHub from "@/components/SubHub";
import { pageMeta } from "@/lib/seo";
import { getDirCollection, type Article } from "@/lib/content";

// Source: /website/public/career.html (hub) + career-interests.html + career-learn.html.
// The two sub-sections are real static prose (migrated to content/career/*.json),
// not JS-rendered as an earlier run had assumed without source access.
export const metadata = pageMeta({ title: "Career", description: "Steven Legg's career interests and aspirations.", path: "/career" });

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
