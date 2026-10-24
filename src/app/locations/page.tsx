import type { Metadata } from "next";
import Link from "next/link";
import { BrisbaneSuburbs, CallUsAndTerms } from "@/components/Blocks";
import { ArrowIcon, PinIcon } from "@/components/icons";
import { PageShell } from "@/components/PageShell";
import { areaHref, areas, pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Areas We Cover in South East QLD",
  description:
    "We buy cars and offer free car removal across Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads. Find your area and suburbs.",
  alternates: { canonical: "/locations" },
  openGraph: pageOpenGraph("/locations"),
};

// Brisbane has no `local` copy (it has dedicated pages), so it gets its own blurb here.
const brisbaneIntro =
  "Our yard is in Rocklea, so we cover every part of Brisbane: northside, southside, the western suburbs and the bayside. Pickups are usually within a day or two.";

export default function LocationsPage() {
  return (
    <PageShell
      title="Areas we cover"
      path="/locations"
      intro="Brisbane, the Gold Coast and South East Queensland. Free pickup everywhere we go."
    >
      <div className="prose-site mb-10 text-[18px] [&>p:first-child]:mt-0">
        <p>
          We buy cars, utes, vans, 4WDs and trucks in any condition and tow them away for free from our yard in Rocklea.
          Pick your area to see the suburbs we cover and anything local to know.
        </p>
      </div>
      <ul className="grid gap-5">
        {areas.map((a) => (
          <li key={a.slug} className="border border-line bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-heading text-[24px] font-semibold leading-tight text-navy">
              <PinIcon aria-hidden="true" className="h-6 w-6 shrink-0 text-brand" />
              {a.name}, {a.state}
            </h2>
            <p className="mt-3">{a.local?.intro ?? brisbaneIntro}</p>
            <p className="mt-3 text-[15px]">
              <span className="font-semibold">Suburbs include:</span> {a.suburbs.join(", ")}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6">
              {/* Brisbane's cash-for-cars page is the homepage; its removal page is the area link. */}
              {(a.href
                ? [{ href: "/", label: `Cash for cars ${a.name}` }, { href: areaHref(a), label: `Car removal ${a.name}` }]
                : [{ href: areaHref(a), label: `Cash for cars ${a.name}` }]
              ).map((l) => (
                <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center gap-2 font-semibold text-navy underline underline-offset-2">
                  {l.label}
                  <ArrowIcon aria-hidden="true" className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <h2 className="h-content">Brisbane suburbs we cover</h2>
        <p className="mt-3">Select a region for suburbs.</p>
        <BrisbaneSuburbs narrow />
      </div>
      <div className="mt-12">
        <CallUsAndTerms />
      </div>
    </PageShell>
  );
}
