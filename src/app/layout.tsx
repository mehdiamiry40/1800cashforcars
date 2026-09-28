import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import { FloatingContact, Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { areas, site } from "@/lib/site";
import "./globals.css";

// Body text: "optional" keeps the fallback if the font is not ready almost immediately, so it never delays first paint.
const nunitoSans = Nunito_Sans({ variable: "--font-nunito-sans", subsets: ["latin"], weight: ["400", "700"], display: "optional" });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["800", "900"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Top Cash For Cars + Free Car Removal`,
    template: `%s | ${site.name}`,
  },
  description:
    "Sell your car for top cash today. Free car removal, same-day pickup and paid on the spot. We buy any car, ute, van or 4WD in any condition across South East Queensland.",
  keywords: ["cash for cars", "car removal", "sell my car", "scrap car removal", "car wreckers", "cash for cars Gold Coast", "cash for cars Brisbane"],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
    url: site.url,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#1e3a2f",
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
  openingHours: site.hoursSchema,
  priceRange: "Free quotes",
  areaServed: areas.map((a) => ({ "@type": "City", name: `${a.name}, ${a.state}` })),
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${nunitoSans.variable} ${nunito.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-ink">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
        <Analytics />
      </body>
    </html>
  );
}
