import Link from "next/link";
import { areas, site } from "@/lib/site";
import { Logo } from "./Logo";
import { PhoneIcon } from "./icons";

export function Footer() {
  return (
    <footer className="bg-navy-950 pb-24 text-white/70 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {site.tagline} We buy cars, utes, vans, 4WDs and trucks in any condition — and recycle them responsibly.
          </p>
          <a href={site.phoneHref} className="mt-5 inline-flex items-center gap-2 font-display text-2xl font-black text-cash-400">
            <PhoneIcon className="h-6 w-6" />
            {site.phoneDisplay}
          </a>
          <p className="mt-1 text-sm">{site.hours}</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Service areas</h3>
          <ul className="space-y-2 text-sm">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/locations/${a.slug}`} className="hover:text-cash-400">
                  Cash for cars {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/quote" className="hover:text-cash-400">Get a free quote</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-cash-400">How it works</Link></li>
            <li><Link href="/#faq" className="hover:text-cash-400">FAQ</Link></li>
            <li><Link href="/privacy" className="hover:text-cash-400">Privacy policy</Link></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-cash-400">{site.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs">
          © {new Date().getFullYear()} {site.name}
          {site.abn ? ` · ABN ${site.abn}` : ""} · All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-navy-900 p-2.5 md:hidden">
      <a href={site.phoneHref} className="flex items-center justify-center gap-2 rounded-full border-2 border-white/80 py-3 font-bold text-white">
        <PhoneIcon className="h-5 w-5" /> Call now
      </a>
      <Link href="/quote" className="btn-cash !py-3">
        Get my offer
      </Link>
    </div>
  );
}
