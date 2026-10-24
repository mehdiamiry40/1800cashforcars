import { site } from "@/lib/site";

// Compact Google rating for the quote card. Figures come only from site.googleRating.
// They belong to the parent company's Google listing, name that yard and business, and stay plain text.
export function GoogleReviewsSignal({ className = "" }: { className?: string }) {
  const { score, count } = site.googleRating;
  if (!score || !count || !site.googleBusinessName) return null;

  const label = `${score} from ${count} Google reviews of our yard, for ${site.googleBusinessName} (our parent company)`;
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
      title={site.googleBusinessName ? `${site.googleBusinessName} on Google` : undefined}
    >
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
