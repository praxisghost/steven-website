"use client";

import { useState } from "react";
import { sendContact } from "@/lib/api";

type State = "idle" | "submitting" | "success" | "error";

const INPUT =
  "w-full rounded-lg border border-hairline bg-transparent px-4 py-3 text-base outline-none focus:border-accent";

// Contact form -> POST /api/contact/. Backend validates + stores (api/views.py).
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setError("");
    const res = await sendContact({ name, email, message });
    if (res.ok) {
      setState("success");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setState("error");
      setError(res.error);
    }
  }

  if (state === "success") {
    return (
      <p className="rounded-lg border border-hairline bg-hairline/30 px-4 py-3 text-ink-soft">
        Thanks — your message has been sent. I&apos;ll get back to you.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="cf-name" className="mb-1 block text-sm text-muted">Name</label>
        <input
          id="cf-name"
          className={INPUT}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="cf-email" className="mb-1 block text-sm text-muted">Email</label>
        <input
          id="cf-email"
          type="email"
          className={INPUT}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1 block text-sm text-muted">Message</label>
        <textarea
          id="cf-message"
          className={`${INPUT} min-h-32 resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={5000}
        />
      </div>
      {state === "error" ? (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="rounded-lg bg-accent px-5 py-3 text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {state === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
