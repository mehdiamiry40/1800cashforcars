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
      <section className="relative overflow-hidden border-b-4 border-ink bg-sand">
        <div className="container-site relative grid items-end gap-4 pt-10 sm:grid-cols-[1fr_auto] sm:pt-14">
          <div className="pb-10 sm:pb-14">
            <p className="text-[15px]">
              <Link href="/" className="font-bold text-brand underline underline-offset-2">Home</Link>
              <span aria-hidden className="mx-1.5 text-body/50">/</span> {title}
            </p>
            <h1 className="mt-3 font-heading text-[40px] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink sm:text-[56px]">{title}</h1>
            {intro && <p className="mt-4 max-w-xl text-[18px] sm:text-[19px]">{intro}</p>}
            {forms && (
              <QuoteLink from="page-title" className="btn-brand mt-6 !px-7 !py-4 !text-[18px] lg:hidden">
                Get my price <ArrowIcon className="h-5 w-5" />
              </QuoteLink>
            )}
          </div>
          <Roo {...roo} className="mx-auto hidden h-72 w-auto sm:block" />
        </div>
      </section>

      <section className={`container-site grid gap-10 py-14 sm:py-20 lg:gap-14 ${forms ? "lg:grid-cols-[1fr_340px]" : ""}`}>
        <div className="min-w-0">{children}</div>
        {forms && (
          <aside className="hidden lg:block">
            <div data-quote className="scroll-mt-28 border-2 border-ink bg-white p-6 shadow-[6px_6px_0_#1d2433] lg:sticky lg:top-28">
              <p className="mb-3 font-heading text-[21px] font-extrabold leading-tight text-ink">Get a price for your car</p>
              <QuoteForm variant="compact" narrow />
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
