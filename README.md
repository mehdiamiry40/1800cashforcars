# 1800 Cash For Cars

Website for [1800cashforcars.com.au](https://1800cashforcars.com.au): Next.js (App Router) + Tailwind, deployed on Vercel from GitHub. Every push to `main` goes live.

## Editing content
- **Business details** (`src/lib/site.ts`): phone, hours, ABN, address, service areas, FAQs, reviews, headline payout.
  - `showEmail`: keep `false` until the `quotes@` mailbox or forwarding exists. Otherwise customer emails bounce.
  - `reviews`: add real customer reviews only. The reviews section appears automatically when this has entries.
  - `googleBusinessUrl` / `googleBusinessName`: the Google Business Profile (listed as A Plus Car Removal). Adds a "Read our reviews on Google" band on the homepage and links the profile in the structured data. Keep `address` identical to the profile (79B).
  - `areas[].local`: the intro, pickup notes and FAQs that make each `/locations/<slug>` page specific to that area.
- **Service pages** (`src/lib/content.ts`): Cash for cars, Car removals, Services, Cash for trucks, Scrap car removal, Car wreckers, Car disposal.
- **Brand mascot, Roo**: `src/components/Roo.tsx` (poses: `pouchCar`, `hand="phone" | "cash" | "wave"`, `hop`, `confused`, `flip`) and `RooMark` for the logo. Vehicle icons are in `src/components/VehicleIcons.tsx`.
  - The hero scene (Roo offering cash for an old car) is `src/components/HeroScene.tsx`. If the art changes, regenerate the share-image copy: `npx tsx scripts/export-roo.tsx`.
- **Brand identity**: orange `#c2410c` for actions, navy `#0f1d33` for headings, white backgrounds, and neutral `#f6f7f5` sections with `#e2e6ea` borders. Barlow is for headings; Nunito Sans is for body text, navigation, form labels and buttons; Barlow Semi Condensed stays in the logo. Use sentence case, sharp corners, light borders and restrained shadows. Roo is a small supporting mascot; the main hero uses `src/assets/hero-car-truck-cash.png`.
- **Shared design styles** in `globals.css`: `h-page`, `h-section`, `h-content`, `h-sub`, `eyebrow`, `section-site`, `card-site`, `quote-panel`, `field`, `field-label`, and the `btn-*` variants. Reuse these across pages so spacing, typography and form panels remain consistent.
- **Visual content**: `src/lib/vehicle-visuals.ts` maps the three white-background category photos to vehicle cards and service-page headers. Keep section summaries brief and use the existing SVG icons. Service blocks have a short `summary` and optional `icon`; their original paragraphs and list explanations remain available in expandable details. Suburb coverage is expandable too, so the main pages stay easy to scan.

## Quote requests
Both quote forms post to `POST /api/quote` (`src/app/api/quote/route.ts`, logic in `src/lib/quote.ts`). It:
- blocks spam with a honeypot field and a "filled in too fast" check, and drops those quietly (no email, and the page still says thanks),
- allows 5 complete submissions per IP per 10 minutes, then returns 429 with a short message the form shows,
- normalises the expected price (`2.5k` becomes `$2,500`),
- emails the lead via **Resend** (Vercel Marketplace) from `quotes@1800cashforcars.com.au` to `LEAD_TO_EMAIL`,
- writes every accepted lead to the Vercel function logs (`[lead] …`) as a backup.
- retries a failed email once; if it still fails it logs `LEAD NOT DELIVERED` and asks the customer to call or text instead of showing a false "thanks".
- shows a generic message if something unexpected fails, and keeps the detail in the server logs.

The limiter is an in-memory sliding window. Each serverless instance keeps its own counts, and a cold start clears them. A durable limit would need a store such as Upstash, which is a new service and new environment variables, so it is not connected here.

AutoVal lookup allows 20 requests per IP per 10 minutes, and a valuation allows 5. Both return the same short 429 message. Lookup and valuation failures return a generic message; the underlying error is only logged.

Env vars (Vercel): `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN` (from the integration), `LEAD_TO_EMAIL` (comma-separate multiple).

## Saving quotes in Supabase

Optional. After the honeypot, the timing check, validation and the rate limit, an accepted quote is inserted into Supabase as well as emailed. Dropped and rate-limited requests are not stored. If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is unset, the insert is skipped and the site behaves exactly as it does today: the lead is emailed (and written to the function logs). If the insert fails, the failure is logged on the server and the email still sends. The visitor is not told about the database.

1. Create a Supabase project.
2. Run `supabase/migrations/20261022235000_quote_submissions.sql` in the Supabase SQL editor, or apply it with the Supabase CLI.
3. In the Vercel project settings, add `SUPABASE_URL` (the project URL) and `SUPABASE_SERVICE_ROLE_KEY` (the `service_role` secret) for the environments that should store leads. Add these yourself. Do not prefix the service role key with `NEXT_PUBLIC_`. It bypasses row level security and must stay on the server.

The `quote_submissions` table has row level security enabled and no policies, so the anon and authenticated keys cannot read or write leads. Columns match the form fields the email already sends (`name`, `phone`, `email`, `address`, `vehicle`, `description`, `expected`, `page`), plus `user_agent`. `page` is the source page. `id` and `created_at` are generated by the database. The honeypot and the timing field are not stored.

## Platform
- Vercel Web Analytics is on (no cookies).
- www redirects to the bare domain. Security headers, including a strict Content-Security-Policy, are set in `next.config.ts`. `scripts/csp-hashes.ts` fills inline-script hashes into the build output after `next build`, and removes Vercel's preview-only toolbar script (`vercel.live`), which the public site does not load.
- Structured data: AutomotiveBusiness, FAQPage and BreadcrumbList.
- Sitemap, robots, social share image, app icons and web manifest are generated in `src/app`.

## Develop
```bash
npm install
vercel env pull   # optional: pulls env vars into .env.local
npm run dev
```
