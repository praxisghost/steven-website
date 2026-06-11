import SubHub from "@/components/SubHub";
import { pageMeta } from "@/lib/seo";
import { getDirCollection, type Article } from "@/lib/content";

// Source: /website/public/famous-linguists.html + the 5 profile pages.
export const metadata = pageMeta({ title: "Famous Linguists", description: "Profiles of influential second-language-acquisition theorists — Krashen, VanPatten, Swain, Long and Ellis.", path: "/language-learning/famous-linguists" });

const HUB: Article = {
  slug: "famous-linguists",
  title: "Famous Linguists",
  source: "/website/public/famous-linguists.html",
  blocks: [
    {
      type: "p",
      text: "The researchers whose ideas quietly shape how most of us learn languages today. These are short, plain-English profiles — what each person figured out, and why it still matters when you sit down to study.",
    },
  ],
};

export default function FamousLinguistsHub() {
  return (
    <SubHub
      hub={HUB}
      base="/language-learning/famous-linguists"
      items={getDirCollection("language-learning/famous-linguists")}
    />
  );
}
