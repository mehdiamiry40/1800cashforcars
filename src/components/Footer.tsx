import Link from "next/link";
import { services } from "@/lib/content";
import { areaHref, areas, site } from "@/lib/site";
import { Logo } from "./Logo";
import { PhoneIcon } from "./icons";
import { QuoteLink } from "./QuoteLink";

export function Footer() {
  return (
    <footer className="bg-navy-950 pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-[15px] text-white/70 md:pb-0">
      <div className="container-site grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <Logo light />
          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <QuoteLink from="footer" className="inline-flex items-center bg-brand px-5 py-2.5 font-heading text-[18px] font-bold text-white hover:bg-brand-dark">
              Get a Quote
            </QuoteLink>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 font-heading text-[17px] font-bold text-white hover:underline">
              <PhoneIcon className="h-5 w-5" /> Call us
            </a>
          </p>
          <p className="mt-3">{site.pickups}</p>
          {site.showEmail && (
            <p className="mt-3"><a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-white">{site.email}</a></p>
          )}
          {site.address && (
            <p className="mt-3">
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">{site.address}</a>
            </p>
          )}
          {site.abn && <p className="mt-1">ABN {site.abn}</p>}
        </div>
        <FooterCol title="Services">
          <FooterLink href="/">Cash for cars Brisbane</FooterLink>
          <FooterLink href="/car-removal-brisbane">Car removal Brisbane</FooterLink>
          <FooterLink href="/cash-for-cars">Cash for cars</FooterLink>
          <FooterLink href="/car-removals">Free car removal</FooterLink>
          <FooterLink href="/truck-removal">Cash for trucks</FooterLink>
          {services.map((s) => <FooterLink key={s.slug} href={`/${s.slug}`}>{s.tile}</FooterLink>)}
        </FooterCol>
        <FooterCol title="Areas">
          {areas.map((a) => <FooterLink key={a.slug} href={areaHref(a)}>{a.name}</FooterLink>)}
        </FooterCol>
        <FooterCol title="Info">
          <FooterLink href="/services">All services</FooterLink>
          <FooterLink href="/#faq">Common questions</FooterLink>
          <FooterLink href="/contact-us">Contact us</FooterLink>
          <FooterLink href="/privacy">Privacy policy</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <p className="container-site py-5 text-[14px]">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-heading text-[16px] font-bold text-white">{title}</h3>
      <ul className="sm:space-y-1.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="inline-block py-2.5 hover:text-white hover:underline sm:py-0">{children}</Link>
    </li>
  );
}
