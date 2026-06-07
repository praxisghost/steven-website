import PageHeader from "@/components/PageHeader";
import HubGrid from "@/components/HubGrid";

// Source: /website/public/writing.html — section list preserved (sub-pages migrate in later phases).
export const metadata = { title: "Writing — Steven Legg" };

export default function Writing() {
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader title="Writing" lead="Written work across a few different areas." />
      <HubGrid
        items={[
          { label: "Animals", emoji: "🐾" },
          { label: "Blog", emoji: "📝", href: "/blog", note: "Notes, essays & monthly updates." },
          { label: "Criticisms", emoji: "🧐" },
          { label: "-isms", emoji: "🏷️", href: "/isms", note: "A glossary of movements & ideologies." },
          { label: "Politics", emoji: "🏛️" },
          { label: "Questions", emoji: "❓" },
          { label: "Retro Gaming", emoji: "🕹️", href: "/retro-gaming", note: "Consoles & handhelds I grew up with." },
          { label: "Rhythm & Meter", emoji: "🎼" },
          { label: "Self Improvement", emoji: "🌱", href: "/self-improvement", note: "Habits, ideas & books that changed me." },
          { label: "Shavian English", emoji: "🔤" },
          { label: "Technology", emoji: "💻", href: "/technology", note: "OSes, phones, AI & software." },
          { label: "Tributes", emoji: "🕊️" },
        ]}
      />
    </main>
  );
}
