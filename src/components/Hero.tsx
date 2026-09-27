import Image from "next/image";
import { heroCopy, heroImages } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { CheckIcon, PhoneIcon, SmsIcon } from "./icons";

export function Hero({ place }: { place?: string }) {
  const copy = heroCopy(place);
  return (
    <section className="bg-paper">
      <div className="container-site grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-16">
        <div className="lg:pt-4">
          <h1 className="font-heading text-[40px] font-black leading-[1.04] tracking-[-0.02em] text-ink sm:text-[52px]">
            {copy.title} <span className="block text-brand-dark">{copy.lead}</span>
          </h1>
          <p className="mt-5 max-w-xl text-[19px]">{copy.sub}</p>
          <ul className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 font-semibold text-ink">
            {copy.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 shrink-0 text-money" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.phoneHref} className="btn-brand !px-6 !py-4 !text-[19px]">
              <PhoneIcon className="h-5 w-5" /> Call {site.phoneDisplay}
            </a>
            {site.smsNumber && (
              <a href={`sms:${site.smsNumber}`} className="btn-line !px-6 !py-4 !text-[19px]">
                <SmsIcon className="h-5 w-5" /> Text us a photo
              </a>
            )}
          </div>
        </div>

        <div id="hero-quote" className="scroll-mt-32 border border-line bg-white p-6 sm:p-8">
          <h2 className="font-heading text-[26px] font-extrabold text-ink">Get a price for your car</h2>
          <p className="mt-1 text-[15px]">We usually reply within the hour during opening hours.</p>
          <div className="mt-5">
            <QuoteForm variant="compact" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 bg-white">
        {heroImages.map((img, i) => (
          <div key={img.src} className="relative aspect-[4/3] sm:aspect-[16/9]">
            <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="33vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
