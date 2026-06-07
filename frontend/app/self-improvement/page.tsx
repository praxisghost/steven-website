import CollectionIndex from "@/components/CollectionIndex";

// Source: /website/public/self-improvement.html + self-improvement/*.html
export const metadata = { title: "Self Improvement — Steven Legg" };

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
