import Image from "next/image";
import heroPhoto from "@/assets/hero-kangaroo-tow.jpg";
import { heroCopy } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { CheckIcon, PhoneIcon } from "./icons";

// Photo background with the headline on the left and the quote form beside it (straight under it on phones).
export function Hero({ where, title, lead, sub }: { where?: string; title?: string; lead?: string; sub?: string }) {
  const copy = heroCopy(where, { title, lead, sub });
  return (
    <section className="relative isolate overflow-hidden border-b-4 border-ink bg-navy">
      <div className="container-site grid items-start gap-x-10 gap-y-7 pb-8 pt-8 sm:pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,430px)] md:py-16">
        <div className="text-white md:self-center">
          <h1 className="font-heading text-[28px] font-extrabold uppercase leading-[1.05] min-[400px]:text-[32px] sm:text-[40px] lg:text-[46px]">
            {copy.title} <span className="block text-brand-light">{copy.lead}</span>
          </h1>
          <p className="mt-4 max-w-md text-[17px] text-white/90 sm:text-[20px]">{copy.sub}</p>
          <ul className="mt-6 grid gap-1.5 font-heading text-[16px] font-extrabold">
            {copy.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 shrink-0 text-brand-light" /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[15px] text-white/85">
            Prefer to talk?{" "}
            <a href={site.phoneHref} className="inline-flex items-center gap-1 font-bold text-white underline underline-offset-2">
              <PhoneIcon className="h-4 w-4 text-brand-light" /> Call us
            </a>
          </p>
        </div>

        <div id="quote" data-quote className="scroll-mt-24 border-2 border-ink bg-white p-5 shadow-[6px_6px_0_#1d2433] md:max-w-[400px] md:justify-self-end">
          <h2 className="font-heading text-[23px] font-extrabold leading-tight text-ink">Get an Instant Quote</h2>
          <p className="mb-3.5 mt-0.5 text-[15px] leading-snug">We&apos;ll text you a price, usually within the hour.</p>
          <QuoteForm variant="compact" />
        </div>
      </div>

      {/* One photo: a full-colour strip under the quote form on phones, the whole hero background on desktop. */}
      <div className="relative h-52 min-[400px]:h-60 md:absolute md:inset-0 md:-z-10 md:h-auto">
        <Image
          src={heroPhoto}
          alt="A kangaroo holding Australian cash beside a tow truck carrying an old broken-down car"
          fill
          preload
          sizes="100vw"
          quality={75}
          placeholder="blur"
          className="object-cover object-[50%_70%] md:object-[50%_60%]"
        />
        {/* Darkens the photo behind the headline on desktop; on phones it fades the top of the strip into the navy. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-navy/80 to-transparent to-40% md:bg-gradient-to-r md:from-navy-950/90 md:from-25% md:via-navy-950/60 md:via-45% md:to-navy-950/10 md:to-65%" />
      </div>
    </section>
  );
}
