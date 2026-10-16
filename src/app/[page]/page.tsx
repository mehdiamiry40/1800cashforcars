import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CallUsAndTerms, ContentBlocks, RelatedLinks } from "@/components/Blocks";
import { ServiceGrid } from "@/components/HomeSections";
import { ServiceLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import type { RooProps } from "@/components/Roo";
import { pages } from "@/lib/content";
import { areas } from "@/lib/site";

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
    title: { absolute: p.metaTitle },
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
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
      <RelatedLinks current={`/${p.slug}`} />
      <div className="mt-12">
        <CallUsAndTerms />
      </div>
    </PageShell>
  );
}
