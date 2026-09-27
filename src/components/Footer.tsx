import Link from "next/link";
import { services } from "@/lib/content";
import { areas, site } from "@/lib/site";
import { Logo } from "./Logo";
import { MailIcon, PhoneIcon, SmsIcon } from "./icons";

const sitemap = [
  { href: "/", label: "Home" },
  { href: "/cash-for-cars", label: "Cash For Cars" },
  { href: "/car-removals", label: "Car Removals" },
  { href: "/services", label: "Services" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="bg-navy-950 pb-20 text-[15px] text-white/70 md:pb-0">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs">{site.tagline} We buy cars, utes, vans and 4WDs in any condition across South East Queensland.</p>
          <a href={site.phoneHref} className="mt-5 flex items-center gap-2 font-heading text-3xl font-extrabold text-white">
            <PhoneIcon className="h-6 w-6 text-brand-light" /> {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="mt-2 flex items-center gap-2 hover:text-white">
            <MailIcon className="h-4 w-4 text-brand-light" /> {site.email}
          </a>
          <p className="mt-1 text-sm">Open {site.hours}</p>
          {site.address && <p className="mt-1 text-sm">{site.address}</p>}
        </div>
        <FooterCol title="Company">
          {sitemap.map((l) => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
        </FooterCol>
        <FooterCol title="Services">
          <FooterLink href="/cash-for-cars">Cash For Cars</FooterLink>
          <FooterLink href="/car-removals">Free Car Removals</FooterLink>
          {services.map((s) => <FooterLink key={s.slug} href={`/${s.slug}`}>{s.tile}</FooterLink>)}
        </FooterCol>
        <FooterCol title="Service areas">
          {areas.map((a) => <FooterLink key={a.slug} href={`/locations/${a.slug}`}>{a.name}, {a.state}</FooterLink>)}
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}{site.abn ? ` · ABN ${site.abn}` : ""}. All rights reserved.</p>
          <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-heading text-lg font-bold uppercase tracking-wider text-white">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition hover:text-brand-light">{children}</Link>
    </li>
  );
}

// Desktop: floating call/text bubbles. Mobile: fixed action bar.
export function FloatingContact() {
  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 hidden flex-col gap-3 md:flex">
        {site.smsNumber && (
          <a href={`sms:${site.smsNumber}`} aria-label="Send us a text" className="grid h-14 w-14 place-items-center rounded-full bg-navy text-white shadow-xl ring-4 ring-white transition hover:scale-105">
            <SmsIcon className="h-6 w-6" />
          </a>
        )}
        <a href={site.phoneHref} aria-label="Call us" className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-xl ring-4 ring-white transition hover:scale-105">
          <PhoneIcon className="h-6 w-6" />
        </a>
      </div>
      <div className={`fixed inset-x-0 bottom-0 z-50 grid gap-2 border-t border-line bg-white p-2.5 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] md:hidden ${site.smsNumber ? "grid-cols-3" : "grid-cols-2"}`}>
        <a href={site.phoneHref} className="flex items-center justify-center gap-1.5 rounded-xl bg-navy py-3 font-heading font-bold uppercase text-white">
          <PhoneIcon className="h-5 w-5" /> Call
        </a>
        {site.smsNumber && (
          <a href={`sms:${site.smsNumber}`} className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-navy py-3 font-heading font-bold uppercase text-navy">
            <SmsIcon className="h-5 w-5" /> Text
          </a>
        )}
        <Link href="/#ask-for-our-price" className="flex items-center justify-center rounded-xl bg-brand py-3 font-heading font-bold uppercase text-white">
          Quote
        </Link>
      </div>
    </>
  );
}
