import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr:true,
    nodeMiddleware: true,
  }
};

export default nextConfig;
