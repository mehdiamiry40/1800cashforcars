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
    <section aria-label="Cash for cars and free quote" className="overflow-hidden border-b-4 border-brand bg-white">
      <div className="container-site grid items-start gap-x-8 gap-y-5 pb-9 pt-6 sm:pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] md:grid-rows-[auto_auto_1fr] md:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,390px)] lg:gap-x-14 lg:py-12">
        <div className="flex min-w-0 flex-col text-center text-navy sm:text-left md:col-start-1 md:row-start-1">
          <p className="mb-3 hidden items-center gap-2.5 font-heading text-[14px] font-bold uppercase tracking-[0.14em] text-body md:flex">
            <span aria-hidden="true" className="h-0.5 w-8 bg-brand" /> Free car removal
          </p>
          <h1 className="font-heading text-[32px] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] sm:text-[40px] lg:text-[52px]">
            {copy.title} <span className="mt-2 block text-[24px] leading-[1.12] tracking-normal text-brand sm:text-[28px] lg:text-[30px]">{copy.lead}</span>
          </h1>
          <Image
            src={heroPhoto}
            alt="A white tow truck carrying an old blue car, with cash in the foreground on a white background"
            preload
            sizes="(min-width: 1120px) 626px, (min-width: 1024px) calc(100vw - 494px), (min-width: 768px) calc(100vw - 420px), calc(100vw - 40px)"
            quality={75}
            placeholder="blur"
            className="order-first mb-4 h-auto w-full md:order-last md:mb-0 md:mt-5"
          />
        </div>

        <div className="md:col-start-1 md:row-start-3">
          <ul className="grid grid-cols-3 gap-2 border-y border-line py-3 font-heading text-[13px] font-bold leading-snug text-navy sm:text-[15px] md:max-w-lg md:gap-4 md:py-4">
            {copy.points.map((p) => (
              <li key={p} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:text-left">
                <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" /> {p}
              </li>
            ))}
          </ul>
          <a href={site.phoneHref} className="mt-5 hidden min-h-12 w-fit items-center gap-3 border border-line bg-white px-4 py-2.5 font-heading font-bold text-navy transition-colors hover:border-brand hover:bg-sand md:inline-flex">
            <PhoneIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-brand" />
            <span><span className="mr-2 text-[14px] font-normal text-body">Prefer to talk?</span>{" "}{site.phoneDisplay}</span>
          </a>
        </div>

        <div
          id="quote"
          data-quote
          className="w-full scroll-mt-24 border border-line border-t-4 border-t-brand bg-white p-5 shadow-[0_12px_40px_rgba(15,29,51,0.08)] sm:p-6 md:col-start-2 md:row-span-3 md:row-start-1 md:self-center"
        >
          <p className="mb-1 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-brand">Your car. Your free quote.</p>
          <h2 className="font-heading text-[28px] font-extrabold leading-tight text-ink">Get a free quote</h2>
          <p className="mb-4 mt-2 flex items-start gap-2 text-[14px] leading-snug text-body">
            <ClockIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>We&apos;ll text you a price, usually within the hour.</span>
          </p>
          <QuoteForm variant="compact" />
          <a href={site.phoneHref} className="mt-4 flex min-h-11 items-center justify-center gap-2 border-t border-line pt-3 font-heading text-[16px] font-bold text-ink transition-colors hover:text-brand md:hidden">
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
