"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { QuoteLink } from "./QuoteLink";
import { MenuIcon, PhoneIcon } from "./icons";

export const nav = [
  { href: "/cash-for-cars", label: "Cash for cars" },
  { href: "/car-removal-brisbane", label: "Car removal" },
  { href: "/truck-removal", label: "Trucks" },
  { href: "/#areas", label: "Areas" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact-us", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-40 border-b border-line/70 bg-white/95 backdrop-blur md:sticky md:top-0">
      <div className="container-site flex items-center justify-between gap-3 py-3">
        <Link href="/">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-5 whitespace-nowrap font-heading text-[17px] font-bold xl:gap-6">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`border-b-2 px-1 py-1 transition ${n.href === pathname ? "border-brand text-brand" : "border-transparent text-ink hover:border-ink"}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <QuoteLink from="header" className="btn-brand hidden whitespace-nowrap !px-5 !py-2.5 !text-[17px] sm:inline-flex">
            Get my price
          </QuoteLink>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
            className="grid h-11 w-11 place-items-center border-2 border-ink text-ink lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-line lg:hidden">
          <ul className="container-site grid gap-1 py-3 font-heading text-[18px] font-extrabold">
            {[{ href: "/", label: "Home" }, ...nav].map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-ink hover:bg-sand">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 px-3 py-2.5 text-ink hover:bg-sand">
                <PhoneIcon className="h-5 w-5 text-brand" /> Call us
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
