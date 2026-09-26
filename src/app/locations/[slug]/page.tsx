import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Faq, FinalCta, HowItWorks, SectionHeading, TrustStrip, WhatWeBuy } from "@/components/Sections";
import { PinIcon } from "@/components/icons";
import { areas } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) return {};
  return {
    title: `Cash For Cars ${area.name} | Free Car Removal ${area.name}`,
    description: `Sell your car for top cash in ${area.name}, ${area.state}. Free car removal, same-day pickup in ${area.suburbs.slice(0, 3).join(", ")} and surrounds. Paid on the spot.`,
    alternates: { canonical: `/locations/${area.slug}` },
  };
}

export default async function LocationPage({ params }: PageProps<"/locations/[slug]">) {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  return (
    <>
      <Hero
        eyebrow={`Cash for cars · ${area.name} ${area.state}`}
        title={
          <>
            Cash for cars {area.name}.
            <span className="block text-cash-400">Free pickup, paid today.</span>
          </>
        }
        sub={`Selling a car in ${area.name}? Get a free offer in 60 seconds. Our local tow trucks pick up from your driveway, workplace or roadside across ${area.name} — and pay you on the spot.`}
        defaultArea={area.name}
      />
      <TrustStrip />
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading kicker={`Car removal ${area.name}`} title={`Suburbs we cover in ${area.name}`} sub="Don't see your suburb? We probably still cover it — just ask." />
          <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
            {area.suburbs.map((s) => (
              <li key={s} className="flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 font-semibold ring-1 ring-line">
                <PinIcon className="h-4 w-4 text-brand-500" /> {s}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-muted">
            Also servicing{" "}
            {areas.filter((a) => a.slug !== area.slug).map((a, i, arr) => (
              <span key={a.slug}>
                <Link href={`/locations/${a.slug}`} className="font-semibold text-brand-600 hover:underline">{a.name}</Link>
                {i < arr.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>
      <HowItWorks />
      <WhatWeBuy />
      <Faq />
      <FinalCta />
    </>
  );
}
