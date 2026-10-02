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
      {/* Background photo. On phones it sits behind the headline (truck, car and kangaroo in view) and fades into the
          navy behind the form; on desktop it fills the hero. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[360px] min-[400px]:h-[380px] sm:h-[440px] md:inset-0 md:h-auto">
        <Image
          src={heroPhoto}
          alt="A kangaroo holding Australian cash beside a tow truck carrying an old broken-down car"
          fill
          preload
          sizes="100vw"
          quality={75}
          placeholder="blur"
          className="object-cover object-[58%_70%] md:object-[50%_60%]"
        />
        {/* Keeps the headline readable over the photo. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-navy-950/35 via-navy-950/10 via-45% to-navy md:bg-gradient-to-r md:from-navy-950/90 md:from-30% md:via-navy-950/70 md:via-50% md:to-navy-950/20 md:to-70%" />
      </div>

      {/* Phones: headline, then a gap where the photo shows, then the form, then the details.
          Desktop: headline and details stacked on the left, form on the right. */}
      <div className="container-site grid items-start gap-x-10 gap-y-7 pb-10 pt-8 sm:pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,430px)] md:grid-rows-[1fr_auto_1fr] md:gap-y-0 md:py-16">
        <div className="min-h-[300px] text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.7),0_4px_18px_rgba(0,0,0,0.6)] min-[400px]:min-h-[320px] sm:min-h-[380px] md:col-start-1 md:row-start-1 md:min-h-0 md:self-end md:[text-shadow:none]">
          <h1 className="font-heading text-[23px] font-extrabold uppercase leading-[1.08] min-[400px]:text-[26px] sm:text-[40px] sm:leading-[1.05] lg:text-[46px]">
            {copy.title} <span className="block sm:text-brand-light">{copy.lead}</span>
          </h1>
        </div>

        <div
          id="quote"
          data-quote
          className="scroll-mt-24 border-2 border-ink bg-white p-5 shadow-[6px_6px_0_#1d2433] md:col-start-2 md:row-span-3 md:row-start-1 md:max-w-[400px] md:self-center md:justify-self-end"
        >
          <h2 className="font-heading text-[23px] font-extrabold leading-tight text-ink">Get an Instant Quote</h2>
          <p className="mb-3.5 mt-0.5 text-[15px] leading-snug">We&apos;ll text you a price, usually within the hour.</p>
          <QuoteForm variant="compact" />
        </div>

        <div className="text-white md:col-start-1 md:row-start-2">
          <p className="max-w-md font-heading text-[15px] font-semibold leading-snug tracking-[0.01em] text-white/85 sm:font-sans sm:text-[20px] sm:font-normal sm:leading-relaxed sm:tracking-normal sm:text-white/90 md:mt-4">{copy.sub}</p>
          <ul className="mt-5 grid gap-1.5 font-heading text-[16px] font-extrabold sm:mt-6">
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
      </div>

    </section>
  );
}
