import Image from "next/image";
import heroPhoto from "@/assets/hero-tow-truck.jpg";
import { heroCopy } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { CheckIcon, PhoneIcon } from "./icons";

// Photo background with the headline on the left and the quote form beside it (straight under it on phones).
export function Hero({ where, title, lead, sub }: { where?: string; title?: string; lead?: string; sub?: string }) {
  const copy = heroCopy(where, { title, lead, sub });
  return (
    <section className="relative isolate overflow-hidden border-b-4 border-ink bg-navy">
      <Image
        src={heroPhoto}
        alt=""
        fill
        preload
        sizes="100vw"
        quality={55}
        placeholder="blur"
        className="-z-20 object-cover object-[70%_center]"
      />
      {/* Darkens the photo behind the text so the headline stays readable. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy-950/70 md:bg-transparent md:bg-gradient-to-r md:from-navy-950/90 md:via-navy-950/70 md:to-navy-950/30" />

      <div className="container-site grid items-start gap-x-10 gap-y-7 pb-12 pt-8 sm:pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,430px)] md:py-16">
        <div className="text-white md:self-center">
          <h1 className="font-heading text-[38px] font-extrabold leading-[1] tracking-[-0.01em] min-[400px]:text-[44px] sm:text-[56px] lg:text-[64px]">
            {copy.title} <span className="block text-brand-light">{copy.lead}</span>
          </h1>
          <p className="mt-4 max-w-md text-[17px] text-white/90 sm:text-[20px]">{copy.sub}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-heading text-[15px] font-extrabold">
            {copy.points.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-brand-light" /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[15px] text-white/85">
            Prefer to talk?{" "}
            <a href={site.phoneHref} className="inline-flex items-center gap-1 font-bold text-white underline underline-offset-2">
              <PhoneIcon className="h-4 w-4 text-brand-light" /> Call us, 24/7
            </a>
          </p>
        </div>

        <div id="quote" data-quote className="scroll-mt-24 border-2 border-ink bg-white p-5 shadow-[6px_6px_0_#1d2433] sm:p-6">
          <h2 className="font-heading text-[26px] font-extrabold leading-tight text-ink sm:text-[28px]">Get a price for your car</h2>
          <p className="mb-4 mt-1 text-[16px] leading-snug">No phone call needed. We&apos;ll text you a price, usually within the hour.</p>
          <QuoteForm variant="compact" />
        </div>
      </div>
    </section>
  );
}
