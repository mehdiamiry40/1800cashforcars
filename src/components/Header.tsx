import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { PhoneIcon } from "./icons";

const nav = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#what-we-buy", label: "Cars we buy" },
  { href: "/#areas", label: "Areas" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-900/95 backdrop-blur">
      <div className="bg-cash-400 text-center text-xs font-bold text-navy-950 sm:text-sm">
        <p className="mx-auto max-w-6xl px-4 py-1.5">Free car removal · Paid on the spot · {site.hours}</p>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label={`${site.name} home`}>
          <Logo light />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/85 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-cash-400">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={site.phoneHref} className="hidden items-center gap-2 font-display text-lg font-black text-white hover:text-cash-400 md:flex">
            <PhoneIcon className="h-5 w-5 text-cash-400" />
            {site.phoneDisplay}
          </a>
          <Link href="/quote" className="btn-cash whitespace-nowrap !px-4 !py-2 text-sm sm:!px-5 sm:!py-2.5">
            Get my offer
          </Link>
        </div>
      </div>
    </header>
  );
}
