"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { HomeIcon, MenuIcon, PhoneIcon } from "./icons";

export const nav = [
  { href: "/cash-for-cars", label: "Cash For Cars" },
  { href: "/car-removals", label: "Car Removals" },
  { href: "/services", label: "Services" },
  { href: "/#areas", label: "Areas" },
  { href: "/contact-us", label: "Contact Us" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { facebook, instagram } = site.social;

  return (
    <header>
      <div className="container-site flex items-center justify-between gap-4 py-4">
        <Link href="/" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          {facebook && (
            <a href={facebook} aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full bg-[#3b5998] font-bold text-white">f</a>
          )}
          {instagram && (
            <a href={instagram} aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-[#c13584] text-sm font-bold text-white">ig</a>
          )}
          {!facebook && !instagram && (
            <p className="text-right font-heading text-sm leading-snug text-body">
              Free towing · Paid on pickup
              <br />
              <span className="font-bold text-green">{site.hours}</span>
            </p>
          )}
        </div>
      </div>

      <nav className="container-site">
        <div className="flex items-stretch bg-charcoal">
          <Link href="/" aria-label="Home" className="grid place-items-center px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-green text-white">
              <HomeIcon className="h-5 w-5" />
            </span>
          </Link>
          <ul className="hidden flex-1 items-center gap-6 font-heading text-[15px] uppercase lg:flex">
            <li>
              <Link href="/" className={pathname === "/" ? "text-green-light" : "text-white hover:text-green-light"}>Home</Link>
            </li>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={pathname === n.href ? "text-green-light" : "text-white hover:text-green-light"}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
            className="flex flex-1 items-center px-2 text-white lg:hidden"
          >
            <MenuIcon className="h-7 w-7" />
          </button>
          <a href={site.phoneHref} className="flex items-center gap-3 bg-phone px-4 py-4 font-heading text-white sm:px-7">
            <PhoneIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="text-[15px] sm:text-lg">{site.phoneDisplay}</span>
          </a>
        </div>
        {open && (
          <ul className="bg-charcoal-dark font-heading uppercase lg:hidden">
            {[{ href: "/", label: "Home" }, ...nav].map((n) => (
              <li key={n.href} className="border-t border-white/10">
                <Link href={n.href} onClick={() => setOpen(false)} className="block px-5 py-3 text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
