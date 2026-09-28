import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AskForPrice, CallUsAndTerms, HowItWorks, MakesRow, ReviewsBand, SectionHead, ServiceTiles } from "@/components/Blocks";
import { Hero } from "@/components/Hero";
import { areas, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
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
      <Hero where={area.where} />
      <HowItWorks />

      <section className="bg-paper py-12 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHead title={`Car removal ${area.where}`} />
            <div className="prose-site">
              <p>
                We buy cars, utes, vans and 4WDs anywhere {area.where}, in any condition. We&apos;ll pick it up from your
                driveway, your work, a mechanic&apos;s yard or the side of the road, and the towing is free.
              </p>
              <p>
                Call <a href={site.phoneHref}>{site.phoneDisplay}</a> or send us the details below and we&apos;ll give you a price.
              </p>
            </div>
          </div>
          <div>
            <h2 className="h-sub">Suburbs we cover</h2>
            <p className="mt-2">{area.suburbs.join(", ")}, and everywhere in between.</p>
            <p className="mt-6 text-[15px]">
              We also pick up in{" "}
              {areas.filter((a) => a.slug !== area.slug).map((a, i, arr) => (
                <span key={a.slug}>
                  <Link href={`/locations/${a.slug}`} className="font-semibold text-brand underline underline-offset-2">{a.name}</Link>
                  {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " and " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <ServiceTiles />
      <section className="py-12 sm:py-20">
        <div className="container-site">
          <CallUsAndTerms />
        </div>
      </section>
      <ReviewsBand />
      <AskForPrice />
      <MakesRow />
    </>
  );
}
