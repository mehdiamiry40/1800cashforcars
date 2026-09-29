# 1800 Cash For Cars

Website for [1800cashforcars.com.au](https://1800cashforcars.com.au): Next.js (App Router) + Tailwind, deployed on Vercel from GitHub. Every push to `main` goes live.

## Editing content
- **Business details** (`src/lib/site.ts`): phone, hours, ABN, address, service areas, FAQs, reviews, headline payout.
  - `showEmail`: keep `false` until the `quotes@` mailbox or forwarding exists. Otherwise customer emails bounce.
  - `reviews`: add real customer reviews only. The reviews section appears automatically when this has entries.
- **Service pages** (`src/lib/content.ts`): Cash for cars, Car removals, Services, Cash for trucks, Scrap car removal, Car wreckers, Car disposal.
- **Brand mascot, Roo**: `src/components/Roo.tsx` (poses: `pouchCar`, `hand="phone" | "cash" | "wave"`, `hop`, `confused`, `flip`) and `RooMark` for the logo. Vehicle icons are in `src/components/VehicleIcons.tsx`.
  - If Roo's design changes, regenerate the share-image copy: `npx tsx scripts/export-roo.tsx`.
- **Brand colours**: cash green `#1f7a4d` (buttons, links), Roo rust `#c8743a`, sand `#fbf3e6`, eucalyptus `#1e3a2f`. Fonts are Barlow (headings) and Nunito Sans (body). Sharp corners everywhere (a global rule in `globals.css` forces `border-radius: 0`). Keep it plain: we mostly buy scrap and old cars.

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
