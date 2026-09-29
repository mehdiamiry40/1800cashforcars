import Link from "next/link";
import { site } from "@/lib/site";
import { AskForPrice, FinalCta, MakesRow, ReviewsBand } from "./Blocks";
import { Breadcrumbs } from "./JsonLd";
import { Roo, type RooProps } from "./Roo";
import { PhoneIcon, SmsIcon } from "./icons";

// Layout for inner pages: title with Roo, content with a small sidebar, then the price form.
export function PageShell({
  title,
  path,
  intro,
  roo = { pouchCar: true },
  children,
}: {
  title: string;
  path: string;
  intro?: string;
  roo?: RooProps;
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumbs trail={[{ name: title, path }]} />
      <section className="relative overflow-hidden border-b-4 border-ink bg-sand">
        <div className="container-site relative grid items-end gap-4 pt-10 sm:grid-cols-[1fr_auto] sm:pt-14">
          <div className="pb-10 sm:pb-14">
            <p className="text-[15px]">
              <Link href="/" className="font-bold text-brand underline underline-offset-2">Home</Link>
              <span aria-hidden className="mx-1.5 text-body/50">/</span> {title}
            </p>
            <h1 className="mt-3 font-heading text-[40px] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink sm:text-[56px]">{title}</h1>
            {intro && <p className="mt-4 max-w-xl text-[18px] sm:text-[19px]">{intro}</p>}
          </div>
          <Roo {...roo} className="mx-auto hidden h-72 w-auto sm:block" />
        </div>
      </section>

      <section className="container-site grid gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_300px] lg:gap-14">
        <div>{children}</div>
        <aside>
          <div className="border-2 border-ink bg-sand p-6 lg:sticky lg:top-28">
            <p className="font-heading text-[20px] font-extrabold text-ink">Get a price</p>
            <a href={site.phoneHref} className="mt-2 flex items-center gap-2 font-heading text-[28px] font-extrabold text-ink">
              <PhoneIcon className="h-6 w-6 text-brand" /> {site.phoneDisplay}
            </a>
            <p className="text-[15px]">{site.hours}</p>
            {site.smsNumber && (
              <a href={`sms:${site.smsNumber}`} className="mt-2 flex items-center gap-2 py-2 font-bold text-brand underline underline-offset-2">
                <SmsIcon className="h-5 w-5" /> Text us a photo
              </a>
            )}
            <Link href="#ask-for-our-price" className="btn-brand mt-4 w-full">Send us the details</Link>
          </div>
        </aside>
      </section>

      <ReviewsBand />
      <AskForPrice />
      <MakesRow />
      <FinalCta />
    </>
  );
}
