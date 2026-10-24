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
