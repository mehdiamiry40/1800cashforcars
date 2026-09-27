import type { Slide } from "@/components/HeroSlider";
import { site } from "./site";

export function heroSlides(place = "South East QLD"): Slide[] {
  const payout = site.maxPayout;
  return [
    {
      pre: payout ? "Get up to" : "Get",
      highlight: payout || "top cash",
      post: `for your car in ${place}`,
      image: "/images/hero-towing.jpg",
      alt: "Car being loaded onto a flatbed tow truck",
      bullets: [
        payout ? (
          <span key="payout">Instant cash offers up to <b>{payout}</b></span>
        ) : (
          <span key="offer">Instant <b>cash offer</b> over the phone</span>
        ),
        "No hidden charges",
        "Free towing plus paperwork handled",
        "No hassle, no matter the condition of the vehicle",
      ],
    },
    {
      pre: "Free car",
      highlight: "removal",
      post: "7 days a week",
      image: "/images/hero-truck.jpg",
      alt: "Tow truck carrying a car on the road",
      bullets: ["Same-day pickups available", `Serving ${place} & surrounds`, "Running or not — we tow it free", "Paid before we leave"],
    },
    {
      pre: "Scrap, damaged or",
      highlight: "unwanted",
      post: "car? We buy them all",
      image: "/images/hero-damaged.jpg",
      alt: "Accident-damaged car",
      bullets: ["Accident, flood & hail damaged", "Unregistered & no roadworthy", "Old, rusty & scrap vehicles", "Cars, utes, vans, 4WDs & trucks"],
    },
  ];
}
