import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Semi_Condensed, Nunito_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ContactTracker, StickyQuoteBar } from "@/components/QuoteLink";
import { areas, site } from "@/lib/site";
import "./globals.css";

// Body text: "optional" keeps the fallback if the font is not ready almost immediately, so it never delays first paint.
const nunitoSans = Nunito_Sans({ variable: "--font-nunito-sans", subsets: ["latin"], weight: ["400", "700"], display: "optional" });
const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["600", "700", "800"] });
// Logo lettering only.
const barlowSemi = Barlow_Semi_Condensed({ variable: "--font-barlow-semi", subsets: ["latin"], weight: ["800"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Cash for Scrap & Old Cars, Free Removal`,
    template: `%s | ${site.name}`,
  },
  description:
    "Cash for scrap, old, broken and unwanted cars across Brisbane, the Gold Coast and South East QLD. Any condition, free towing, paid on pickup. Get a free price online in 30 seconds.",
  keywords: ["cash for cars", "car removal", "sell my car", "scrap car removal", "car wreckers", "cash for cars Gold Coast", "cash for cars Brisbane"],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
    url: site.url,
  },
  alternates: { canonical: "/" },
  // Google Search Console ownership (URL-prefix property). Keep this, or verification is lost.
  verification: { google: "hT98u-ufxCSpHuzlwhET1YrWOFSQEH_Eh_8oAwh7BkA" },
};

export const viewport: Viewport = {
  themeColor: "#0f1d33",
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  url: site.url,
  image: `${site.url}/opengraph-image`,
  paymentAccepted: "Cash, Bank transfer",
  currenciesAccepted: "AUD",
  ...(site.address
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: site.addressParts.street,
          addressLocality: site.addressParts.locality,
          addressRegion: site.addressParts.region,
          postalCode: site.addressParts.postcode,
          addressCountry: site.addressParts.country,
        },
        hasMap: site.mapsUrl,
      }
    : {}),
  ...(site.abn ? { taxID: site.abn } : {}),
  telephone: site.phoneHref.replace("tel:", ""),
  ...(site.showEmail ? { email: site.email } : {}),
  priceRange: "Free quotes",
  areaServed: areas.map((a) => ({ "@type": "City", name: `${a.name}, ${a.state}` })),
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${nunitoSans.variable} ${barlow.variable} ${barlowSemi.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-ink">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <StickyQuoteBar />
        <ContactTracker />
        <Analytics />
      </body>
    </html>
  );
}
