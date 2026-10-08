import Link from "next/link";
import { AskForPrice, FinalCta, MakesRow, ReviewsBand } from "./Blocks";
import { Breadcrumbs } from "./JsonLd";
import { QuoteForm } from "./QuoteForm";
import { QuoteLink } from "./QuoteLink";
import { Roo, type RooProps } from "./Roo";
import { ArrowIcon } from "./icons";

// Layout for inner pages: title with Roo, content with the quote form beside it (desktop), then the price
// form again at the bottom. Pages that show the form in their own content pass `forms={false}`.
export function PageShell({
  title,
  path,
  intro,
  roo = { pouchCar: true },
  forms = true,
  children,
}: {
  title: string;
  path: string;
  intro?: string;
  roo?: RooProps;
  forms?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumbs trail={[{ name: title, path }]} />
      <section className="overflow-hidden border-b border-line bg-sand">
        <div className="container-site grid items-center gap-6 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:py-12">
          <div className="min-w-0">
            <p className="text-[13px]">
              <Link href="/" className="font-semibold text-brand hover:underline underline-offset-4">Home</Link>
              <span aria-hidden className="mx-1.5 text-body/50">/</span> {title}
            </p>
            <h1 className="h-page mt-4">{title}</h1>
            {intro && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed sm:text-[18px]">{intro}</p>}
            {forms && (
              <QuoteLink from="page-title" className="btn-brand mt-6 lg:hidden">
                Get a free quote <ArrowIcon aria-hidden="true" className="h-4 w-4" />
              </QuoteLink>
            )}
          </div>
          <Roo {...roo} className="mx-auto hidden h-36 w-auto sm:block lg:h-40" />
        </div>
      </section>

      <section className={`container-site section-site grid gap-10 lg:gap-12 ${forms ? "lg:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
        <div className="min-w-0">{children}</div>
        {forms && (
          <aside className="hidden lg:block">
            <div data-quote className="quote-panel scroll-mt-28 lg:sticky lg:top-28">
              <p className="h-sub mb-2">Get a free quote</p>
              <p className="mb-5 text-[14px]">We&apos;ll text you a price, usually within the hour.</p>
              <QuoteForm variant="compact" />
            </div>
          </aside>
        )}
      </section>

      <ReviewsBand />
      {forms && <AskForPrice />}
      <MakesRow />
      <FinalCta />
    </>
  );
}
