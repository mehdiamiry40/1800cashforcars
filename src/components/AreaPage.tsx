import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import heroPhoto from "@/assets/hero-car-truck-cash.png";
import type { CopySection } from "@/lib/copy";
import { QuoteForm } from "./QuoteForm";
import { QuoteLink } from "./QuoteLink";

const linkClass = "font-semibold text-navy underline underline-offset-4";

export function RichText({ text, links = [] }: { text: string; links?: { phrase: string; href: string }[] }) {
  const chunks: { text: string; href?: string }[] = [];
  let rest = text;
  while (rest.length) {
    let at = -1;
    let found: { phrase: string; href: string } | undefined;
    for (const link of links) {
      const i = rest.indexOf(link.phrase);
      if (i !== -1 && (at === -1 || i < at)) {
        at = i;
        found = link;
      }
    }
    if (!found || at === -1) {
      chunks.push({ text: rest });
      break;
    }
    if (at > 0) chunks.push({ text: rest.slice(0, at) });
    chunks.push({ text: found.phrase, href: found.href });
    rest = rest.slice(at + found.phrase.length);
  }

  return (
    <>
      {chunks.map((chunk, i) => {
        if (!chunk.href) return <span key={i}>{chunk.text}</span>;
        if (chunk.href.startsWith("/")) {
          return (
            <Link key={i} href={chunk.href} className={linkClass}>
              {chunk.text}
            </Link>
          );
        }
        const external = chunk.href.startsWith("http");
        return (
          <a key={i} href={chunk.href} className={linkClass} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {chunk.text}
          </a>
        );
      })}
    </>
  );
}

export function CopySections({ sections }: { sections: CopySection[] }) {
  return (
    <div className="mt-10 space-y-10">
      {sections.map((section) => {
        const [lead, ...rest] = section.paragraphs;
        return (
          <section key={section.heading}>
            <h2 className="h-content">{section.heading}</h2>
            {lead ? (
              <p className="mt-4 text-[18px] leading-relaxed">
                <RichText text={lead.text} links={lead.links} />
              </p>
            ) : null}
            {rest.length > 0 || section.list ? (
              <div className="prose-site text-[18px]">
                {rest.map((paragraph, index) => (
                  <p key={`${section.heading}-${index}`}>
                    <RichText text={paragraph.text} links={paragraph.links} />
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-4 space-y-3">
                    {section.list.map((item) => (
                      <li key={item.bold}>
                        <b className="text-navy">{item.bold}.</b> <RichText text={item.text} links={item.links} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

export function AreaHero({ h1, children }: { h1: string; children: ReactNode }) {
  return (
    <section aria-label="Cash for cars and free quote" className="hero-section bg-white text-navy">
      <div className="container-site grid items-start gap-5 py-6 sm:gap-7 sm:py-9 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 lg:py-8">
        <div className="min-w-0">
          <div data-prose>
            <h1 className="hero-heading">{h1}</h1>
            {children}
          </div>
          <Image
            src={heroPhoto}
            alt="A white tow truck carrying an old blue car, with cash in the foreground on a white background"
            preload
            fetchPriority="high"
            placeholder="blur"
            sizes="(max-width: 767px) 340px, (pointer: coarse) and (max-width: 1023px) 340px, (min-width: 1280px) 724px, (min-width: 1024px) calc(100vw - 556px), calc(100vw - 40px)"
            style={{ objectFit: "contain" }}
            className="hero-image mt-4 h-auto w-full"
          />
        </div>
        <div id="quote" data-quote className="hero-quote min-w-0 scroll-mt-32 border border-navy/15 border-t-[3px] border-t-brand p-4 sm:p-6">
          <h2 className="mb-5 text-[25px] font-semibold leading-tight">Get a free quote</h2>
          <QuoteForm variant="compact" />
        </div>
      </div>
    </section>
  );
}

export function GuideTable({
  rows,
  caption,
}: {
  rows: { vehicle: string; price: string }[];
  caption: ReactNode;
}) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[16px] leading-snug sm:text-[18px]">
        <caption className="mb-3 text-left text-[16px] leading-relaxed text-navy">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-navy">
            <th scope="col" className="py-3 pr-4 align-bottom font-semibold text-navy">
              Vehicle / condition
            </th>
            <th scope="col" className="w-[42%] py-3 align-bottom font-semibold text-navy sm:w-[38%]">
              Guide price (AUD)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.vehicle} className="border-b border-line align-top odd:bg-sand">
              <th scope="row" className="py-3 pr-4 font-semibold text-navy">
                {row.vehicle}
              </th>
              <td className="py-3">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SuburbGroups({
  groups,
  label = (name: string) => name,
}: {
  groups: { title: string; suburbs: string[] }[];
  label?: (name: string) => string;
}) {
  return (
    <div className="mt-6 space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="font-heading text-[22px] font-semibold leading-tight text-navy">{group.title}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {group.suburbs.map((suburb) => (
              <li key={suburb} className="border border-line bg-sand px-3 py-2 text-[15px] leading-snug">
                {label(suburb)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string; links?: { phrase: string; href: string }[] }[] }) {
  return (
    <div className="mt-6 divide-y divide-line">
      {items.map((item) => (
        <details key={item.q} className="group bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-[17px] font-semibold leading-relaxed text-navy sm:text-[20px]">
            {item.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center border border-line text-xl font-semibold text-navy transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <p className="pb-4 text-[16px] leading-relaxed sm:pb-5 sm:pr-6 sm:text-[18px]">
            <RichText text={item.a} links={item.links} />
          </p>
        </details>
      ))}
    </div>
  );
}

export function TextCta({ children, from }: { children: ReactNode; from: string }) {
  return (
    <div className="mt-6 border border-line bg-sand p-5">
      <div className="text-[18px] leading-relaxed">{children}</div>
      <div className="mt-4" data-cta>
        <QuoteLink from={from} className="btn-brand">
          Get your price
        </QuoteLink>
      </div>
    </div>
  );
}
