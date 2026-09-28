"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { MenuIcon, PhoneIcon } from "./icons";

export const nav = [
  { href: "/cash-for-cars", label: "Cash for cars" },
  { href: "/car-removals", label: "Car removals" },
  { href: "/services", label: "Services" },
  { href: "/#areas", label: "Areas" },
  { href: "/contact-us", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-40 bg-white md:sticky md:top-0">
      <div className="bg-navy text-[14px] text-white/85">
        <div className="container-site flex items-center justify-between gap-4 py-1.5">
          <p className="hidden truncate sm:block">Gold Coast, Brisbane, Logan, Ipswich, Sunshine Coast and the Tweed</p>
          <p className="shrink-0">{site.hours}</p>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="container-site flex items-center justify-between gap-3 py-3 sm:py-3.5">
          <Link href="/">
            <Logo />
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 font-heading text-[15px] font-semibold">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={n.href === pathname ? "text-brand underline underline-offset-8" : "text-ink hover:text-brand"}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <a href={site.phoneHref} className="hidden text-right leading-tight sm:block">
              <span className="block text-[13px] text-body">Call for a price</span>
              <span className="block font-display text-[26px] font-extrabold tracking-[0.01em] text-ink">{site.phoneDisplay}</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Menu"
              className="grid h-11 w-11 place-items-center border border-line text-ink lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {open && (
          <nav aria-label="Mobile" className="border-t border-line lg:hidden">
            <ul className="container-site py-1 font-heading font-semibold">
              {[{ href: "/", label: "Home" }, ...nav].map((n) => (
                <li key={n.href} className="border-b border-line last:border-0">
                  <Link href={n.href} onClick={() => setOpen(false)} className="block py-3 text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="py-3">
                <a href={site.phoneHref} className="flex items-center gap-2 font-display text-2xl font-extrabold text-brand">
                  <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
