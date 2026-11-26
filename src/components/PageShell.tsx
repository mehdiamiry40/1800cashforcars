import Image from "next/image";
import pickupPhoto from "@/assets/hero-kangaroo-tow.jpg";
import { serviceVisuals } from "@/lib/vehicle-visuals";
import { AreaHero } from "./AreaPage";
import { AskForPrice, FinalCta, ReviewsBand } from "./Blocks";
import { GoogleReviewsSignal } from "./GoogleReviewsSignal";
import { BreadcrumbTrail, Breadcrumbs } from "./JsonLd";
import { QuoteForm, QuoteFormHeading } from "./QuoteForm";
import { QuoteLink } from "./QuoteLink";
import type { RooProps } from "./Roo";
import { ArrowIcon, PhoneIcon } from "./icons";
import { site } from "@/lib/site";

/** Link styling for text in the navy page hero. */
export const heroLinkClass = "font-semibold text-white underline underline-offset-4";

export function PageShell({
  title,
  crumb = title,
  path,
  intro,
  introNote,
  forms = true,
  cardFirst = false,
  children,
}: {
  title: string;
  /** Breadcrumb name, when the H1 is longer than the page's short name. */
  crumb?: string;
  path: string;
  intro?: string;
  /** One line under the intro. Links in it should use `heroLinkClass`. */
  introNote?: React.ReactNode;
  roo?: RooProps;
  forms?: boolean;
  /**
   * The location-page layout: the copy on the left and the quote card on the right, in the first desktop
   * screen. The standard layout puts the card under the hero, about 820px down a 1280 screen.
   */
  cardFirst?: boolean;
  children: React.ReactNode;
}) {
  const visual = serviceVisuals[path];
  const trail = [{ name: crumb, path }];
  if (cardFirst) {
    return (
      <>
        <Breadcrumbs trail={trail} />
        <AreaHero h1={title}>
          {intro && <p className="mt-4 text-[18px] leading-relaxed">{intro}</p>}
          {introNote && <p className="mt-3 text-[18px] leading-relaxed">{introNote}</p>}
          <div className="mt-4 flex flex-wrap gap-3" data-cta>
            <QuoteLink from="page-title" className="btn-brand">
              Get a free quote <ArrowIcon aria-hidden="true" className="h-5 w-5" />
            </QuoteLink>
            <a href={site.phoneHref} className="btn-line">
              <PhoneIcon aria-hidden="true" className="h-5 w-5" />
              Call {site.phoneDisplay}
            </a>
          </div>
        </AreaHero>
        <BreadcrumbTrail band trail={trail} />
        <section className="container-site section-site">
          <div className="min-w-0 max-w-3xl">{children}</div>
        </section>
        <div className="hidden lg:block">
          <AskForPrice />
        </div>
        <ReviewsBand />
        <FinalCta />
      </>
    );
  }
  return (
    <>
      <Breadcrumbs trail={trail} />
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
            {introNote && (
              <p className="mt-3 max-w-xl text-[16px] leading-relaxed">
                {introNote}
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
      <BreadcrumbTrail band trail={trail} />
      <section
        className={`container-site section-site grid gap-12 lg:gap-16 ${forms ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : ""}`}
      >
        {forms && (
          <aside className="min-w-0 lg:col-start-2 lg:row-start-1">
            <div
              id="quote"
              data-quote
              className="quote-box page-quote quote-panel scroll-mt-32 lg:sticky lg:top-32"
            >
              <QuoteFormHeading className="h-sub quote-head" />
              <GoogleReviewsSignal />
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
      <ReviewsBand />
      <FinalCta />
    </>
  );
}
