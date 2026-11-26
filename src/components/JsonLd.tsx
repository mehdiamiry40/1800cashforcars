import Link from "next/link";
import { Fragment } from "react";
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

export type Crumb = { name: string; path: string };

const withHome = (trail: Crumb[]): Crumb[] => [{ name: "Home", path: "/" }, ...trail];

// Breadcrumb trail for search results, e.g. Home › Areas › Gold Coast.
// Search Console listed these as "Unnamed item" while the list had no name of its own. The name is the
// trail as the page shows it, so it adds nothing a reader cannot see.
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const items = withHome(trail);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        name: items.map((it) => it.name).join(" › "),
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

/**
 * The same trail on the page, from the same list, so the markup never describes a trail the reader
 * cannot see. `band` is the full-width row under a page hero. Without it the trail is one line to put
 * inside a page's own column.
 */
export function BreadcrumbTrail({ trail, band = false, className = "" }: { trail: Crumb[]; band?: boolean; className?: string }) {
  const items = withHome(trail);
  return (
    <nav aria-label="Breadcrumb" className={`${band ? "border-b border-line" : ""} ${className}`.trim() || undefined}>
      <div className={`flex flex-wrap items-center gap-2 text-[16px] ${band ? "container-site py-4" : ""}`.trim()}>
        {items.map((it, i) => (
          <Fragment key={it.path}>
            {i > 0 && (
              <span aria-hidden="true" className="text-brand">
                ›
              </span>
            )}
            {i < items.length - 1 ? (
              <Link href={it.path} className="inline-flex min-h-11 items-center">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="inline-flex min-h-11 items-center font-semibold">
                {it.name}
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
