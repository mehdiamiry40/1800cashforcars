import { site } from "@/lib/site";

// The owner confirmed this brand is part of A Plus Car Removal and they share the yard.
export function ParentBrandLine({ className = "" }: { className?: string }) {
  if (!site.googleBusinessName || !site.parentUrl) return null;
  return (
    <p className={className}>
      {site.name} is part of{" "}
      <a href={site.parentUrl} className="font-semibold underline underline-offset-4">
        {site.googleBusinessName}
      </a>
      .
    </p>
  );
}

// Who the seller is dealing with, in one short line for beside a quote form or a quote button: the parent
// business and its dealer licence, the shared yard, and the ABN. Every word comes from site.ts and is
// already in the footer. It is plain text, so nothing next to a form links away from it.
export function QuoteTrustLine({ className = "" }: { className?: string }) {
  return (
    <p className={`quote-trust text-[14px] leading-snug text-body ${className}`}>
      {site.licenceLine} We share its yard at {site.address}. ABN {site.abn}.
    </p>
  );
}
