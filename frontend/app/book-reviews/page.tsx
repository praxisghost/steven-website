import CollectionIndex from "@/components/CollectionIndex";

// Source: /website/public/book-reviews.html + book-reviews/*.html
export const metadata = { title: "Book Reviews — Steven Legg" };

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
