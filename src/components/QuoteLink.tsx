"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { PhoneIcon } from "./icons";

// The first quote form that's actually on screen (the sidebar one is hidden on phones).
function visibleQuoteForm() {
  return [...document.querySelectorAll<HTMLElement>("[data-quote]")].find((el) => el.offsetParent !== null) ?? null;
}

// "Get a Quote" button: scrolls to the quote form on this page, or opens /quote if the page has none.
export function QuoteLink({ from, className, children }: { from: string; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href="/quote"
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        track("quote_cta_click", { from });
        const form = visibleQuoteForm();
        if (!form) return; // no form on this page: Link opens /quote
        e.preventDefault();
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        // Put the cursor in the first box on desktop; on phones that would pop the keyboard over the form.
        if (matchMedia("(pointer: fine)").matches) form.querySelector<HTMLInputElement>("input[name=vehicle]")?.focus({ preventScroll: true });
      }}
    >
      {children}
    </Link>
  );
}

// Phone-only bar pinned to the bottom of the screen. Getting a price online is the main action; calling is
// the small one. It slides away while a quote form is on screen so it never covers the form's buttons.
export function StickyQuoteBar() {
  const pathname = usePathname();
  const [formInView, setFormInView] = useState(false);
  useEffect(() => {
    const forms = document.querySelectorAll("[data-quote]");
    if (!forms.length) return;
    const showing = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) showing.add(e.target);
        else showing.delete(e.target);
      }
      setFormInView(showing.size > 0);
    });
    forms.forEach((f) => io.observe(f));
    return () => {
      io.disconnect();
      setFormInView(false);
    };
  }, [pathname]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-[1fr_auto] bg-navy pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.12)] transition-transform duration-300 md:hidden ${formInView ? "translate-y-full" : ""}`}
      inert={formInView}
    >
      <QuoteLink from="mobile-bar" className="flex min-h-14 items-center justify-center bg-brand px-3 py-4 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark">
        Get a free quote
      </QuoteLink>
      <a href={site.phoneHref} className="flex min-h-14 items-center justify-center gap-1.5 px-5 py-4 text-[14px] font-semibold text-white">
        <PhoneIcon aria-hidden="true" className="h-4 w-4" /> Call
      </a>
    </div>
  );
}

// Counts phone and text taps in Web Analytics, next to quote_submitted, so the two can be compared.
export function ContactTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='tel:'], a[href^='sms:']");
      if (a) track(a.getAttribute("href")!.startsWith("tel:") ? "call_click" : "sms_click", { page: location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
