import { site } from "@/lib/site";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

// The site as a whole. The home page carries this node, and Google reads the site name from it there.
// A page whose own node says `isPartOf` this @id carries it as well, so the reference resolves on that page.
export const websiteNode = {
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  alternateName: site.domain,
  url: `${site.url}/`,
  publisher: { "@id": `${site.url}/#business` },
};

// Service offered on a page, linked to the business in the root layout.
// Every Service node on the site has the same shape: `@id` is the page's canonical URL plus #service,
// and `url` is that canonical URL. area-schema.ts builds the same pair for the hand-written location pages.
export function ServiceLd({ name, serviceType, description, path, areaServed }: { name: string; serviceType: string; description: string; path: string; areaServed: string[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${site.url}${path}#service`,
        serviceType,
        name,
        description,
        url: `${site.url}${path}`,
        provider: { "@id": `${site.url}/#business` },
        areaServed: areaServed.map((name) => ({ "@type": "Place", name })),
        offers: { "@type": "Offer", priceCurrency: "AUD", description: "Free quote, free pickup and payment on collection" },
      }}
    />
  );
}

// Breadcrumb trail for search results, e.g. Home › Areas › Gold Coast.
export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${site.url}${it.path === "/" ? "" : it.path}`,
        })),
      }}
    />
  );
}
