import Link from "next/link";
import { services } from "@/lib/content";
import { areas, site } from "@/lib/site";
import { Logo } from "./Logo";
import { PhoneIcon, SmsIcon } from "./icons";

export function Footer() {
  return (
    <footer className="bg-navy-950 pb-20 text-[15px] text-white/70 md:pb-0">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5">
            <a href={site.phoneHref} className="font-display text-[30px] font-extrabold tracking-[0.01em] text-white">{site.phoneDisplay}</a>
          </p>
          <p>Open {site.hours}</p>
          <p className="mt-3"><a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-white">{site.email}</a></p>
          {site.address && <p className="mt-1">{site.address}</p>}
          {site.abn && <p className="mt-1">ABN {site.abn}</p>}
        </div>
        <FooterCol title="Services">
          <FooterLink href="/cash-for-cars">Cash for cars</FooterLink>
          <FooterLink href="/car-removals">Free car removal</FooterLink>
          {services.map((s) => <FooterLink key={s.slug} href={`/${s.slug}`}>{s.tile}</FooterLink>)}
        </FooterCol>
        <FooterCol title="Areas">
          {areas.map((a) => <FooterLink key={a.slug} href={`/locations/${a.slug}`}>{a.name}</FooterLink>)}
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
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-white hover:underline">{children}</Link>
    </li>
  );
}

// Phone-only bar pinned to the bottom of the screen.
export function FloatingContact() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-line bg-white md:hidden">
      <a href={site.phoneHref} className="flex items-center justify-center gap-2 bg-brand py-4 font-heading text-[17px] font-bold text-white">
        <PhoneIcon className="h-5 w-5" /> Call now
      </a>
      {site.smsNumber ? (
        <a href={`sms:${site.smsNumber}`} className="flex items-center justify-center gap-2 bg-navy py-4 font-heading text-[17px] font-bold text-white">
          <SmsIcon className="h-5 w-5" /> Text us
        </a>
      ) : (
        <Link href="/#ask-for-our-price" className="flex items-center justify-center bg-navy py-4 font-heading text-[17px] font-bold text-white">
          Get a price
        </Link>
      )}
    </div>
  );
}
