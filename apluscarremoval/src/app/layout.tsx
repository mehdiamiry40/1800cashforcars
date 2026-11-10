import type { Metadata } from "next";
import { ThirdPartyTags, ThirdPartyTagsNoScript } from "@/components/ThirdPartyTags";
import { ThemeRuntime } from "@/components/ThemeRuntime";
import { BODY_CLASS_COMMON, RECAPTCHA_SITE_KEY, SITE_ORIGIN } from "@/lib/site";

// Order matters: this is the order WordPress printed its stylesheets in.
import "@/styles/vendor/wp-core-inline.css";
import "@/styles/vendor/wp-content/plugins/contact-form-7/includes/css/styles.css";
import "@/styles/vendor/wp-content/plugins/tlzmda-car-removals/assets/css/grid.css";
import "@/styles/vendor/wp-content/themes/flatsome/assets/css/flatsome.css";
import "@/styles/vendor/flatsome-inline.css";
import "@/styles/site.css";

const ICONS = "/wp-content/uploads/2025/10/cropped-apluscarremoval-logo-black";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  icons: {
    icon: [
      { url: `${ICONS}-32x32.png`, sizes: "32x32" },
      { url: `${ICONS}-192x192.png`, sizes: "192x192" },
    ],
    apple: `${ICONS}-180x180.png`,
  },
  other: { "msapplication-TileImage": `${SITE_ORIGIN}${ICONS}-270x270.png` },
};

// Same-site links are prefetched on hover/touch, as the WordPress site did.
const SPECULATION_RULES = {
  prefetch: [
    {
      source: "document",
      where: {
        and: [
          { href_matches: "/*" },
          { not: { href_matches: ["/wp-content/*", "/api/*", "/*\\?(.+)"] } },
          { not: { selector_matches: 'a[rel~="nofollow"]' } },
          { not: { selector_matches: ".no-prefetch, .no-prefetch a" } },
        ],
      },
      eagerness: "conservative",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The class swap below and the page's body classes change these two elements before React
    // hydrates, exactly as the theme did; that difference is expected.
    <html lang="en-US" className="loading-site no-js" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(html){html.className = html.className.replace(/\\bno-js\\b/,'js')})(document.documentElement);",
          }}
        />
      </head>
      <body className={BODY_CLASS_COMMON} suppressHydrationWarning>
        {/* Styles WordPress printed after the theme stylesheet (Customizer CSS, fonts, block
            styles), served as written: see scripts/import-wordpress.mjs. Loading it from the
            body keeps it after the bundled stylesheets in <head>, as in the original cascade. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/assets/wp-late-styles.css" />
        <ThirdPartyTagsNoScript />
        {children}
        <ThemeRuntime recaptchaSiteKey={RECAPTCHA_SITE_KEY} />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(SPECULATION_RULES) }} />
        <ThirdPartyTags />
      </body>
    </html>
  );
}
