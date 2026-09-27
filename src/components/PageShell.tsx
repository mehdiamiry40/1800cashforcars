import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";
import { site } from "@/lib/site";
import { AskForPrice, MakesRow, ReviewsBand } from "./Blocks";
import { PhoneIcon, SmsIcon } from "./icons";

// Layout for inner pages: title + photo, content with a sidebar, then the price form.
export function PageShell({ title, intro, image = "/images/hero-truck.jpg", children }: { title: string; intro?: string; image?: string; children: React.ReactNode }) {
  return (
    <>
      <section className="bg-paper">
        <div className="container-site grid items-center gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-14">
          <div>
            <p className="text-[15px]">
              <Link href="/" className="underline underline-offset-2">Home</Link> <span className="mx-1 text-body/60">/</span> {title}
            </p>
            <h1 className="mt-3 font-heading text-[40px] font-black leading-[1.05] tracking-[-0.02em] text-ink sm:text-[52px]">{title}</h1>
            {intro && <p className="mt-4 max-w-2xl text-[19px]">{intro}</p>}
          </div>
          <div className="relative hidden aspect-[4/3] lg:block">
            <Image src={image} alt="" fill priority sizes="440px" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="container-site grid gap-12 py-14 lg:grid-cols-[1fr_320px]">
        <div>{children}</div>
        <aside>
          <div className="space-y-8 lg:sticky lg:top-36">
            <div className="border-t-4 border-brand bg-paper p-6">
              <p className="font-heading text-[20px] font-bold text-ink">Get a price</p>
              <a href={site.phoneHref} className="mt-2 flex items-center gap-2 font-heading text-[28px] font-black text-ink">
                <PhoneIcon className="h-6 w-6 text-brand-dark" /> {site.phoneDisplay}
              </a>
              <p className="text-[15px]">Open {site.hours}</p>
              {site.smsNumber && (
                <a href={`sms:${site.smsNumber}`} className="mt-4 flex items-center gap-2 font-semibold text-ink underline underline-offset-2">
                  <SmsIcon className="h-5 w-5" /> Text us photos of the car
                </a>
              )}
              <Link href="#ask-for-our-price" className="btn-navy mt-5 w-full">Or send us the details</Link>
            </div>
            <div>
              <p className="font-heading text-[18px] font-bold text-ink">Services</p>
              <ul className="mt-2 border-t border-line">
                {[
                  { href: "/cash-for-cars", label: "Cash for cars" },
                  { href: "/car-removals", label: "Free car removal" },
                  ...services.map((s) => ({ href: `/${s.slug}`, label: s.tile })),
                ].map((l) => (
                  <li key={l.href} className="border-b border-line">
                    <Link href={l.href} className="block py-2.5 text-ink hover:text-brand-dark hover:underline">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </section>

      <ReviewsBand />
      <AskForPrice />
      <MakesRow />
    </>
  );
}
