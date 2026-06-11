import type { Metadata } from "next";
import ErrorState from "@/components/ErrorState";

export const metadata: Metadata = { title: "Page not found" };

// Branded 404 (§8). Missing content gets the same calm, actionable surface as
// other error states rather than the framework default.
export default function NotFound() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <ErrorState
        code="404"
        title="This page doesn't exist"
        message="The link may be out of date, or the page may have moved. Try the homepage, or use the navigation above to find your way."
      />
    </main>
  );
}
