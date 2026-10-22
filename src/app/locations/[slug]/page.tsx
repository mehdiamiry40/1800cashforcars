import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AskForPrice, Faq, FinalCta, HowItWorks, RelatedLinks, ReviewsBand, SectionHead, WhatWeBuy } from "@/components/Blocks";
import { ArrowIcon, ChevronRight, PinIcon } from "@/components/icons";
import { Hero } from "@/components/Hero";
import { Breadcrumbs, JsonLd, ServiceLd } from "@/components/JsonLd";
import { areas } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  // Logan and Ipswich have their own routes under /locations, so they are not built here.
  return areas.filter((a) => !a.href && a.slug !== "logan" && a.slug !== "ipswich").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) return {};
  return {
    // Under ~60 characters so Google shows it whole; the area name once is enough.
    title: { absolute: `Cash for Cars ${area.name} | Free Car Removal, Paid on Pickup` },
    description: `Sell your car for cash ${area.where}, ${area.state}. Free car removal in ${area.suburbs.slice(0, 3).join(", ")} and surrounds. Any condition, paid on pickup.`,
    alternates: { canonical: `/locations/${area.slug}` },
    openGraph: { url: `/locations/${area.slug}` },
  };
}

export default async function LocationPage({ params }: PageProps<"/locations/[slug]">) {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  return (
    <>
      <Breadcrumbs trail={[{ name: "Areas", path: "/locations" }, { name: area.name, path: `/locations/${area.slug}` }]} />
      <ServiceLd
        name={`Cash for Cars ${area.name}`}
        serviceType="Cash for cars and free car removal"
        description={`We buy scrap, old and unwanted cars for cash ${area.where}, with free car removal.`}
        path={`/locations/${area.slug}`}
        areaServed={[`${area.name}, ${area.state}`, ...area.suburbs.map((s) => `${s}, ${area.state}`)]}
      />
      <Hero where={area.where} title={`Cash for cars ${area.where}`} />
      {area.local?.pickup && area.local.notes && area.local.faqs && (
        <section className="container-site section-site">
          <div className="max-w-3xl">
            <h2 className="h-section">Selling a car {area.where}</h2>
            <p className="mt-4 text-[18px]">{area.local.intro}</p>
            <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Pickup from our Rocklea yard</h3>
            <p className="mt-3">{area.local.pickup}</p>
            <ul className="mt-6 space-y-3">
              {area.local.notes.map((n) => (
                <li key={n.bold}>
                  <strong className="text-navy">{n.bold}:</strong> {n.text}
                </li>
              ))}
            </ul>
            <h3 className="mt-10 font-heading text-[22px] font-semibold leading-tight text-navy">{area.name} questions</h3>
            <div className="mt-4">
              <Faq bare items={area.local.faqs} />
            </div>
            <RelatedLinks current={`/locations/${area.slug}`} />
          </div>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: area.local.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            }}
          />
        </section>
      )}
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
          <div className="mt-5 text-center"><Link href="/locations" className="btn-line">All pickup areas <ArrowIcon aria-hidden="true" className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <WhatWeBuy />
      <AskForPrice />
      <ReviewsBand />
      <FinalCta />
    </>
  );
}
