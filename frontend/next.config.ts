import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Required for the Railway containerized deploy (§4): emits .next/standalone
  // so the runtime image stays small and self-contained.
  output: "standalone",
  images: {
    // Serve local /public images directly rather than through the on-demand
    // optimizer. These photos are already web-sized, and unoptimized delivery
    // is reliable across every runtime (next dev, next start, and the
    // standalone Railway image) with no sharp/optimizer dependency — fixing
    // images that failed to load when the optimizer endpoint wasn't available.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  // Preserve old source URLs so existing links/bookmarks keep working.
  async redirects() {
    return [
      { source: "/language-guides", destination: "/language-learning/guides", permanent: true },
    ];
  },
  // Django API base URL is read from NEXT_PUBLIC_API_URL at runtime (Phase 2).
};

export default nextConfig;
