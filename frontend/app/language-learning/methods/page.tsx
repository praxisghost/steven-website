import SubHub from "@/components/SubHub";
import { pageMeta } from "@/lib/seo";
import { getDirCollection, type Article } from "@/lib/content";

// Source: /website/public/language-methods.html + the 9 method guide pages.
export const metadata = pageMeta({ title: "Methods & Tools", description: "Practical language-learning methods and tools — Anki, comprehensible input, shadowing, TPRS and more.", path: "/language-learning/methods" });

const HUB: Article = {
  slug: "methods",
  title: "Methods & Tools",
  source: "/website/public/language-methods.html",
  blocks: [
    {
      type: "p",
      text: "Approaches and techniques for accelerating language acquisition — spaced repetition, comprehensible input, shadowing, TPRS, and more.",
    },
  ],
};

export default function MethodsHub() {
  return (
    <SubHub
      hub={HUB}
      base="/language-learning/methods"
      items={getDirCollection("language-learning/methods")}
    />
  );
}
