import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [55, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
