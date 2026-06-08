"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

// Segment error boundary (§8). Keeps the site header/footer (it renders inside
// the root layout) and shows the branded surface for any render/5xx failure.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; requestId?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the request ID / digest for diagnostics (§16.2).
    console.error("[error]", error.requestId ?? error.digest ?? "(no id)", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <ErrorState
        code="500"
        title="Something went wrong"
        message="The page hasn't loaded yet — the backend may still be waking up. You can retry, or head back to the homepage."
        requestId={error.requestId ?? error.digest ?? null}
        onRetry={reset}
        showInfraHint
      />
    </main>
  );
}
