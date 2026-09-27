"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { MenuIcon, PhoneIcon } from "./icons";

export const nav = [
  { href: "/", label: "Home" },
  { href: "/cash-for-cars", label: "Cash for cars" },
  { href: "/car-removals", label: "Car removals" },
  { href: "/services", label: "Services" },
  { href: "/#areas", label: "Service areas" },
  { href: "/contact-us", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="border-b border-line bg-white"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="container-site flex items-center justify-between gap-4 py-5">
        <Link href="/" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <p className="text-right text-xs">
            Free towing · Paid on pickup
            <br />
            <span className="font-semibold text-green">{site.hours}</span>
          </p>
          <a className="btn-green" href={site.phoneHref}>
            <PhoneIcon className="h-5 w-5" />
            {site.phoneDisplay}
          </a>
        </div>
        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
      <nav aria-label="Main navigation" className="container-site">
        <ul className="hidden items-center gap-8 border-t border-line py-1 text-sm font-semibold lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={pathname === n.href ? "page" : undefined}
                className={`inline-flex min-h-12 items-center border-b-2 ${pathname === n.href ? "border-green text-green" : "border-transparent text-body hover:text-green"}`}
              >
                {n.label}
              </Link>
            </li>
          ))}
          <li className="ml-auto">
            <Link
              href="/quote"
              className="inline-flex min-h-12 items-center text-green underline underline-offset-4"
            >
              Get a free quote →
            </Link>
          </li>
        </ul>
        <ul
          id="mobile-navigation"
          hidden={!open}
          className="border-t border-line pb-4 lg:!hidden"
        >
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={pathname === n.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="block rounded px-2 py-3 font-semibold text-ink hover:bg-hero"
              >
                {n.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={site.phoneHref} className="btn-green mt-2 w-full">
              <PhoneIcon className="h-5 w-5" />
              {site.phoneDisplay}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
