"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

type State = "idle" | "submitting" | "success" | "error";

// Newsletter signup -> POST /api/newsletter/ (idempotent on the backend).
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setError("");
    const res = await subscribeNewsletter(email);
    if (res.ok) {
      setState("success");
      setEmail("");
    } else {
      setState("error");
      setError(res.error);
    }
  }

  if (state === "success") {
    return <p className="text-ink-soft">Thanks for subscribing — you&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center" noValidate>
      <label htmlFor="nl-email" className="sr-only">Email</label>
      <input
        id="nl-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        maxLength={254}
        placeholder="you@example.com"
        autoComplete="email"
        className="w-full rounded-lg border border-hairline bg-transparent px-4 py-3 text-base outline-none focus:border-accent sm:max-w-xs"
      />
      <button
        type="submit"
        disabled={state === "submitting"}
        className="rounded-lg bg-accent px-5 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {state === "submitting" ? "Subscribing…" : "Subscribe"}
      </button>
      {state === "error" ? (
        <p className="text-sm text-red-600 sm:self-center" role="alert">{error}</p>
      ) : null}
    </form>
  );
}
