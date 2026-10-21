import { site } from "./site";

// `where` is a place phrase such as "on the Gold Coast" or "in Brisbane".
export function heroCopy(where?: string, override?: { title?: string; lead?: string; sub?: string }) {
  return {
    title: override?.title ?? (where ? `Cash for scrap cars ${where}.` : "Cash for scrap cars."),
    lead: override?.lead ?? "Any car. Any condition.",
    sub:
      override?.sub ??
      (site.maxPayout
        ? `Old, broken, crashed or rusted out. Up to ${site.maxPayout}, and we tow it away free.`
        : `Free pickup ${where ?? "across our service areas"}. Paid on collection.`),
    points: ["Free towing", "Paid on pickup", "No obligation"],
  };
}
