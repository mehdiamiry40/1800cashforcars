import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AskForPrice, CallUsAndTerms, ContentBlocks, FinalCta, MakesRow, ReviewsBand, SectionHead, ServiceTiles, TrustStrip } from "@/components/Blocks";
import { PinIcon } from "@/components/icons";
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
      <Hero place={area.name} />
      <TrustStrip />

      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHead center={false} eyebrow={`Car removal ${area.name}`} title={`Cash for cars ${area.name}`} />
            <div className="prose-site text-[17px]">
              <p>
                Need to sell a car in {area.name}? {site.name} buys cars, utes, vans and 4WDs in any condition, and our tow
                trucks pick up free from anywhere in {area.name} — your driveway, workplace or the roadside.
              </p>
              <p>
                Call <a href={site.phoneHref}>{site.phoneDisplay}</a> or send your car&apos;s details in the form below for a fast
                cash offer.
              </p>
            </div>
            <div className="mt-10">
              <ContentBlocks
                blocks={[
                  {
                    heading: "How it works",
                    list: [
                      { bold: "Ask for our price", text: "tell us the make, model, year and condition of your car." },
                      { bold: "Accept the offer", text: "no obligation — you're free to say no." },
                      { bold: "Get paid and towed", text: `we pay you on pickup and tow the car away free, anywhere in ${area.name}.` },
                    ],
                  },
                ]}
              />
            </div>
          </div>
          <div className="card h-fit p-7">
            <h2 className="font-heading text-2xl font-bold uppercase text-navy">Suburbs we cover</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {area.suburbs.map((s) => (
                <li key={s} className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-navy">
                  <PinIcon className="h-3.5 w-3.5 text-brand" /> {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">Don&apos;t see yours? Call us — we probably still cover it.</p>
            <p className="mt-5 border-t border-line pt-4 text-sm">
              Also servicing{" "}
              {areas.filter((a) => a.slug !== area.slug).map((a, i, arr) => (
                <span key={a.slug}>
                  <Link href={`/locations/${a.slug}`} className="font-semibold text-brand-dark hover:underline">{a.name}</Link>
                  {i < arr.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <ServiceTiles />
      <ReviewsBand />
      <section className="py-16">
        <div className="container-site">
          <CallUsAndTerms />
        </div>
      </section>
      <AskForPrice />
      <MakesRow />
      <FinalCta />
    </>
  );
}
