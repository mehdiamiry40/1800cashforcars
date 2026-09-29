import { heroCopy } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { Roo } from "./Roo";
import { CheckIcon, PhoneIcon } from "./icons";

export function Hero({ where }: { where?: string }) {
  const copy = heroCopy(where);
  return (
    <>
      <section className="relative overflow-hidden border-b-4 border-ink bg-sand">

        <div className="container-site relative grid items-center gap-6 pb-28 pt-10 sm:pb-32 sm:pt-14 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="font-heading text-[42px] font-extrabold leading-[1] tracking-[-0.01em] text-ink min-[400px]:text-[48px] sm:text-[66px]">
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
            <Roo pouchCar className="w-full" title="Roo the kangaroo with an old car in his pouch" />
          </div>
        </div>
      </section>

      <section id="quote" className="relative z-10 -mt-20 scroll-mt-24">
        <div className="container-site">
          <div className="mx-auto max-w-3xl border-2 border-ink bg-white p-6 sm:p-9">
            <h2 className="font-heading text-[28px] font-extrabold text-ink sm:text-[34px]">Get a price for your car</h2>
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
