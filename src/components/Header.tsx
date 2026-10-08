"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { QuoteLink } from "./QuoteLink";
import { ArrowIcon, MenuIcon, PhoneIcon } from "./icons";

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
    <header className="relative z-40 border-b border-line bg-white/95 backdrop-blur md:sticky md:top-0">
      <div className="container-site flex items-center justify-between gap-3 py-4">
        <Link href="/" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-5 whitespace-nowrap text-[14px] font-semibold">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={n.href === pathname ? "page" : undefined}
                  className={`border-b-2 py-2 transition-colors ${n.href === pathname ? "border-brand text-brand" : "border-transparent text-navy hover:border-brand hover:text-brand"}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <QuoteLink from="header" className="btn-brand hidden whitespace-nowrap sm:inline-flex">
            Get a free quote <ArrowIcon aria-hidden="true" className="h-4 w-4" />
          </QuoteLink>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
            className="grid h-12 w-12 place-items-center border border-line text-navy transition-colors hover:border-brand hover:bg-sand xl:hidden"
          >
            <MenuIcon aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-line xl:hidden">
          <ul className="container-site grid gap-1 py-3 text-[16px] font-semibold">
            {[{ href: "/", label: "Home" }, ...nav].map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={n.href === pathname ? "page" : undefined} onClick={() => setOpen(false)} className={`block px-3 py-2.5 hover:bg-sand hover:text-brand ${n.href === pathname ? "bg-sand text-brand" : "text-navy"}`}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 px-3 py-2.5 text-ink hover:bg-sand">
                <PhoneIcon aria-hidden="true" className="h-5 w-5 text-brand" /> {site.phoneDisplay}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
