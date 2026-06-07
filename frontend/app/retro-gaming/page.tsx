import CollectionIndex from "@/components/CollectionIndex";

// Source: /website/public/retro-gaming.html + retro-gaming/*.html
export const metadata = { title: "Retro Gaming — Steven Legg" };

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
