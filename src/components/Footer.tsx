import Link from "next/link";
import { services } from "@/lib/content";
import { areas, site } from "@/lib/site";
import { PhoneIcon, SmsIcon } from "./icons";

const sitemap = [
  { href: "/", label: "Home" },
  { href: "/cash-for-cars", label: "Cash For Cars" },
  { href: "/car-removals", label: "Car Removals" },
  { href: "/services", label: "Services" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/#faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal-dark text-[14px] text-white/75">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <FooterCol title="Sitemap">
          {sitemap.map((l) => (
            <li key={l.href}><Link href={l.href} className="underline hover:text-green-light">{l.label}</Link></li>
          ))}
        </FooterCol>
        <FooterCol title="Services">
          {services.map((s) => (
            <li key={s.slug}><Link href={`/${s.slug}`} className="underline hover:text-green-light">{s.tile}</Link></li>
          ))}
          <li><Link href="/cash-for-cars" className="underline hover:text-green-light">Cash For Cars</Link></li>
          <li><Link href="/car-removals" className="underline hover:text-green-light">Free Car Removals</Link></li>
        </FooterCol>
        <FooterCol title="Service Areas">
          {areas.map((a) => (
            <li key={a.slug}><Link href={`/locations/${a.slug}`} className="underline hover:text-green-light">Cash For Cars {a.name}</Link></li>
          ))}
        </FooterCol>
        <FooterCol title="Contact Us">
          <li><b className="text-white">Company:</b> {site.name}</li>
          <li><b className="text-white">Website:</b> <a href={site.url} className="underline">{site.domain}</a></li>
          {site.address && <li><b className="text-white">Address:</b> {site.address}</li>}
          <li><b className="text-white">Email:</b> <a href={`mailto:${site.email}`} className="underline">{site.email}</a></li>
          <li><b className="text-white">Phone:</b> <a href={site.phoneHref} className="underline">{site.phoneDisplay}</a></li>
          <li><b className="text-white">Hours:</b> {site.hours}</li>
          {site.abn && <li><b className="text-white">ABN:</b> {site.abn}</li>}
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <p className="container-site py-5 text-center text-xs">
          Copyright © {new Date().getFullYear()} {site.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-heading text-lg font-bold uppercase text-white">{title}</h3>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

// Floating contact bubbles (bottom-right), like the SMS button on the reference design.
export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {site.smsNumber && (
        <a href={`sms:${site.smsNumber}`} aria-label="Send us a text" className="grid h-14 w-14 place-items-center rounded-full bg-phone text-white shadow-lg ring-4 ring-white">
          <SmsIcon className="h-7 w-7" />
        </a>
      )}
      <a href={site.phoneHref} aria-label="Call us" className="grid h-14 w-14 place-items-center rounded-full bg-green text-white shadow-lg ring-4 ring-white">
        <PhoneIcon className="h-7 w-7" />
      </a>
    </div>
  );
}
