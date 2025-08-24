import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    nodeMiddleware: true,
  },
  transpilePackages: ["@saas/ui"],
};

export default nextConfig;
