import Image from "next/image";
import heroPhoto from "@/assets/hero-car-truck-cash.png";
import { heroCopy } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { CheckIcon, ClockIcon, PhoneIcon } from "./icons";

// A clean white studio image keeps the car, tow truck and cash visible without competing with the copy.
export function Hero({ where, title, lead, sub }: { where?: string; title?: string; lead?: string; sub?: string }) {
  const copy = heroCopy(where, { title, lead, sub });
  return (
    <section aria-label="Cash for cars and free quote" className="overflow-hidden border-b border-line bg-white">
      <div className="container-site grid items-start gap-x-8 gap-y-5 pb-9 pt-6 sm:pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] md:grid-rows-[auto_auto_1fr] md:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,390px)] lg:gap-x-14 lg:py-12">
        <div className="flex min-w-0 flex-col text-center text-navy sm:text-left md:col-start-1 md:row-start-1">
          <p className="eyebrow mb-4 hidden items-center gap-2.5 md:flex">
            <span aria-hidden="true" className="h-0.5 w-8 bg-brand" /> Free car removal
          </p>
          <h1 className="h-page">
            {copy.title} <span className="mt-3 block text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-brand sm:text-[26px] lg:text-[28px]">{copy.lead}</span>
          </h1>
          <Image
            src={heroPhoto}
            alt="A white tow truck carrying an old blue car, with cash in the foreground on a white background"
            preload
            sizes="(min-width: 1160px) 666px, (min-width: 1024px) calc(100vw - 494px), (min-width: 768px) calc(100vw - 420px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 40px)"
            quality={75}
            placeholder="blur"
            className="order-first mb-4 h-auto w-full md:order-last md:mb-0 md:mt-5"
          />
        </div>

        <div className="md:col-start-1 md:row-start-3">
          <ul className="grid grid-cols-3 gap-2 border-y border-line py-3 text-[12px] font-semibold leading-snug text-navy sm:text-[13px] md:gap-4 md:py-4">
            {copy.points.map((p) => (
              <li key={p} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:text-left">
                <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" /> {p}
              </li>
            ))}
          </ul>
          <a href={site.phoneHref} className="btn-line mt-5 hidden w-fit md:inline-flex">
            <PhoneIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-brand" />
            <span><span className="mr-2 text-[14px] font-normal text-body">Prefer to talk?</span>{" "}{site.phoneDisplay}</span>
          </a>
        </div>

        <div
          id="quote"
          data-quote
          className="quote-panel w-full scroll-mt-24 md:col-start-2 md:row-span-3 md:row-start-1 md:self-center"
        >
          <p className="eyebrow mb-2">Your car. Your free quote.</p>
          <h2 className="h-sub">Get a free quote</h2>
          <p className="mb-4 mt-2 flex items-start gap-2 text-[14px] leading-snug text-body">
            <ClockIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>We&apos;ll text you a price, usually within the hour.</span>
          </p>
          <QuoteForm variant="compact" />
          <a href={site.phoneHref} className="mt-4 flex min-h-11 items-center justify-center gap-2 border-t border-line pt-3 text-[14px] font-bold text-navy transition-colors hover:text-brand md:hidden">
            <PhoneIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" /> Call {site.phoneDisplay}
          </a>
        </div>

        <div className="md:col-start-1 md:row-start-2">
          <p className="max-w-lg text-[16px] leading-relaxed text-body sm:text-[18px]">{copy.sub}</p>
        </div>
      </div>
    </section>
  );
}
