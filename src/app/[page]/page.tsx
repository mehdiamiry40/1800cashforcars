import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CallUsAndTerms, ContentBlocks, Faq, RelatedLinks } from "@/components/Blocks";
import { ServiceGrid } from "@/components/HomeSections";
import { JsonLd, ServiceLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import type { RooProps } from "@/components/Roo";
import { pages } from "@/lib/content";
import { areas, pageOpenGraph } from "@/lib/site";

export const dynamicParams = false;

const poses: Record<string, RooProps> = {
  "cash-for-cars": { hand: "cash" },
  "car-removals": { pouchCar: true, hop: true },
  services: { hand: "cash", pouchCar: true },
  "truck-removal": { hand: "phone" },
  "scrap-car-removal": { pouchCar: true },
  "car-wreckers": { hand: "cash" },
  "car-disposal": { pouchCar: true, hop: true },
};

function PriceGuideLink({ slug }: { slug: string }) {
  const linkClass = "font-semibold text-navy underline underline-offset-4";
  if (slug === "scrap-car-removal") {
    return (
      <p className="mt-8 text-[18px]">
        For guide ranges by car type and condition, see our{" "}
        <Link href="/scrap-car-prices-brisbane" className={linkClass}>
          scrap car prices in Brisbane
        </Link>
        .
      </p>
    );
  }
  if (slug === "car-wreckers") {
    return (
      <p className="mt-8 text-[18px]">
        <Link href="/scrap-car-prices-brisbane" className={linkClass}>
          See our price guide
        </Link>{" "}
        for what scrap, damaged and non-running cars are typically worth.
      </p>
    );
  }
  if (slug === "cash-for-cars") {
    return (
      <p className="mt-8 text-[18px]">
        Selling a scrap or non-running car? Read the{" "}
        <Link href="/scrap-car-prices-brisbane" className={linkClass}>
          Brisbane scrap car prices
        </Link>{" "}
        we use as a guide.
      </p>
    );
  }
  return null;
}

export function generateStaticParams() {
  return pages.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[page]">): Promise<Metadata> {
  const { page } = await params;
  const p = pages.find((x) => x.slug === page);
  if (!p) return {};
  return {
    title: p.metaTitle,
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: pageOpenGraph(`/${p.slug}`),
  };
}

export default async function ContentPageRoute({
  params,
}: PageProps<"/[page]">) {
  const { page } = await params;
  const p = pages.find((x) => x.slug === page);
  if (!p) notFound();

  return (
    <PageShell
      title={p.title}
      path={`/${p.slug}`}
      intro={p.intro ?? p.description}
      roo={poses[p.slug]}
      forms={p.slug !== "services"}
    >
      {p.slug !== "services" && (
        <ServiceLd
          name={p.title}
          serviceType={p.title}
          description={p.description}
          path={`/${p.slug}`}
          areaServed={areas.map((a) => `${a.name}, ${a.state}`)}
        />
      )}
      {p.slug === "services" && (
        <div className="mb-16">
          <ServiceGrid />
        </div>
      )}
      <ContentBlocks blocks={p.blocks} />
      <PriceGuideLink slug={p.slug} />
      {p.faqs && (
        <div className="mt-12">
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            }}
          />
          <h2 className="h-content">{p.title} FAQs</h2>
          <div className="mt-6">
            <Faq bare items={p.faqs} />
          </div>
        </div>
      )}
      <RelatedLinks current={`/${p.slug}`} />
      <div className="mt-12">
        <CallUsAndTerms />
      </div>
    </PageShell>
  );
}
