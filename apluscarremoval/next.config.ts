import type { NextConfig } from "next";
import removals from "./content/recent-removals.json";

const removalsPages = Math.max(1, Math.ceil(removals.items.length / removals.perPage));

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // This app lives in a subfolder of another project's repository. Pin the root here so the
  // parent's lockfile, PostCSS config and source files are not picked up.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  // WordPress permalinks end in a slash; keep every URL exactly as it was.
  trailingSlash: true,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Uploads keep their WordPress file names and are never edited in place.
      {
        source: "/wp-content/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Redirects the WordPress site already served.
      { source: "/cash-for-cars-brisbane", destination: "/", permanent: true },
      { source: "/recent-purchases", destination: "/recent-car-removals-brisbane/", permanent: true },
      { source: "/sell-scrap-cars-for-cash", destination: "/scrap-car-price-brisbane/", permanent: true },
      { source: "/author/:slug*", destination: "/", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
      { source: "/comments/feed", destination: "/", permanent: true },
      // The blog index is a single page; its numbered archive URLs only repeated it.
      { source: "/blog/page/:n(\\d+)", destination: "/blog/", permanent: true },
      // One host: the bare domain goes to www, as before.
      {
        source: "/:path*",
        has: [{ type: "host", value: "apluscarremoval.com.au" }],
        destination: "https://www.apluscarremoval.com.au/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // WordPress search lives at /?s=term.
        { source: "/", has: [{ type: "query", key: "s" }], destination: "/search/" },
        // Page 1 of the recent-removals grid is the page itself.
        ...Array.from({ length: removalsPages - 1 }, (_, i) => ({
          source: "/recent-car-removals-brisbane",
          has: [{ type: "query" as const, key: "tlzmda_page", value: String(i + 2) }],
          destination: `/recent-car-removals-brisbane/page/${i + 2}/`,
        })),
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
