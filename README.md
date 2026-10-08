# 1800 Cash For Cars

Website for [1800cashforcars.com.au](https://1800cashforcars.com.au): Next.js (App Router) + Tailwind, deployed on Vercel from GitHub. Every push to `main` goes live.

## Editing content
- **Business details** (`src/lib/site.ts`): phone, hours, ABN, address, service areas, FAQs, reviews, headline payout.
  - `showEmail`: keep `false` until the `quotes@` mailbox or forwarding exists. Otherwise customer emails bounce.
  - `reviews`: add real customer reviews only. The reviews section appears automatically when this has entries.
- **Service pages** (`src/lib/content.ts`): Cash for cars, Car removals, Services, Cash for trucks, Scrap car removal, Car wreckers, Car disposal.
- **Brand mascot, Roo**: `src/components/Roo.tsx` (poses: `pouchCar`, `hand="phone" | "cash" | "wave"`, `hop`, `confused`, `flip`) and `RooMark` for the logo. Vehicle icons are in `src/components/VehicleIcons.tsx`.
  - The hero scene (Roo offering cash for an old car) is `src/components/HeroScene.tsx`. If the art changes, regenerate the share-image copy: `npx tsx scripts/export-roo.tsx`.
- **Brand identity**: orange `#c2410c` for actions, navy `#0f1d33` for headings, white backgrounds, and neutral `#f6f7f5` sections with `#e2e6ea` borders. Barlow is for headings; Nunito Sans is for body text, navigation, form labels and buttons; Barlow Semi Condensed stays in the logo. Use sentence case, sharp corners, light borders and restrained shadows. Roo is a small supporting mascot; the main hero uses `src/assets/hero-car-truck-cash.png`.
- **Shared design styles** in `globals.css`: `h-page`, `h-section`, `h-content`, `h-sub`, `eyebrow`, `section-site`, `card-site`, `quote-panel`, `field`, `field-label`, and the `btn-*` variants. Reuse these across pages so spacing, typography and form panels remain consistent.

## Quote requests
Both quote forms post to a server action (`src/app/actions.ts`). It:
- blocks spam with a honeypot field and a "filled in too fast" check,
- normalises the expected price (`2.5k` becomes `$2,500`),
- emails the lead via **Resend** (Vercel Marketplace) from `quotes@1800cashforcars.com.au` to `LEAD_TO_EMAIL`,
- writes every lead to the Vercel function logs (`[lead] …`) as a backup.

Env vars (Vercel): `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN` (from the integration), `LEAD_TO_EMAIL` (comma-separate multiple).

## Platform
- Vercel Web Analytics is on (no cookies).
- www redirects to the bare domain; security headers are set in `next.config.ts`.
- Structured data: AutomotiveBusiness, FAQPage and BreadcrumbList.
- Sitemap, robots, social share image, app icons and web manifest are generated in `src/app`.

## Develop
```bash
npm install
vercel env pull   # optional: pulls env vars into .env.local
npm run dev
```
