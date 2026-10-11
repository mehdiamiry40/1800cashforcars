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
      <section className="page-hero relative bg-navy text-white">
        <div className="mx-auto grid max-w-7xl md:grid-cols-[1.2fr_1fr]">
          <div className="page-hero-media relative aspect-[16/9] overflow-hidden bg-white md:order-2 md:aspect-auto md:min-h-80">
            <Image
              src={visual?.image ?? pickupPhoto}
              alt={
                visual?.alt ??
                "An old car on a tow truck in a Queensland street"
              }
              fill
              preload
              placeholder="blur"
              sizes="(max-width: 767px) 96px, (pointer: coarse) and (max-width: 1023px) 96px, 45vw"
              style={{ objectFit: visual ? "contain" : "cover" }}
              className={
                visual ? "object-contain" : "object-cover object-[75%_50%]"
              }
            />
          </div>
          <div className="page-hero-copy container-site py-8 sm:py-14 md:order-1">
            <h1 className="font-heading text-[34px] font-bold leading-tight sm:text-[42px] lg:text-[52px]">
              {title}
            </h1>
            {intro && (
              <p className="mt-5 max-w-xl text-[18px] leading-relaxed sm:text-[20px]">
                {intro}
              </p>
            )}
            {forms && (
              <div className="page-hero-actions mt-7 flex flex-wrap gap-3">
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
        {forms && (
          <aside className="min-w-0 lg:col-start-2 lg:row-start-1">
            <div
              id="quote"
              data-quote
              className="page-quote quote-panel scroll-mt-32 lg:sticky lg:top-32"
            >
              <h2 className="h-sub mb-5">Get a free quote</h2>
              <QuoteForm />
            </div>
          </aside>
        )}
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">{children}</div>
      </section>
      {forms && (
        <div className="hidden lg:block">
          <AskForPrice />
        </div>
      )}
      <FinalCta />
    </>
  );
}
