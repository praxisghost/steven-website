// Typed client for the Django API (Phase 2 backend).
// Base URL comes from NEXT_PUBLIC_API_URL (public, non-secret) — see
// .env.local.example. Endpoints + payload shapes mirror backend/api/views.py.

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");

export type ApiResult = { ok: true } | { ok: false; error: string };

async function postJSON(path: string, body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok) {
      return {
        ok: false,
        error: typeof data.error === "string" ? data.error : "Something went wrong. Please try again.",
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the server. Please try again later." };
  }
}

export function sendContact(input: { name: string; email: string; message: string }): Promise<ApiResult> {
  return postJSON("/api/contact/", input);
}

export function subscribeNewsletter(email: string): Promise<ApiResult> {
  return postJSON("/api/newsletter/", { email });
}
