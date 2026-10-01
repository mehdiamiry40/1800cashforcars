import { heroCopy } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { HeroScene } from "./HeroScene";
import { CheckIcon, PhoneIcon } from "./icons";

// The quote form sits in the hero: beside the headline on desktop, straight under it on phones.
export function Hero({ where, title, lead, sub }: { where?: string; title?: string; lead?: string; sub?: string }) {
  const copy = heroCopy(where, { title, lead, sub });
  return (
    <section className="relative overflow-hidden border-b-4 border-ink bg-sand">
      <div className="container-site grid items-start gap-x-10 gap-y-7 pb-12 pt-7 sm:pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,430px)] md:grid-rows-[auto_1fr] md:pb-14">
        <div className="md:col-start-1 md:row-start-1">
          <h1 className="font-heading text-[38px] font-extrabold leading-[1] tracking-[-0.01em] text-ink min-[400px]:text-[44px] sm:text-[56px] lg:text-[64px]">
            {copy.title} <span className="block text-brand">{copy.lead}</span>
          </h1>
          <p className="mt-4 max-w-md text-[17px] sm:text-[20px]">{copy.sub}</p>
        </div>

        <div
          id="quote"
          data-quote
          className="scroll-mt-24 border-2 border-ink bg-white p-5 shadow-[6px_6px_0_#1d2433] sm:p-6 md:col-start-2 md:row-span-2 md:row-start-1"
        >
          <h2 className="font-heading text-[26px] font-extrabold leading-tight text-ink sm:text-[28px]">Get a price for your car</h2>
          <p className="mb-4 mt-1 text-[16px] leading-snug">No phone call needed. We&apos;ll text you a price, usually within the hour.</p>
          <QuoteForm variant="compact" />
        </div>

        <div className="md:col-start-1 md:row-start-2">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-heading text-[15px] font-extrabold text-ink">
            {copy.points.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-brand" /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[15px]">
            Prefer to talk?{" "}
            <a href={site.phoneHref} className="inline-flex items-center gap-1 font-bold text-ink underline underline-offset-2">
              <PhoneIcon className="h-4 w-4 text-brand" /> Call us, 24/7
            </a>
          </p>
          <HeroScene className="mx-auto mt-6 w-full max-w-[360px] md:mx-0 md:max-w-[520px]" />
        </div>
      </div>
    </section>
  );
}
