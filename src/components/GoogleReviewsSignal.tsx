import { site } from "@/lib/site";

// Compact review count for the quote card. The number comes only from site.googleRating.count.
// Plain text only. It is not structured data.
export function GoogleReviewsSignal({ className = "" }: { className?: string }) {
  const { count } = site.googleRating;
  if (!count) return null;

  const label = `${count} reviews on Google`;
  const classNames = `google-reviews-signal flex w-full min-w-0 max-w-full flex-wrap items-center gap-x-1.5 text-[14px] font-semibold leading-snug text-navy ${className}`;
  const content = (
    <>
      <span aria-hidden="true" className="tracking-wider text-brand">
        ★★★★★
      </span>
      <span className="min-w-0">{label}</span>
    </>
  );

  if (!site.googleBusinessUrl) return <p className={classNames}>{content}</p>;

  return (
    <a
      href={site.googleBusinessUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classNames} underline-offset-4 hover:underline hover:decoration-brand`}
    >
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
