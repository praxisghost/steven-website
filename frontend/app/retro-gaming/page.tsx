import CollectionIndex from "@/components/CollectionIndex";
import { pageMeta } from "@/lib/seo";

// Source: /website/public/retro-gaming.html + retro-gaming/*.html
export const metadata = pageMeta({ title: "Retro Gaming", description: "Retro gaming write-ups — Game Boy Advance SP, GameCube, PlayStation 2 and more.", path: "/retro-gaming" });

export default function RetroGaming() {
  return (
    <CollectionIndex
      name="retro-gaming"
      title="Retro Gaming"
      lead="The consoles and handhelds I grew up with, and why they still matter to me."
      emoji="🕹️"
    />
  );
}
