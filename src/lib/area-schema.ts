import { site } from "./site";

// Service + FAQPage for a location page. The AutomotiveBusiness stays in the root layout;
// these pages only point at it with provider @id. No licence number here: the motor dealer
// licence belongs to A Plus Car Removal, not to this brand's own LocalBusiness node.
export function areaServiceGraph({
  path,
  name,
  description,
  city,
  suburbs,
  faqs,
}: {
  path: string;
  name: string;
  description: string;
  city: string;
  suburbs: string[];
  faqs: { q: string; a: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}${path}#service`,
        name,
        serviceType: "Cash for cars and free car removal",
        description,
        url: `${site.url}${path}`,
        provider: { "@id": `${site.url}/#business` },
        areaServed: [
          { "@type": "City", name: city },
          ...suburbs.map((suburb) => ({ "@type": "Place", name: `${suburb}, QLD` })),
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}${path}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}
