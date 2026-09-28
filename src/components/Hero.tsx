import { heroCopy } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { Roo } from "./Roo";
import { CheckIcon, PhoneIcon } from "./icons";

export function Hero({ where }: { where?: string }) {
  const copy = heroCopy(where);
  return (
    <>
      <section className="relative overflow-hidden bg-sand">
        {/* outback backdrop: sun and rolling hills */}
        <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-[#F7C873]/45 sm:right-[8%]" />
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full" preserveAspectRatio="none" viewBox="0 0 1200 160">
          <path d="M0 110 C 200 60, 380 70, 560 100 C 760 135, 960 70, 1200 90 V160 H0 Z" fill="#F3E3C8" />
          <path d="M0 135 C 260 105, 520 120, 760 138 C 940 150, 1080 128, 1200 130 V160 H0 Z" fill="#EAD3AE" />
        </svg>

        <div className="container-site relative grid items-center gap-6 pb-28 pt-10 sm:pb-32 sm:pt-14 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="font-heading text-[42px] font-black leading-[1.02] tracking-[-0.03em] text-ink min-[400px]:text-[48px] sm:text-[64px]">
              {copy.title} <span className="block text-rust">{copy.lead}</span>
            </h1>
            <p className="mt-5 max-w-md text-[18px] sm:text-[20px]">{copy.sub}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="btn-brand !px-7 !py-4 !text-[18px]">Get my price</a>
              <a href={site.phoneHref} className="btn-line !px-7 !py-4 !text-[18px]">
                <PhoneIcon className="h-5 w-5 text-brand" /> {site.phoneDisplay}
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-heading text-[15px] font-extrabold text-ink">
              {copy.points.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4 text-brand" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[380px] md:max-w-[420px]">
            <Roo pouchCar className="w-full drop-shadow-sm" title="Roo the kangaroo with a car in his pouch" />
          </div>
        </div>
      </section>

      <section id="quote" className="relative z-10 -mt-20 scroll-mt-24">
        <div className="container-site">
          <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_20px_60px_-20px_rgba(29,36,51,0.35)] ring-1 ring-line sm:p-9">
            <h2 className="font-heading text-[28px] font-black tracking-[-0.02em] text-ink sm:text-[32px]">What&apos;s your car worth?</h2>
            <p className="mt-1">Tell us a little about it. We usually reply within the hour.</p>
            <div className="mt-6">
              <QuoteForm variant="compact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
