import PageHeader from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";
import IsmsIndex from "@/components/IsmsIndex";
import { getIsms } from "@/lib/isms";

// Source: /website/public/isms.html + /website/public/isms/*.html (306 pages).
export const metadata = pageMeta({ title: "-isms", description: "An evolving glossary of -isms — philosophies, movements and concepts.", path: "/isms" });

export default function Isms() {
  const items = getIsms();
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader
        title="-isms"
        lead="Notes on philosophical, political, and cultural movements — alphabetically ordered. An evolving glossary; most entries are placeholders awaiting their write-up."
      />
      <IsmsIndex items={items} />
    </main>
  );
}
