import CollectionIndex from "@/components/CollectionIndex";
import { pageMeta } from "@/lib/seo";

// Source: /website/public/self-improvement.html + self-improvement/*.html
export const metadata = pageMeta({ title: "Self Improvement", description: "Notes on self-improvement and building better habits.", path: "/self-improvement" });

export default function SelfImprovement() {
  return (
    <CollectionIndex
      name="self-improvement"
      title="Self Improvement"
      lead="Notes on the habits, ideas, and books that have changed how I try to live and work."
      emoji="🌱"
    />
  );
}
