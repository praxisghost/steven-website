import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Required for the Railway containerized deploy (§4): emits .next/standalone
  // so the runtime image stays small and self-contained.
  output: "standalone",
  images: {
    // Prefer modern formats; the optimizer falls back to the original type
    // for browsers that lack support. Local /public images only — no
    // remotePatterns needed (we never hotlink external hosts).
    formats: ["image/avif", "image/webp"],
  },
  // Django API base URL is read from NEXT_PUBLIC_API_URL at runtime (Phase 2).
};

export default nextConfig;
