import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Barlow } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ContactTracker, StickyQuoteBar } from "@/components/QuoteLink";
import { areas, site } from "@/lib/site";
import "./globals.css";

// Barlow is shared by navigation, headings, forms and body copy.
// 400 body, 600 headings, 700 buttons. Medium and extrabold are mapped onto these in globals.css so only three files are preloaded.
const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Cash for Scrap & Old Cars, Free Removal`,
    template: `%s | ${site.name}`,
  },
  description:
    "Cash for scrap, old, broken and unwanted cars across Brisbane, the Gold Coast and South East QLD. Any condition, free towing, paid on pickup. Free quote, usually within the hour.",
  // No og:url or canonical here. A site-wide URL would mark every page, including 404s, as the homepage.
  // Each page sets its own canonical and openGraph.url.
  // Pages that set their own openGraph must use pageOpenGraph(). Next.js replaces
  // this object instead of merging it, which would drop og:site_name.
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
  },
  // Google Search Console ownership (URL-prefix property). Keep this, or verification is lost.
  verification: { google: "hT98u-ufxCSpHuzlwhET1YrWOFSQEH_Eh_8oAwh7BkA" },
};

export const viewport: Viewport = {
  themeColor: "#1e25a4",
  viewportFit: "cover",
};

const GOOGLE_ADS_ID = "AW-11027669589";

const socialSameAs = [site.social.facebook, site.social.instagram].filter(Boolean);

// The Google listing belongs to A Plus Car Removal. Its star rating stays visible
// text only. Google Maps ratings are not allowed as review markup.
// The licence sits on the parent only. Legal name, ABN and the issuing body are omitted until confirmed.
const parentOrganization = site.googleBusinessName && site.parentUrl
  ? {
      "@type": "Organization",
      name: site.googleBusinessName,
      url: site.parentUrl,
      ...(site.googleBusinessUrl ? { sameAs: [site.googleBusinessUrl] } : {}),
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: site.parentLicence,
      },
    }
  : undefined;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  url: site.url,
  image: `${site.url}/opengraph-image`,
  logo: `${site.url}/apple-icon`,
  geo: { "@type": "GeoCoordinates", ...site.geo },
  ...(socialSameAs.length ? { sameAs: socialSameAs } : {}),
  ...(parentOrganization ? { parentOrganization } : {}),
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
  openingHoursSpecification: site.hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
  telephone: site.phoneHref.replace("tel:", ""),
  ...(site.showEmail ? { email: site.email } : {}),
  areaServed: areas.map((a) => ({ "@type": "City", name: `${a.name}, ${a.state}` })),
  description: site.tagline,
  knowsAbout: ["Cash for cars", "Car removal", "Scrap car removal", "Car wreckers", "Truck removal"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${barlow.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-ink">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <StickyQuoteBar />
        <ContactTracker />
        <Analytics />
        {/* Queue Google Ads hits immediately, but download gtag.js after the page is idle so it does not compete with the hero image. QuoteForm calls window.gtag, which pushes into this queue if the library has not loaded yet. */}
        <Script id="google-ads-tag" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () { window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', '${GOOGLE_ADS_ID}');
        `}</Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="lazyOnload" />
      </body>
    </html>
  );
}
