import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AskForPrice, FinalCta, HowItWorks, SectionHead, WhatWeBuy } from "@/components/Blocks";
import { ArrowIcon, ChevronRight, PinIcon } from "@/components/icons";
import { Hero } from "@/components/Hero";
import { Breadcrumbs } from "@/components/JsonLd";
import { areas, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.filter((a) => !a.href).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) return {};
  return {
    title: { absolute: `Cash For Cars ${area.name} | Free Car Removal ${area.name} | ${site.name}` },
    description: `Sell your car for top cash in ${area.name}, ${area.state}. Free car removal and same-day pickup in ${area.suburbs.slice(0, 3).join(", ")} and surrounds. Paid on pickup.`,
    alternates: { canonical: `/locations/${area.slug}` },
  };
}

export default async function LocationPage({ params }: PageProps<"/locations/[slug]">) {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  return (
    <>
      <Breadcrumbs trail={[{ name: "Areas", path: "/#areas" }, { name: area.name, path: `/locations/${area.slug}` }]} />
      <Hero where={area.where} />
      <HowItWorks />

      <section className="section-site border-y border-line bg-sand">
        <div className="container-site">
          <PinIcon aria-hidden="true" className="mx-auto mb-5 h-16 w-16 text-brand" strokeWidth={1.5} />
          <SectionHead title={`Pickup ${area.where}`} intro="Home, work, mechanic or roadside." />
          <details className="group mx-auto mt-6 max-w-3xl border border-line bg-white p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-navy">View covered suburbs <ChevronRight aria-hidden="true" className="h-4 w-4 text-brand transition-transform group-open:rotate-90" /></summary>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {area.suburbs.map((s) => <li key={s} className="border border-line bg-sand px-3 py-2 text-[14px]">{s}</li>)}
            </ul>
          </details>
          <div className="mt-5 text-center"><Link href="/#areas" className="btn-line">All pickup areas <ArrowIcon aria-hidden="true" className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <WhatWeBuy />
      <AskForPrice />
      <FinalCta />
    </>
  );
}
