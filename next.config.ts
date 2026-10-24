import type { NextConfig } from "next";
import { CANONICAL_ORIGIN, PRODUCTION_VERCEL_ALIAS } from "./src/lib/canonical-host";
import { buildContentSecurityPolicy, buildDevContentSecurityPolicy } from "./src/lib/csp-policy";

// Production script hashes are unknown until prerender finishes. The placeholder is replaced
// in the build output by scripts/csp-hashes.ts. Development cannot use those hashes.
const contentSecurityPolicy =
  process.env.NODE_ENV === "development" ? buildDevContentSecurityPolicy() : buildContentSecurityPolicy([]);

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [55, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // One canonical address. Other public hosts are handled in src/proxy.ts,
    // which leaves localhost and Vercel preview URLs alone.
    return [
      // Brisbane has dedicated pages: the homepage targets "cash for cars Brisbane".
      { source: "/locations/brisbane", destination: "/", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.1800cashforcars.com.au" }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: PRODUCTION_VERCEL_ALIAS }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
