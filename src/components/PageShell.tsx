import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";
import { site } from "@/lib/site";
import { AskForPrice, FinalCta, MakesRow, ReviewsBand } from "./Blocks";
import { ArrowIcon, CheckIcon, PhoneIcon, SmsIcon } from "./icons";

// Layout for inner pages: photo title band, content + sticky sidebar, then the quote form and brand sections.
export function PageShell({ title, intro, image = "/images/hero-truck.jpg", children }: { title: string; intro?: string; image?: string; children: React.ReactNode }) {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <div className="container-site relative py-14 sm:py-20">
          <p className="text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1.5">/</span> <span className="text-brand-light">{title}</span>
          </p>
          <h1 className="mt-3 font-heading text-5xl font-extrabold uppercase leading-none sm:text-6xl">{title}</h1>
          {intro && <p className="mt-4 max-w-2xl text-lg text-white/80">{intro}</p>}
        </div>
      </section>

      <section className="container-site grid gap-12 py-16 lg:grid-cols-[1fr_340px]">
        <div>{children}</div>
        <aside>
          <div className="space-y-6 lg:sticky lg:top-36">
            <div className="overflow-hidden rounded-2xl bg-navy text-white shadow-xl">
              <div className="p-6">
                <p className="font-heading text-3xl font-extrabold uppercase leading-none">Get a free quote</p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {["Top cash, paid on pickup", "Free towing, 7 days", "Any make, any condition"].map((t) => (
                    <li key={t} className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-brand-light" /> {t}</li>
                  ))}
                </ul>
                <Link href="#ask-for-our-price" className="btn-brand mt-5 w-full">Ask for our price <ArrowIcon className="h-5 w-5" /></Link>
                <a href={site.phoneHref} className="btn-ghost mt-3 w-full"><PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}</a>
                {site.smsNumber && (
                  <a href={`sms:${site.smsNumber}`} className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
                    <SmsIcon className="h-4 w-4" /> or text us photos of your car
                  </a>
                )}
              </div>
            </div>
            <div className="card p-6">
              <p className="font-heading text-xl font-bold uppercase text-navy">Our services</p>
              <ul className="mt-3 divide-y divide-line">
                {[
                  { href: "/cash-for-cars", label: "Cash For Cars" },
                  { href: "/car-removals", label: "Free Car Removals" },
                  ...services.map((s) => ({ href: `/${s.slug}`, label: s.tile })),
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center justify-between py-2.5 font-semibold text-navy hover:text-brand">
                      {l.label} <ArrowIcon className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </section>

      <AskForPrice />
      <ReviewsBand />
      <MakesRow />
      <FinalCta />
    </>
  );
}
