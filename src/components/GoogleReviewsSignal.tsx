import { site } from "@/lib/site";

// Compact Google rating for the quote card. Figures come only from site.googleRating.
// They belong to the parent company's Google listing and stay plain text, not review markup.
export function GoogleReviewsSignal({ className = "" }: { className?: string }) {
  const { score, count } = site.googleRating;
  if (!score || !count) return null;

  const label = site.googleBusinessName
    ? `${score} from ${count} Google reviews for ${site.googleBusinessName} (our parent company)`
    : `${score} from ${count} Google reviews`;
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
