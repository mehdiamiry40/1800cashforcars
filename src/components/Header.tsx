"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/navigation";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { QuoteLink } from "./QuoteLink";
import { ArrowIcon, MailIcon, MenuIcon, PhoneIcon } from "./icons";

const links = [{ href: "/", label: "Home" }, ...nav];

export function Header() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) dialog.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
  const closeMenu = () => dialog.current?.close();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white text-navy">
        <div className="container-site flex items-center justify-between gap-3 py-4 sm:gap-5 xl:min-h-28 xl:py-0">
          <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
            <Logo />
          </Link>
          <div className="hidden flex-col items-end xl:flex">
            <div className="flex items-center gap-7 py-2 text-[16px] font-semibold">
              <span>Brisbane &amp; South East QLD</span>
              <a
                href={site.phoneHref}
                className="inline-flex min-h-9 items-center gap-2 hover:underline hover:decoration-brand hover:underline-offset-4"
              >
                <PhoneIcon aria-hidden="true" className="h-5 w-5" />
                {site.phoneDisplay}
              </a>
              {site.showEmail && (
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-9 items-center gap-2 hover:underline hover:decoration-brand hover:underline-offset-4"
                >
                  <MailIcon aria-hidden="true" className="h-5 w-5" />
                  {site.email}
                </a>
              )}
            </div>
            <nav aria-label="Main navigation" className="flex items-center">
              {links.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={n.href === pathname ? "page" : undefined}
                  className={`flex min-h-12 items-center px-3 text-[16px] font-semibold uppercase hover:underline hover:decoration-brand hover:underline-offset-8 ${n.href === pathname ? "underline decoration-brand underline-offset-8" : ""}`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <a
              href={site.phoneHref}
              aria-label={`Call ${site.phoneDisplay}`}
              className="grid h-11 w-11 place-items-center bg-navy text-white"
            >
              <PhoneIcon aria-hidden="true" className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => {
                dialog.current?.showModal();
                setOpen(true);
              }}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center border border-line"
            >
              <MenuIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        aria-label="Site navigation"
        onClose={() => setOpen(false)}
        className="mobile-menu"
      >
        <div className="flex min-h-20 shrink-0 items-center justify-between gap-3 border-b border-line px-5 sm:px-10">
          <Link href="/" onClick={closeMenu} aria-label={`${site.name} home`}>
            <Logo />
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="grid h-11 w-11 shrink-0 place-items-center"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
        <nav
          aria-label="Mobile navigation"
          className="overflow-y-auto px-6 pb-8 pt-4"
        >
          <ul className="divide-y divide-line">
            {links.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={closeMenu}
                  aria-current={n.href === pathname ? "page" : undefined}
                  className="flex min-h-14 items-center justify-between gap-3 py-4 text-[24px] font-semibold"
                >
                  <span>{n.label}</span>
                  <ArrowIcon aria-hidden="true" className="h-5 w-5" />
                </Link>
              </li>
            ))}
          </ul>
          <QuoteLink
            from="menu"
            onActivate={closeMenu}
            className="btn-brand mt-6 w-full"
          >
            Get a free quote{" "}
            <ArrowIcon aria-hidden="true" className="h-5 w-5" />
          </QuoteLink>
          <a
            href={site.phoneHref}
            className="mt-6 flex min-h-11 items-center gap-3 text-[20px] font-semibold"
          >
            <PhoneIcon aria-hidden="true" className="h-5 w-5" />
            {site.phoneDisplay}
          </a>
        </nav>
      </dialog>
    </>
  );
}
