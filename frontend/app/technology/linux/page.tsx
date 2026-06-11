import SubHub from "@/components/SubHub";
import { pageMeta } from "@/lib/seo";
import { getArticle, getSubCollection } from "@/lib/content";

// Source: /website/public/technology/linux.html + linux/*.html
export const metadata = pageMeta({ title: "Linux", description: "Linux guides and distro experiences — Arch, Debian, Fedora KDE, Mint and more.", path: "/technology/linux" });

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
