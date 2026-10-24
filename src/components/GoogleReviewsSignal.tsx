import { site } from "@/lib/site";

// Compact Google rating for the quote card. Figures come only from site.googleRating.
// The rating belongs to the parent's Google listing, so the badge names that business.
export function GoogleReviewsSignal({ className = "" }: { className?: string }) {
  const { score, count } = site.googleRating;
  if (!score || !count || !site.googleBusinessName) return null;

  const label = `${score} from ${count} Google reviews of our yard, ${site.googleBusinessName}`;
  const classNames = `google-reviews-signal flex w-fit max-w-full flex-wrap items-center gap-x-1.5 text-[14px] font-semibold leading-none text-navy ${className}`;
  const content = (
    <>
      <span aria-hidden="true" className="tracking-wider text-brand">
        ★★★★★
      </span>
      <span>{label}</span>
    </>
  );

  if (!site.googleBusinessUrl) return <p className={classNames}>{content}</p>;

  return (
    <a
      href={site.googleBusinessUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classNames} underline-offset-4 hover:underline hover:decoration-brand`}
      title={site.googleBusinessName ? `${site.googleBusinessName} on Google` : undefined}
    >
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
