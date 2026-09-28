import { site } from "./site";

export const heroImages = [
  { src: "/images/hero-towing.jpg", alt: "Car being loaded onto a flatbed tow truck" },
  { src: "/images/hero-truck.jpg", alt: "Tow truck carrying a car on the road" },
  { src: "/images/hero-damaged.jpg", alt: "Accident-damaged car" },
];

// `where` is a place phrase such as "on the Gold Coast" or "in Brisbane".
export function heroCopy(where?: string) {
  const suffix = where ? ` ${where}` : "";
  return {
    title: site.maxPayout ? `We pay up to ${site.maxPayout} for cars${suffix}.` : `We buy cars for cash${suffix}.`,
    lead: "Any condition, free towing.",
    sub: `Running or not, registered or not, anywhere ${where ?? "across South East Queensland"}. Tell us what you've got and we'll give you a price. If you're happy with it, we pick the car up when it suits you and pay you before it leaves.`,
    points: ["Free towing", "Paid before we tow", "Same-day pickups", "Any make or model"],
  };
}
