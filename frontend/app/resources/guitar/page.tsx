import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import GuitarGuide from "@/components/GuitarGuide";

// Source: /website/public/guitar.html + guitar-scale.js
export const metadata = pageMeta({ title: "Guitar Learning Guide", description: "An interactive guitar learning guide — scales by key, progress notes and an E major pentatonic player with staff notation.", path: "/resources/guitar" });

export default function GuitarPage() {
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <Link href="/resources" className="text-sm text-accent hover:underline">
        ← Resources
      </Link>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">Guitar</h1>
      <p className="mt-4 max-w-content text-lg text-ink-soft">
        My guitar-learning roadmap — scales worked through one key at a time, with an interactive
        E Major Pentatonic player you can hear and read on the staff.
      </p>
      <div className="mt-10">
        <GuitarGuide />
      </div>
    </main>
  );
}
