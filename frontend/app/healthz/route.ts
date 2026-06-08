import { NextResponse } from "next/server";

// Same-origin health route (§16.1 / §17.1). The browser calls /healthz; this
// handler runs server-side and reaches Django over the *private* network via
// API_URL (server-only — never NEXT_PUBLIC_*), so the browser never touches
// *.railway.internal directly and no CORS is involved. Returns 200 only when
// the backend's own /api/health/ reports ok.
export const dynamic = "force-dynamic";

const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/+$/, "");

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${API_URL}/api/health/`, {
      cache: "no-store",
      signal: controller.signal,
    });
    const requestId = res.headers.get("x-request-id");
    const body = (await res.json().catch(() => ({}))) as { status?: string };
    const ok = res.ok && body.status === "ok";
    return NextResponse.json(
      { status: ok ? "ok" : "degraded", requestId },
      {
        status: ok ? 200 : 503,
        headers: requestId ? { "X-Request-ID": requestId } : undefined,
      },
    );
  } catch {
    return NextResponse.json(
      { status: "degraded", requestId: null },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
