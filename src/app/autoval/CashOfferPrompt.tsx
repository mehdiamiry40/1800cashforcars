import { QuoteTrustLine } from "@/components/ParentBrand";
import { QuoteLink } from "@/components/QuoteLink";
import { ArrowIcon } from "@/components/icons";

// The way to a cash offer, next to the valuation tool. A quote form only appears on this page after a
// valuation, so without this block a desktop visitor who doesn't finish the tool has no quote button.
// QuoteLink opens /quote, or scrolls to the form in the report once a valuation is on screen.
// Both sentences are already on this page, in "AutoVal questions". Nothing new is promised here.
export function CashOfferPrompt({ className = "" }: { className?: string }) {
  return (
    <aside aria-label="Cash offer for your car" className={`border-2 border-brand bg-white p-5 sm:px-8 sm:py-6 xl:p-5 ${className}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8 xl:flex-col xl:items-start xl:gap-4">
        <div>
          <p className="eyebrow text-logo">Cash offer</p>
          <p className="mt-1 font-heading text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-navy">
            Damaged, non-running or scrap car?
          </p>
          <p className="mt-2 text-[16px] leading-normal">
            AutoVal is an estimate, not an offer to buy the car. For a damaged, non-running or scrap car, ask for a cash offer.
          </p>
        </div>
        <QuoteLink from="autoval-tool" className="btn-brand shrink-0 xl:w-full">
          Get a free quote
          <ArrowIcon aria-hidden="true" className="h-5 w-5" />
        </QuoteLink>
      </div>
      <QuoteTrustLine className="mt-4 border-t border-line/15 pt-4" />
    </aside>
  );
}
