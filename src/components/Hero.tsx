import Image from "next/image";
import { heroCopy, heroImages } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { CheckIcon, PhoneIcon, SmsIcon } from "./icons";

export function Hero({ where }: { where?: string }) {
  const copy = heroCopy(where);
  return (
    <section className="bg-paper">
      <div className="container-site grid gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-16">
        <div className="lg:pt-4">
          <h1 className="font-heading text-[36px] font-extrabold leading-[1.03] tracking-[-0.025em] text-ink min-[400px]:text-[42px] sm:text-[60px]">
            {copy.title} <span className="block text-brand">{copy.lead}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[17px] sm:mt-5 sm:text-[19px]">{copy.sub}</p>
          <ul className="mt-5 grid max-w-md grid-cols-1 gap-x-4 min-[360px]:grid-cols-2 gap-y-2 text-[16px] font-semibold text-ink sm:mt-6 sm:gap-x-6 sm:text-[17px]">
            {copy.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 shrink-0 text-money" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
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

        <div id="hero-quote" className="scroll-mt-32 border border-line bg-white p-5 sm:p-8">
          <h2 className="font-heading text-[28px] font-bold tracking-[-0.01em] text-ink">Get a price for your car</h2>
          <p className="mt-1 text-[15px]">We usually reply within the hour during opening hours.</p>
          <div className="mt-5">
            <QuoteForm variant="compact" />
          </div>
        </div>
      </div>

      <div className="grid gap-1 bg-white sm:grid-cols-3">
        {heroImages.map((img, i) => (
          <div key={img.src} className={`relative aspect-[16/9] ${i > 0 ? "hidden sm:block" : ""}`}>
            <Image src={img.src} alt={img.alt} fill quality={55} sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
