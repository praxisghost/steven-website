import SubHub from "@/components/SubHub";
import { pageMeta } from "@/lib/seo";
import { getArticle, getSubCollection } from "@/lib/content";

// Source: /website/public/technology/software-tutorials.html + software-tutorials/*.html
export const metadata = pageMeta({ title: "Software Tutorials", description: "Step-by-step software tutorials — Audacity, Darktable, GIMP, Kdenlive, Notion and Obsidian.", path: "/technology/software-tutorials" });

export default function SoftwareTutorialsHub() {
  const hub = getArticle("technology", "software-tutorials");
  return (
    <SubHub
      hub={hub ?? { slug: "software-tutorials", title: "Software Tutorials", source: "", blocks: [] }}
      base="/technology/software-tutorials"
      items={getSubCollection("software-tutorials")}
    />
  );
}
