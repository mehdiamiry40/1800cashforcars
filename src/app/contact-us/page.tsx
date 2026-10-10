import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { Breadcrumbs } from "@/components/JsonLd";
import { PhoneIcon, SmsIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} for a free cash offer and free car removal. Send us your car's details for a free price, or call us.`,
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Contact us", path: "/contact-us" }]} />
      <section className="container-site grid gap-12 py-14 md:grid-cols-[1fr_1.5fr] md:gap-16 md:py-20">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1 className="h-page mt-3">
            <span className="text-brand">Let’s talk</span> about your car.
          </h1>
          <p className="mt-5 text-[20px]">
            Selling an old car? Call, text or send us your vehicle’s details for
            a free quote.
          </p>
          <a
            href={site.phoneHref}
            className="mt-8 inline-flex min-h-11 items-center gap-3 text-[28px] font-bold"
          >
            <PhoneIcon aria-hidden="true" className="h-5 w-5 text-brand" />
            {site.phoneDisplay}
          </a>
          {site.smsNumber && (
            <p className="mt-3">
              <a
                href={`sms:${site.smsNumber}`}
                className="inline-flex min-h-11 items-center gap-3 font-semibold underline underline-offset-4"
              >
                <SmsIcon aria-hidden="true" className="h-5 w-5 text-brand" />
                Send us a text
              </a>
            </p>
          )}
          <dl className="mt-8 space-y-5 border-t border-line pt-8">
            {site.showEmail && (
              <div>
                <dt className="text-[16px] font-semibold">Email</dt>
                <dd className="mt-1 break-all">
                  <a
                    href={`mailto:${site.email}`}
                    className="underline underline-offset-4"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-[16px] font-semibold">Pickups</dt>
              <dd className="mt-1">{site.pickups}</dd>
            </div>
            {site.address && (
              <div>
                <dt className="text-[16px] font-semibold">Our yard</dt>
                <dd className="mt-1">
                  {site.address}
                  <br />
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                  >
                    Get directions
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div
          id="quote"
          data-quote
          className="min-w-0 scroll-mt-32 self-start md:px-6 lg:px-10"
        >
          <h2 className="h-sub mb-6">Get a free quote</h2>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
