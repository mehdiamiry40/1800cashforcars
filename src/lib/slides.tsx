import { site } from "./site";

export const heroImages = [
  { src: "/images/hero-towing.jpg", alt: "Car being loaded onto a flatbed tow truck" },
  { src: "/images/hero-truck.jpg", alt: "Tow truck carrying a car on the road" },
  { src: "/images/hero-damaged.jpg", alt: "Accident-damaged car" },
];

export function heroCopy(place = "South East QLD") {
  return {
    eyebrow: `Cash for cars · ${place}`,
    pre: site.maxPayout ? "Get up to" : "Get",
    highlight: site.maxPayout || "top cash",
    post: `for your car in ${place}`,
    sub: "Old, damaged, broken down or just unwanted — get a firm offer fast, choose a pickup time, and get paid on pickup.",
    bullets: [
      site.maxPayout ? `Offers up to ${site.maxPayout}` : "Instant cash offer",
      "No hidden charges",
      "Free towing & paperwork",
      "Any make, any condition",
    ],
  };
}
