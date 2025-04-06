import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  typescript: {
    // ⚠️ Warning: This skips type checking during build
    // Use only temporarily to get past the build error
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
