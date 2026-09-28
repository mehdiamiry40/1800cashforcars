import { site } from "./site";

// `where` is a place phrase such as "on the Gold Coast" or "in Brisbane".
export function heroCopy(where?: string) {
  return {
    title: where ? `Sell your car ${where}.` : "Sell your car.",
    lead: "We'll hop right over.",
    sub: site.maxPayout
      ? `Up to ${site.maxPayout} for any car, ute, van or truck. Free towing, and we pay you before we leave.`
      : "Top cash for any car, ute, van or truck. Free towing, and we pay you before we leave.",
    points: ["Free towing", "Paid on pickup", "Calls 24/7"],
  };
}
