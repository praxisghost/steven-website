"use client";

import Link from "next/link";
import { useState } from "react";

// Branded error / empty-state surface (§8). Replaces the browser/Railway
// defaults everywhere a 4xx/5xx, render failure, or missing-content case
// occurs. Always offers a next step and surfaces a request ID so a report
// is actionable. Reused by app/error.tsx (500) and app/not-found.tsx (404).
export type ErrorStateProps = {
  /** Short status label, e.g. "500" or "404". */
  code?: string;
  title: string;
  message: string;
  /** X-Request-ID from Django (or the Next error digest) when available. */
  requestId?: string | null;
  /** Provided by client error boundaries to re-render the segment. */
  onRetry?: () => void;
  /** Show the domain/SSL self-diagnostic hint (server/5xx contexts only). */
  showInfraHint?: boolean;
};

export default function ErrorState({
  code,
  title,
  message,
  requestId,
  onRetry,
  showInfraHint = false,
}: ErrorStateProps) {
  const [copied, setCopied] = useState(false);

  async function copyDetails() {
    const details = [
      `URL: ${typeof window !== "undefined" ? window.location.href : "(unknown)"}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Request ID: ${requestId ?? "(none)"}`,
      `User agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "(unknown)"}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

  return (
    <div role="alert" className="max-w-content">
      {code ? (
        <p className="font-display text-sm uppercase tracking-[0.2em] text-muted">
          Error {code}
        </p>
      ) : null}
      <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-ink-soft">{message}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={`rounded bg-accent px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent/90 ${focusRing}`}
          >
            Try again
          </button>
        ) : null}
        <Link
          href="/"
          className={`rounded border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent ${focusRing}`}
        >
          Go to homepage
        </Link>
      </div>

      <div className="mt-8 rounded-lg border border-hairline bg-bg p-4 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-muted">
            Request ID:{" "}
            <code className="rounded bg-hairline/60 px-1.5 py-0.5 text-ink">
              {requestId ?? "unavailable"}
            </code>
          </span>
          <button
            type="button"
            onClick={copyDetails}
            aria-live="polite"
            className={`rounded px-2 py-1 font-medium text-accent hover:underline ${focusRing}`}
          >
            {copied ? "Copied" : "Copy error details"}
          </button>
        </div>
        {showInfraHint ? (
          <p className="mt-3 text-muted">
            If the site isn&apos;t resolving, check{" "}
            <span className="text-ink-soft">Railway → Settings → Domains</span>{" "}
            for verification and SSL status, and confirm the{" "}
            <code className="rounded bg-hairline/60 px-1.5 py-0.5 text-ink">
              _railway-verify
            </code>{" "}
            DNS TXT record at your registrar.
          </p>
        ) : null}
      </div>
    </div>
  );
}
