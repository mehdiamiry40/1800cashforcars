import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Most visitors come once (to sell a car), so inlining the small Tailwind CSS beats caching it.
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [55, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
