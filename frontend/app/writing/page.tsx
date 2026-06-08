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
          { label: "Animals", emoji: "🐾", href: "/writing/animals", note: "On the creatures I love, & their inner lives." },
          { label: "Blog", emoji: "📝", href: "/blog", note: "Notes, essays & monthly updates." },
          { label: "Criticisms", emoji: "🧐", href: "/writing/criticisms", note: "Considered critiques, fair but honest." },
          { label: "-isms", emoji: "🏷️", href: "/isms", note: "A glossary of movements & ideologies." },
          { label: "Politics", emoji: "🏛️", href: "/writing/politics", note: "Essays on politics, society & the road ahead." },
          { label: "Questions", emoji: "❓", href: "/writing/questions", note: "Things I genuinely wonder about." },
          { label: "Retro Gaming", emoji: "🕹️", href: "/retro-gaming", note: "Consoles & handhelds I grew up with." },
          { label: "Rhythm & Meter", emoji: "🎼", href: "/writing/rhythm-and-meter", note: "On the craft of metrical writing." },
          { label: "Self Improvement", emoji: "🌱", href: "/self-improvement", note: "Habits, ideas & books that changed me." },
          { label: "Shavian English", emoji: "🔤", href: "/writing/shavian-english", note: "A tribute to a phonetic alphabet." },
          { label: "Technology", emoji: "💻", href: "/technology", note: "OSes, phones, AI & software." },
          { label: "Tributes", emoji: "🕊️", href: "/writing/tributes", note: "Remembering things now gone." },
        ]}
      />
    </main>
  );
}
