import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AskForPrice, CallUsAndTerms, ContentBlocks, MakesRow, ReviewsBand, ServiceTiles } from "@/components/Blocks";
import { HeroSlider } from "@/components/HeroSlider";
import { areas, site } from "@/lib/site";
import { heroSlides } from "@/lib/slides";

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
      <HeroSlider slides={heroSlides(area.name)} />
      <ServiceTiles />

      <section className="mt-10 bg-band py-10">
        <div className="container-site prose-site">
          <h2 className="h-section">Cash for cars {area.name} car removal</h2>
          <p>
            Need to sell a car in {area.name}? {site.name} buys cars, utes, vans and 4WDs in any condition, and our local tow
            trucks pick up free from anywhere in {area.name} — your driveway, workplace or the roadside.
          </p>
          <p>
            Call <a href={site.phoneHref}>{site.phoneDisplay}</a> or send your car&apos;s details in the form below for a
            fast cash offer.
          </p>
        </div>
      </section>

      <section className="container-site py-12">
        <ContentBlocks
          blocks={[
            {
              heading: `Suburbs we cover in ${area.name}`,
              paras: [`${area.suburbs.join(", ")} and surrounding suburbs. Don't see yours? Call us — we probably still cover it.`],
            },
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
        <p className="mt-8">
          Also servicing{" "}
          {areas.filter((a) => a.slug !== area.slug).map((a, i, arr) => (
            <span key={a.slug}>
              <Link href={`/locations/${a.slug}`} className="font-semibold text-green hover:underline">{a.name}</Link>
              {i < arr.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
        <div className="mt-12">
          <CallUsAndTerms />
        </div>
      </section>

      <AskForPrice />
      <ReviewsBand />
      <MakesRow />
    </>
  );
}
