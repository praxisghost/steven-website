import SubHub from "@/components/SubHub";
import { getArticle, getSubCollection } from "@/lib/content";

// Source: /website/public/technology/software-tutorials.html + software-tutorials/*.html
export const metadata = { title: "Software Tutorials — Steven Legg" };

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
