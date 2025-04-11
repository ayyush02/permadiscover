import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
  // Disable server-side features in static export
  experimental: {
    appDir: true,
  },
  // Ensure proper handling of static assets
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://beamish-meringue-e63fe3.netlify.app' : '',
};

export default nextConfig;
