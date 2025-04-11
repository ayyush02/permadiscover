import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
};

export default nextConfig;
