"use client";

import { useEffect, useState } from "react";

// Degraded-mode banner (§16.1). On mount the browser calls the same-origin
// /healthz route; if the backend is unreachable we surface a calm, dismissible
// notice without blocking navigation (graceful degradation, §16.5). Renders
// nothing in the healthy case, so it never disturbs normal layout.
export default function HealthBanner() {
  const [degraded, setDegraded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/healthz", { cache: "no-store" })
      .then((res) => {
        if (active) setDegraded(!res.ok);
      })
      .catch(() => {
        if (active) setDegraded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!degraded || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-hairline bg-hairline/40 px-6 py-2 text-center text-sm text-ink-soft"
    >
      <span>
        Some features may be unavailable — the backend isn&apos;t responding
        right now. You can keep browsing; content still loads.
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
        className="ml-3 rounded px-1 font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        Dismiss
      </button>
    </div>
  );
}
