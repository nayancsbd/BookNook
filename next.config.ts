import type { NextConfig } from "next";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const serverBaseUrl = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/books/:path*",
        destination: `${serverBaseUrl}/books/:path*`,
      },
      {
        source: "/api/books",
        destination: `${serverBaseUrl}/books`,
      },
      {
        source: "/api/borrows/:path*",
        destination: `${serverBaseUrl}/borrows/:path*`,
      },
      {
        source: "/api/borrows",
        destination: `${serverBaseUrl}/borrows`,
      },
    ];
  },
};

export default nextConfig;
