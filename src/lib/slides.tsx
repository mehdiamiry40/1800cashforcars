import { site } from "./site";

export const heroImages = [
  { src: "/images/hero-towing.jpg", alt: "Car being loaded onto a flatbed tow truck" },
  { src: "/images/hero-truck.jpg", alt: "Tow truck carrying a car on the road" },
  { src: "/images/hero-damaged.jpg", alt: "Accident-damaged car" },
];

export function heroCopy(place?: string) {
  const where = place ? ` in ${place}` : "";
  return {
    title: site.maxPayout ? `We pay up to ${site.maxPayout} for cars${where}.` : `We buy cars for cash${where}.`,
    lead: "Any condition, free towing.",
    sub: `Running or not, registered or not, anywhere ${place ? `in ${place}` : "across South East Queensland"}. Tell us what you've got and we'll give you a price. If you're happy with it, we pick the car up when it suits you and pay you before it leaves.`,
    points: ["Free towing", "Paid before we tow", "Same-day pickups", "Any make or model"],
  };
}
