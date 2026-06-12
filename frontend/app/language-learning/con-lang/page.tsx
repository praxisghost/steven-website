import SubHub from "@/components/SubHub";
import { pageMeta } from "@/lib/seo";
import { getDirCollection, type Article } from "@/lib/content";

// Source: /website/public/con-lang.html + the 7 constructed-language guide pages.
export const metadata = pageMeta({ title: "Con-Lang", description: "Guides to constructed languages — Esperanto, Ido, Novial, Interlingua, Interslavic, Intergermanic and Klingon.", path: "/language-learning/con-lang" });

const HUB: Article = {
  slug: "con-lang",
  title: "Con-Lang",
  source: "/website/public/con-lang.html",
  blocks: [
    {
      type: "p",
      text: "Guides to constructed and auxiliary languages — from century-old internationalist projects to fictional alien tongues.",
    },
  ],
};

export default function ConLangHub() {
  return (
    <SubHub
      hub={HUB}
      base="/language-learning/con-lang"
      items={getDirCollection("language-learning/con-lang")}
    />
  );
}
