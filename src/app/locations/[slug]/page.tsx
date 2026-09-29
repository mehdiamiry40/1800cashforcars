import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AskForPrice, FinalCta, HowItWorks, SectionHead, WhatWeBuy } from "@/components/Blocks";
import { PinIcon } from "@/components/icons";
import { Hero } from "@/components/Hero";
import { Breadcrumbs } from "@/components/JsonLd";
import { areaHref, areas, site } from "@/lib/site";

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

      <section className="bg-sand py-16 sm:py-24">
        <div className="container-site">
          <SectionHead title={`Suburbs we cover ${area.where}`} intro="Free pickup from your driveway, work, mechanic or the roadside." />
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {area.suburbs.map((s) => (
              <li key={s} className="flex items-center gap-1.5 border-2 border-line bg-white px-4 py-2 font-heading font-bold text-ink">
                <PinIcon className="h-4 w-4 text-rust" /> {s}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center">
            Also:{" "}
            {areas.filter((a) => a.slug !== area.slug).map((a, i, arr) => (
              <span key={a.slug}>
                <Link href={areaHref(a)} className="font-bold text-brand underline underline-offset-2">{a.name}</Link>
                {i < arr.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

      <WhatWeBuy />
      <AskForPrice />
      <FinalCta />
    </>
  );
}
