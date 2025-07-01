import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration to ensure proper CSS processing
  reactStrictMode: true,
  // Ensure CSS modules work properly
  transpilePackages: ["@tailwindcss/postcss"],
};

export default nextConfig;
