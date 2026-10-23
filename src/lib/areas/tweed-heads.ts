import type { CopyFaq, CopySection } from "../copy";

const QUOTE = "/quote";
const PRICES = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";

export const tweedHeadsSuburbs = ["Tweed Heads", "Kingscliff", "Banora Point", "Murwillumbah", "Pottsville", "Terranora"];

export const tweedHeadsLocal = {
  intro:
    "Just over the border, 1800-CASH-FOR-CARS buys unwanted cars in Tweed Heads, Banora Point, Kingscliff, Pottsville, Terranora and Murwillumbah, in any condition, with free removal.",
  sections: [
    {
      heading: "The Tweed places we come to",
      paragraphs: [
        {
          text: "Tweed Heads is the border town, directly south of Coolangatta. We also collect in Banora Point, above the river, and in Terranora. On the coast the run continues to Kingscliff and then Pottsville. Inland, Murwillumbah is the Tweed Valley town on this page.",
        },
        {
          text: "Those six are the places we name for the Tweed. Put the suburb in the quote form if the car is in one of them. A car still on the Queensland side of the border, in Coolangatta or further north, belongs on the Gold Coast page, where you can choose cash or a bank transfer.",
          links: [
            { phrase: "quote form", href: QUOTE },
            { phrase: "Gold Coast page", href: "/locations/gold-coast" },
          ],
        },
      ],
    },
    {
      heading: "NSW payment is by bank transfer",
      paragraphs: [
        {
          text: "NSW law does not allow cash for scrap vehicles, so in the Tweed we pay by bank transfer before the car leaves. Have your bank details ready on the day. That rule is the reason a Tweed Heads pickup is handled differently from a Brisbane or Gold Coast one.",
        },
        {
          text: "The amount is still the price we quoted, as long as the vehicle is as described. Towing is not deducted. Tweed Heads is on the Brisbane price guide as well, and crossing the border is not a surcharge. Access can change an individual quote. The guide itself is on the scrap car prices page.",
          links: [{ phrase: "scrap car prices page", href: PRICES }],
        },
      ],
    },
    {
      heading: "NSW rego, Queensland rego, and the paperwork",
      paragraphs: [
        {
          text: "We buy NSW-registered cars, Queensland-registered cars kept in the Tweed, and cars with no rego at all. An unregistered car in a Kingscliff garage, or one that has sat on a block at Murwillumbah, can still be collected. We tow it, so it does not need a roadworthy.",
        },
        {
          text: "On the day, bring a driver's licence or passport, and the rego papers if you still have them. Missing papers are worth flagging when you ask for a price. We still have to see the ID and be satisfied the car is yours. If finance is outstanding, call 0423 514 111 before the booking and we'll talk it through. A write-up of financed sales isn't on this page.",
          links: [{ phrase: "0423 514 111", href: "tel:+61423514111" }],
        },
        {
          text: "Keys help when you have them. A missing key does not stop the job: we winch the car onto a tilt tray. Take your belongings and any toll tag out first. We give you a receipt when we pay.",
        },
        {
          text: "After the pickup, cancel the registration with the state that issued it, and tell your insurer. A NSW registration is cancelled with Service NSW. A Queensland registration is cancelled online with Transport and Main Roads, and you may get a refund for time left on it.",
          links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
        },
      ],
    },
    {
      heading: "What we collect, and how the Tweed run is booked",
      paragraphs: [
        {
          text: "Cars, 4WDs, utes and vans, running or not. Rust, a blown engine, accident damage, flood damage or years in the weather do not rule a vehicle out. Describe the condition so the quote holds on the day. Trucks are priced on cash for trucks. A car that will not be repaired is covered on the scrap car removal page.",
          links: [
            { phrase: "cash for trucks", href: "/truck-removal" },
            { phrase: "scrap car removal page", href: "/scrap-car-removal" },
          ],
        },
        {
          text: "Pickups in the Tweed usually happen within a day or two, and often sooner. You pick the time, Monday to Saturday. We collect from home, from work, from a mechanic, or from the roadside. Mention a tight driveway in Terranora or Banora Point, or a car at Murwillumbah that cannot roll.",
        },
        {
          text: "The yard we leave from is 79B Breadwell St, Rocklea, on Brisbane's southside. The Tweed is over the border from that yard, which is why we agree a time with you. The tow is still free across Tweed Heads, Banora Point, Kingscliff, Pottsville, Terranora and Murwillumbah. The office line is open through the working day until 5pm, and until 2pm Saturday. How the sale itself is priced is on the cash for cars page.",
          links: [{ phrase: "cash for cars page", href: "/cash-for-cars" }],
        },
      ],
    },
  ] satisfies CopySection[],
  cta: {
    text: "Send the Tweed suburb, the vehicle, and the account name for the transfer. We pay by bank transfer before it leaves.",
    from: "tweed-heads-body",
  },
  faqs: [
    {
      q: "Can you pay cash in Tweed Heads?",
      a: "No. NSW law does not allow cash payments for scrap vehicles, so we pay by bank transfer before the car leaves. Have your account details ready on the day.",
    },
    {
      q: "Do you buy NSW-registered cars?",
      a: "Yes. NSW rego, Queensland rego, or no rego at all. Bring photo ID and proof of ownership. Unregistered cars are towed, so they do not need a roadworthy.",
    },
    {
      q: "Is towing free in the Tweed?",
      a: "Yes. Pickup is free in Tweed Heads, Banora Point, Kingscliff, Pottsville, Terranora and Murwillumbah. We do not take the tow off your price.",
    },
    {
      q: "The car is on Queensland rego but kept in Kingscliff. Can you still take it?",
      a: "Yes. We buy Queensland-registered cars kept in the Tweed. After pickup, cancel a NSW registration with Service NSW. Cancel a Queensland registration online with Transport and Main Roads.",
      links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
    },
    {
      q: "How quickly can you get to Murwillumbah or Pottsville?",
      a: "Usually within a day or two, and often sooner. You choose the time, Monday to Saturday. Mention the access, especially on a rural block around Murwillumbah, when you use the quote form.",
      links: [{ phrase: "quote form", href: QUOTE }],
    },
  ] satisfies CopyFaq[],
};
