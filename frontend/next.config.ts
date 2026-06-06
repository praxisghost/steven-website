import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Django API base URL is read from NEXT_PUBLIC_API_URL at runtime (Phase 2).
};

export default nextConfig;
