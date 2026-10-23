import type { CopyFaq, CopySection } from "../copy";

const QUOTE = "/quote";
const PRICES = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";

// First three names are used in the page's meta description. Keep that order.
export const goldCoastSuburbs = [
  "Southport",
  "Surfers Paradise",
  "Robina",
  "Ormeau",
  "Pimpama",
  "Coomera",
  "Upper Coomera",
  "Oxenford",
  "Helensvale",
  "Hope Island",
  "Pacific Pines",
  "Maudsland",
  "Labrador",
  "Biggera Waters",
  "Main Beach",
  "Broadbeach",
  "Mermaid Beach",
  "Bundall",
  "Benowa",
  "Ashmore",
  "Nerang",
  "Carrara",
  "Varsity Lakes",
  "Mudgeeraba",
  "Worongary",
  "Highland Park",
  "Gilston",
  "Burleigh Heads",
  "Burleigh Waters",
  "Palm Beach",
  "Elanora",
  "Currumbin",
  "Tugun",
  "Bilinga",
  "Coolangatta",
];

export const goldCoastLocal = {
  intro:
    "Selling an old, broken or unwanted car on the Gold Coast? 1800-CASH-FOR-CARS buys cars, utes, 4WDs and vans from Ormeau and Coomera down to Coolangatta, running or not, and tows them away free.",
  sections: [
    {
      heading: "Gold Coast suburbs we collect from",
      paragraphs: [
        {
          text: "Coming south from the yard at 79B Breadwell St, Rocklea, the first Gold Coast suburbs are Ormeau, Pimpama, Coomera, Upper Coomera, Oxenford and Helensvale, then Hope Island, Pacific Pines and Maudsland. The coastal strip from there is Southport, Labrador, Main Beach, Surfers Paradise, Broadbeach and Mermaid Beach, with Bundall, Benowa, Ashmore, Robina, Varsity Lakes and Carrara just inland.",
        },
        {
          text: "Hinterland pickups are around Nerang, Mudgeeraba, Worongary, Highland Park and Gilston. A steep driveway or a block set back from the road is fine if you mention it with the quote. The southern end is Burleigh Heads, Palm Beach, Elanora, Currumbin, Tugun, Bilinga and Coolangatta. Coolangatta is the last Queensland suburb here. Over the border, use the Tweed Heads page: that job is in NSW, so the payment is a bank transfer.",
          links: [{ phrase: "Tweed Heads page", href: "/locations/tweed-heads" }],
        },
      ],
    },
    {
      heading: "How a Gold Coast pickup works",
      paragraphs: [
        {
          text: "Most Gold Coast pickups happen within a day or two, and often the same day. You choose the time, Monday to Saturday. We come to houses, unit complexes, workshops and roadside breakdowns, from those northern suburbs through to the hinterland.",
        },
        {
          text: "The car does not have to run, roll or have keys. We bring a tilt tray and winch it on. Flat tyres are fine. If it is in a basement at Surfers Paradise or Southport, under a height limit, or in a backyard at Mudgeeraba, say so on the quote form so the truck that turns up can load it.",
          links: [{ phrase: "quote form", href: QUOTE }],
        },
        {
          text: "Towing is free anywhere on the Gold Coast. We do not take the cost of the tow off your price. The price we quote is the price we pay, as long as the car is as described. Call 0423 514 111 if you would rather talk it through. The yard office is open weekdays 8am to 5pm and Saturdays 8am to 2pm.",
          links: [{ phrase: "0423 514 111", href: "tel:+61423514111" }],
        },
      ],
    },
    {
      heading: "What we accept on the coast",
      paragraphs: [
        {
          text: "We buy cars and hatchbacks, 4WDs and SUVs, utes and vans, registered or not. Salt air is hard on older Gold Coast cars. Rust lowers the price, but we still buy rusty cars and pay for the metal and parts. A car that has sat in a garage or on a driveway without rego is fine, because we tow it and it does not need a roadworthy.",
        },
        {
          text: "Crashed cars, write-offs, and flood or hail damage are bought as they are. Tell us what is damaged. Scrap cars are covered on the scrap car removal page, and trucks on cash for trucks.",
          links: [
            { phrase: "scrap car removal", href: "/scrap-car-removal" },
            { phrase: "cash for trucks", href: "/truck-removal" },
          ],
        },
        {
          text: "Gold Coast cars are priced on the same guide we use in Brisbane. Free towing is never deducted. The figures are on our scrap car prices page. Selling before a move? Tell us the moving date and we will book around it.",
          links: [{ phrase: "scrap car prices page", href: PRICES }],
        },
      ],
    },
    {
      heading: "Queensland paperwork for a Gold Coast sale",
      paragraphs: [
        {
          text: "Have photo ID with you, a driver's licence or passport, and proof of ownership such as the rego papers. If you have lost the papers, say so when you ask for a price. We still need to see photo ID and be sure the car is yours, and we can usually sort that out.",
        },
        {
          text: "Bring the keys if you have them, and clear out belongings and any toll tag before we arrive. If finance is still owing, ring us and we will talk that car through. The steps for a financed car are not written up here.",
        },
        {
          text: "On the Gold Coast we pay cash or by bank transfer, your choice, before the car leaves. You get a receipt. After the pickup, cancel the registration with Transport and Main Roads. You can do it online, and you may get a refund for the time left on the rego. Then let your insurer know.",
          links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
        },
      ],
    },
  ] satisfies CopySection[],
  cta: {
    text: "Send the suburb, what the car is, and how we reach it. We will price it from those details.",
    from: "gold-coast-body",
  },
  faqs: [
    {
      q: "Do you charge extra to come to the Gold Coast?",
      a: "No. Pickup is free from Ormeau and Coomera down to Coolangatta, and through the hinterland around Nerang and Mudgeeraba. We do not take towing costs off your price.",
    },
    {
      q: "Which Gold Coast suburbs do you cover?",
      a: "All of them, from the northern suburbs to Coolangatta and out to the hinterland. The list on this page is the places we are asked for most. If yours is not on it, put the suburb in the quote form and we will confirm.",
      links: [{ phrase: "quote form", href: QUOTE }],
    },
    {
      q: "Can you pick up from a unit in Surfers Paradise or Southport?",
      a: "Yes. Tell us where the car is parked, and about any height limit or basement, so we bring the right truck. Houses, workshops and roadside breakdowns are covered the same way.",
    },
    {
      q: "Will you buy a rusty car that has lived near the beach?",
      a: "Yes. Coastal rust lowers the price, and we still pay for the metal and any parts we can use. Describe the rust when you ask for a price so the quote matches the car.",
    },
    {
      q: "What do I do with Queensland rego after you take the car?",
      a: "Cancel it with Transport and Main Roads. You can do that online, and you may get a refund for unused time. We give you a receipt. Then cancel your insurance.",
      links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
    },
  ] satisfies CopyFaq[],
};
