import CollectionIndex from "@/components/CollectionIndex";
import { pageMeta } from "@/lib/seo";

// Source: /website/public/book-reviews.html + book-reviews/*.html
export const metadata = pageMeta({ title: "Book Reviews", description: "Book reviews by Steven Legg — what I've read and what it meant.", path: "/book-reviews" });

export default function BookReviews() {
  return (
    <CollectionIndex
      name="book-reviews"
      title="Book Reviews"
      lead="Books I've read and what they meant to me. Less analysis, more honest reaction — the circumstances I was in when I read them, and what stayed."
      emoji="📖"
    />
  );
}
