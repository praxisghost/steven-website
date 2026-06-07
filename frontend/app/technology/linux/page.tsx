import SubHub from "@/components/SubHub";
import { getArticle, getSubCollection } from "@/lib/content";

// Source: /website/public/technology/linux.html + linux/*.html
export const metadata = { title: "Linux — Steven Legg" };

export default function LinuxHub() {
  const hub = getArticle("technology", "linux");
  return (
    <SubHub
      hub={hub ?? { slug: "linux", title: "Linux", source: "", blocks: [] }}
      base="/technology/linux"
      items={getSubCollection("linux")}
    />
  );
}
