import Image from "next/image";
import Link from "next/link";
import pickupPhoto from "@/assets/hero-kangaroo-tow.jpg";
import { serviceVisuals } from "@/lib/vehicle-visuals";
import { AskForPrice, FinalCta } from "./Blocks";
import { Breadcrumbs } from "./JsonLd";
import { QuoteForm } from "./QuoteForm";
import { QuoteLink } from "./QuoteLink";
import type { RooProps } from "./Roo";
import { ArrowIcon, PhoneIcon } from "./icons";
import { site } from "@/lib/site";

export function PageShell({
  title,
  path,
  intro,
  forms = true,
  children,
}: {
  title: string;
  path: string;
  intro?: string;
  roo?: RooProps;
  forms?: boolean;
  children: React.ReactNode;
}) {
  const visual = serviceVisuals[path];
  return (
    <>
      <Breadcrumbs trail={[{ name: title, path }]} />
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl md:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[16/9] overflow-hidden bg-white md:order-2 md:aspect-auto md:min-h-80">
            <Image
              src={visual?.image ?? pickupPhoto}
              alt={
                visual?.alt ??
                "An old car on a tow truck in a Queensland street"
              }
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 768px) 45vw, 100vw"
              className={
                visual ? "object-contain" : "object-cover object-[75%_50%]"
              }
            />
          </div>
          <div className="px-5 py-10 sm:px-10 sm:py-14 md:order-1 lg:px-12">
            <h1 className="font-heading text-[42px] font-bold leading-tight lg:text-[52px]">
              {title}
            </h1>
            {intro && (
              <p className="mt-5 max-w-xl text-[20px] leading-relaxed">
                {intro}
              </p>
            )}
            {forms && (
              <div className="mt-7 flex flex-wrap gap-3">
                <QuoteLink from="page-title" className="btn-brand">
                  Get a free quote{" "}
                  <ArrowIcon aria-hidden="true" className="h-5 w-5" />
                </QuoteLink>
                <a
                  href={site.phoneHref}
                  className="btn border border-white text-white hover:bg-white hover:text-navy"
                >
                  <PhoneIcon aria-hidden="true" className="h-5 w-5" />
                  {site.phoneDisplay}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
      <nav aria-label="Breadcrumb" className="border-b border-line">
        <div className="container-site flex flex-wrap items-center gap-2 py-4 text-[16px]">
          <Link href="/" className="inline-flex min-h-11 items-center">
            Home
          </Link>
          <span aria-hidden="true" className="text-brand">
            ›
          </span>
          <span className="font-semibold">{title}</span>
        </div>
      </nav>
      <section
        className={`container-site section-site grid gap-12 lg:gap-16 ${forms ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : ""}`}
      >
        <div className="min-w-0">{children}</div>
        {forms && (
          <aside className="hidden min-w-0 lg:block">
            <div
              data-quote
              className="quote-panel scroll-mt-32 lg:sticky lg:top-32"
            >
              <h2 className="h-sub">Get a free quote</h2>
              <p className="mb-6 mt-3">
                A price by text, usually within the hour.
              </p>
              <QuoteForm variant="compact" />
            </div>
          </aside>
        )}
      </section>
      {forms && <AskForPrice />}
      <FinalCta />
    </>
  );
}
