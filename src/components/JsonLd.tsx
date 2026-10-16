import { site } from "@/lib/site";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

// Service offered on a page, linked to the business in the root layout.
export function ServiceLd({ name, serviceType, description, path, areaServed }: { name: string; serviceType: string; description: string; path: string; areaServed: string[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
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
