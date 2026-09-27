import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { FloatingContact, Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { areas, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

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
  themeColor: "#0d1b34",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: site.name,
  url: site.url,
  telephone: site.phoneHref.replace("tel:", ""),
  email: site.email,
  openingHours: site.hoursSchema,
  priceRange: "Free quotes",
  areaServed: areas.map((a) => ({ "@type": "City", name: `${a.name}, ${a.state}` })),
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${barlow.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
