import { pages } from "@/lib/content";
import { areaHref, areas, brisbaneSuburbs, faqs, site } from "@/lib/site";

export const dynamic = "force-static";

function hoursLine(): string {
  return site.hours
    .map((h) => {
      const days = h.days.length > 1 ? `${h.days[0]} to ${h.days[h.days.length - 1]}` : h.days[0];
      return `${days} ${h.opens}–${h.closes}`;
    })
    .join("; ");
}

export function GET() {
  const areaLines = areas
    .map((a) => `- ${a.name}, ${a.state}: ${site.url}${areaHref(a)}`)
    .join("\n");
  const suburbLines = brisbaneSuburbs
    .map((g) => `- ${g.region}: ${g.suburbs.join(", ")}`)
    .join("\n");
  const pageLines = pages
    .map((p) => `- [${p.title}](${site.url}/${p.slug}): ${p.description}`)
    .join("\n");
  const faqLines = faqs.map((f) => `- ${f.q} ${f.a}`).join("\n");

  const body = `# ${site.name}

> ${site.tagline} Cash for scrap, old, broken and unwanted cars across Brisbane, the Gold Coast and South East QLD. Any condition, free towing, paid on pickup.

${site.name} is part of A Plus Car Removal (${site.parentUrl}). They share the yard. The yard is listed on Google as ${site.googleBusinessName}.

## Business

- Name: ${site.name}
- Website: ${site.url}
- Phone: ${site.phoneDisplay}
- SMS: ${site.phoneDisplay}
- Email: ${site.email}
- ABN: ${site.abn}
- ${site.licenceLine}
- Yard: ${site.address}
- Yard hours: ${hoursLine()}
- ${site.pickups}
- Part of: ${site.googleBusinessName}, ${site.parentUrl}
- Google listing: ${site.googleBusinessName}, rated ${site.googleRating.score} from ${site.googleRating.count} Google reviews (${site.googleBusinessUrl})
- We buy cars with no keys or no wheels.
- Quotes are usually within the hour. Pickups are usually within a day or two.

## What we buy

Cars, utes, vans, 4WDs and trucks, from light trucks to heavy rigids. Running or not, including crashed, flood-damaged, unregistered, rusty and scrap cars. We buy cars with no keys or no wheels. Pickup is free in the service areas below, and the towing cost is not taken off the price. Payment is cash or bank transfer when the car is picked up, before it leaves. In NSW, including Tweed Heads, payment is by bank transfer only. Quotes are usually within the hour. Pickups are usually within a day or two.

## Service areas

${areaLines}

Brisbane suburbs, grouped as on the site:

${suburbLines}

## Payment and paperwork

${faqLines}

## Key pages

- [Cash for cars Brisbane](${site.url}/): Cash for cars Brisbane: we buy scrap, old and unwanted cars in any condition. Paid on pickup, free car removal, usually within a day or two, from our local Rocklea yard.
- [Car removal Brisbane](${site.url}/car-removal-brisbane): Free car removal Brisbane wide. We pick up scrap, old and unwanted cars, pay you before they leave and tow them free. Pickups are usually within a day or two from our Rocklea yard.
- [Scrap car prices Brisbane](${site.url}/scrap-car-prices-brisbane): Most scrap and non-running cars we buy in Brisbane are worth $150 to $800. Older cars that still run usually fetch $500 to $1,600. Running or accident-damaged utes bring $1,000 to $5,500, and late-model damaged SUVs and 4WDs $2,500 to $6,000. These are guides: every car is quoted individually, and free towing is never taken off the price. Updated 20 October 2026.
- [Cash for cars Logan](${site.url}/locations/logan): ${site.name} buys scrap, old and damaged cars, utes, vans and trucks right across the City of Logan, from Springwood and Beenleigh to Browns Plains, Jimboomba and Yarrabilba. Towing is always free and never taken off your price. Most scrap or non-running cars fetch $150 to $800, and running or damaged utes $1,000 to $5,500.
- [Cash for cars Ipswich](${site.url}/locations/ipswich): Yes, we pay cash for unwanted cars, utes, vans and trucks anywhere in the City of Ipswich, from Goodna and Springfield to Rosewood and Marburg. Our Rocklea yard sits at the Brisbane end of the Ipswich Motorway, and towing is always free. A non-running sedan typically brings $300 to $800; trucks start from $1,000.
- [About our Rocklea yard](${site.url}/about): ${site.name} is part of A Plus Car Removal and shares the yard at 79B Breadwell St, Rocklea QLD 4106. ${site.licenceLine} ABN ${site.abn}.
- [Car removal with no keys or no wheels](${site.url}/car-removal-no-keys-no-wheels): We buy cars with no keys or no wheels. Towing is free and never deducted. Payment is before the car leaves. Pickups are usually within a day or two.
- [Areas we cover](${site.url}/locations): We buy cars and offer free car removal across Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads.
${pageLines}
- [AutoVal car valuation](${site.url}/autoval): Find out what your car is worth in about a minute. Enter your rego or VIN. AutoVal checks live Australian listings for trade-in, private and dealer prices.
- [Contact](${site.url}/contact-us): Contact ${site.name} for a free cash offer and free car removal. Call or text ${site.phoneDisplay}, or send the car's details for a price.
- [Privacy policy](${site.url}/privacy): How ${site.name} collects, uses, stores and protects personal information given when asking for a quote or selling a car.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
