import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/nuri',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
