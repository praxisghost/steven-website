import SubHub from "@/components/SubHub";
import { getDirCollection, type Article } from "@/lib/content";

// Source: /website/public/language-methods.html + the 9 method guide pages.
export const metadata = { title: "Methods & Tools — Steven Legg" };

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
