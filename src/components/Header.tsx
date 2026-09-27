"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { ClockIcon, MenuIcon, PhoneIcon, SmsIcon, TruckIcon } from "./icons";

export const nav = [
  { href: "/", label: "Home" },
  { href: "/cash-for-cars", label: "Cash For Cars" },
  { href: "/car-removals", label: "Car Removals" },
  { href: "/services", label: "Services" },
  { href: "/#areas", label: "Areas" },
  { href: "/contact-us", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-navy-950 text-[13px] text-white/80">
        <div className="container-site flex items-center justify-between gap-4 py-2">
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4 text-brand-light" /> Open {site.hours}</span>
            <span className="hidden items-center gap-1.5 sm:flex"><TruckIcon className="h-4 w-4 text-brand-light" /> Free towing across South East QLD</span>
          </p>
          <p className="flex items-center gap-4">
            {site.smsNumber && (
              <a href={`sms:${site.smsNumber}`} className="hidden items-center gap-1.5 hover:text-white md:flex">
                <SmsIcon className="h-4 w-4 text-brand-light" /> Text us
              </a>
            )}
            <a href={site.phoneHref} className="flex items-center gap-1.5 font-semibold text-white">
              <PhoneIcon className="h-4 w-4 text-brand-light" /> {site.phoneDisplay}
            </a>
          </p>
        </div>
      </div>

      <div className="border-b border-line bg-white/95 backdrop-blur">
        <div className="container-site flex items-center justify-between gap-4 py-3">
          <Link href="/" aria-label={`${site.name} home`}>
            <Logo />
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 font-heading text-[17px] font-semibold uppercase tracking-wide">
              {nav.map((n) => {
                const active = n.href === pathname;
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className={`border-b-2 pb-1 transition ${active ? "border-brand text-brand" : "border-transparent text-navy hover:text-brand"}`}
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={site.phoneHref} className="hidden items-center gap-2 rounded-xl border-2 border-navy px-4 py-2.5 font-heading text-lg font-bold text-navy transition hover:bg-navy hover:text-white xl:flex">
              <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
            </a>
            <Link href="/#ask-for-our-price" className="btn-brand hidden whitespace-nowrap !px-5 !py-2.5 !text-base sm:inline-flex">
              Get a quote
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Menu"
              className="grid h-11 w-11 place-items-center rounded-xl border border-line text-navy lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {open && (
          <nav aria-label="Mobile" className="border-t border-line bg-white lg:hidden">
            <ul className="container-site py-2 font-heading text-lg font-semibold uppercase">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="block border-b border-line/60 py-3 text-navy last:border-0">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
