import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm, QuoteFormHeading } from "@/components/QuoteForm";
import { Faq } from "@/components/Blocks";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { ParentBrandLine } from "@/components/ParentBrand";
import { PhoneIcon, SmsIcon } from "@/components/icons";
import { areaHref, areas, pageOpenGraph, site, yardHoursSentence } from "@/lib/site";

const PATH = "/contact-us";

// Questions about getting in touch, written for this page. The price, paperwork and payment answers
// are the homepage's, and they stay there. Nothing here is new: the yard hours, the phone number and the
// two turnaround lines come from site.ts, and the pickup days are the ones in `site.pickups`.
const contactFaqs = [
  {
    q: "When is the yard open, and when do you pick up?",
    a: `The yard is open ${yardHoursSentence()}. Pickups run Monday to Saturday, at a time that suits you.`,
  },
  {
    q: "What should I send to get a price?",
    a: `Send the make, model and year, the suburb the car is in, and what condition it is in. A few photos help. Say if the car has no keys or no wheels. You can put all of that in the quote form on this page, or text it to ${site.phoneDisplay}.`,
  },
  {
    q: "How soon will I hear back?",
    a: `We text or call you with a price, ${site.quoteTurnaround}. Once you accept it, pickups are ${site.pickupTurnaround}, and you choose the time.`,
  },
];

export const metadata: Metadata = {
  title: "Contact Us, Rocklea Yard",
  description: `Contact ${site.name} for a cash offer and free car removal. Call or text ${site.phoneDisplay}, or send your car's details. Quotes ${site.quoteTurnaround}.`,
  alternates: { canonical: PATH },
  openGraph: pageOpenGraph(PATH),
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: contactFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Contact us", path: PATH }]} />
      <JsonLd data={faqLd} />
      <section className="container-site grid gap-8 py-10 sm:py-14 md:grid-cols-[1fr_1.5fr] md:gap-x-16 md:py-20">
        <div className="md:col-start-1 md:row-start-1">
          <p className="eyebrow">Get in touch</p>
          <h1 className="h-page mt-3">
            <span className="text-brand">Contact</span> us
          </h1>
          <p className="mt-4 text-[18px] leading-relaxed sm:mt-5 sm:text-[20px]">
            Selling an old, scrap or damaged car? Call, text or send the details for a free quote. Quotes are {site.quoteTurnaround}.
          </p>
          <p className="mt-4 text-[18px] leading-relaxed">
            {site.name} is part of A Plus Car Removal and shares the yard at {site.address}. {site.licenceLine} Our ABN is {site.abn}. The yard is listed on Google as A Plus Car Removal.
          </p>
          <a href={site.phoneHref} className="mt-8 inline-flex min-h-11 items-center gap-3 text-[28px] font-bold">
            <PhoneIcon aria-hidden="true" className="h-5 w-5 text-brand" />
            {site.phoneDisplay}
          </a>
          {site.smsNumber && (
            <p className="mt-3">
              <a href={`sms:${site.smsNumber}`} className="inline-flex min-h-11 items-center gap-3 font-semibold underline underline-offset-4">
                <SmsIcon aria-hidden="true" className="h-5 w-5 text-brand" />
                Send us a text
              </a>
            </p>
          )}
          <p className="mt-4 text-[18px] leading-relaxed">
            A text can include the make, model, year, suburb and a few photos. Say if the car has{" "}
            <Link href="/car-removal-no-keys-no-wheels" className="font-semibold underline underline-offset-4">
              no keys or no wheels
            </Link>
            . We use that to price the car you actually have.
          </p>
        </div>
        <div id="quote" data-quote className="quote-box min-w-0 scroll-mt-32 self-start md:col-start-2 md:row-span-2 md:row-start-1">
          <QuoteFormHeading className="h-sub mb-6" />
          <QuoteForm />
        </div>
        <div className="md:col-start-1 md:row-start-2">
          <ParentBrandLine className="mb-4" />
          <dl className="space-y-5 border-t border-line pt-6">
            {/* The yard comes first, so the street address and directions sit above the hours. */}
            {site.address && (
              <div>
                <dt className="text-[16px] font-semibold">Our yard</dt>
                <dd className="mt-1">
                  {site.address}
                  <br />
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                    Get directions
                  </a>
                </dd>
              </div>
            )}
            {site.showEmail && (
              <div>
                <dt className="text-[16px] font-semibold">Email</dt>
                <dd className="mt-1 break-all">
                  <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                    {site.email}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-[16px] font-semibold">Pickups</dt>
              <dd className="mt-1">{site.pickups}. Pickups are {site.pickupTurnaround}. You choose the time.</dd>
            </div>
            <div>
              <dt className="text-[16px] font-semibold">Yard hours</dt>
              <dd className="mt-1">
                <ul>
                  {site.hours.flatMap((block) =>
                    block.days.map((day) => (
                      <li key={day}>
                        {day} {block.opens}–{block.closes}
                      </li>
                    )),
                  )}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-[16px] font-semibold">Licence and ABN</dt>
              <dd className="mt-1">
                {site.licenceLine} ABN {site.abn}.
              </dd>
            </div>
            <div>
              <dt className="text-[16px] font-semibold">Areas we cover</dt>
              <dd className="mt-1">
                <ul>
                  {areas.map((area) => (
                    <li key={area.slug}>
                      <Link href={areaHref(area)} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <div className="mt-8">
            <h2 className="h-sub">Contact questions</h2>
            <p className="mt-3 text-[18px] leading-relaxed">
              When the yard is open, what to send us, and how soon you hear back. Towing is always free and is never deducted. Payment is before the car leaves.
            </p>
            <Faq bare items={contactFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}
