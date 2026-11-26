# 1800-CASH-FOR-CARS

Website for [1800cashforcars.com.au](https://1800cashforcars.com.au): Next.js (App Router) + Tailwind, deployed on Vercel from GitHub. Every push to `main` goes live.

## Editing content
- **Business details** (`src/lib/site.ts`): phone, hours, ABN, address, service areas, FAQs, reviews, headline payout.
  - `showEmail`: keep `false` until the `quotes@` mailbox or forwarding exists. Otherwise customer emails bounce.
  - `reviews`: add real customer reviews only. The reviews section appears automatically when this has entries.
  - `googleBusinessUrl` / `googleBusinessName`: the Google Business Profile (listed as A Plus Car Removal). Adds a "Read A Plus Car Removal's reviews on Google" band on the homepage and links the profile in the structured data. Keep `address` identical to the profile (79B). The Google rating is plain text only, never AggregateRating markup.
  - `areas[].local`: the intro, pickup notes and FAQs that make each `/locations/<slug>` page specific to that area.
- **Service pages** (`src/lib/content.ts`): Cash for cars, Car removals, Services, Cash for trucks, Scrap car removal, Car wreckers, Car disposal.
  - Each page has an `updated` date. That is the page's lastmod in the sitemap. When you edit one page's copy, change that page's date and leave the others, so only the edited URL gets a new lastmod.
- **Brand mascot, Roo**: `src/components/Roo.tsx` (poses: `pouchCar`, `hand="phone" | "cash" | "wave"`, `hop`, `confused`, `flip`) and `RooMark` for the logo. Vehicle icons are in `src/components/VehicleIcons.tsx`.
  - The hero scene (Roo offering cash for an old car) is `src/components/HeroScene.tsx`. If the art changes, regenerate the share-image copy: `npx tsx scripts/export-roo.tsx`.
- **Brand identity**: the colours are the `@theme` tokens at the top of `src/app/globals.css`. Orange `#e16633` is for accents and headings that need emphasis, the darker orange `#c14a22` is for the logo block and the "(Instant)" tag in the quote heading, and blue `#1e25a4` is for headings, body text, borders and the navy bars, on white backgrounds. Barlow is the only typeface, loaded in three weights (400 body, 600 headings, 700 buttons) in `src/app/layout.tsx`. Use sentence case, sharp corners, light borders and restrained shadows. Roo is a small supporting mascot; the main hero uses `src/assets/hero-car-truck-cash.png`.
- **Shared design styles** in `globals.css`: `h-page`, `h-section`, `h-content`, `h-sub`, `eyebrow`, `section-site`, `card-site`, `quote-panel`, `field`, `field-label`, and the `btn-*` variants. Reuse these across pages so spacing, typography and form panels remain consistent.
- **Visual content**: `src/lib/vehicle-visuals.ts` maps the three white-background category photos to vehicle cards and service-page headers. Keep section summaries brief and use the existing SVG icons. Service blocks have a short `summary` and optional `icon`; their original paragraphs and list explanations remain available in expandable details. Suburb coverage is expandable too, so the main pages stay easy to scan.

## Quote requests
Both quote forms post to `POST /api/quote` (`src/app/api/quote/route.ts`, logic in `src/lib/quote.ts`). It:
- checks for spam with a hidden honeypot field and a "sent too fast" check. A submission that fills the hidden field is never emailed and the page still says thanks; a complete one is saved in Supabase with `spam_reason = 'honeypot'` so it can be reviewed. A form sent within 2.5 seconds of appearing is not dropped: the visitor is asked to press the button again,
- allows 5 complete submissions per IP per 10 minutes, then returns 429 with a short message the form shows,
- requires make, model and a 4-digit year from 1950 through next year. A price is optional; when one is entered it is normalised (`2.5k` becomes `$2,500`). A blank price is left out of the email subject and the Price row, and is stored as an empty string,
- accepts a blank email and rejects a filled address that is not an email. A valid address is the reply-to on the lead email,
- gives every accepted quote a reference such as `Q-7K3MPX` (no 0, O, 1, I or L). It leads the subject, is the first email row, and is shown on the thank-you message. The same reference is the OpenAI Ads event id when a server lead event is sent,
- emails the lead via **Resend** (Vercel Marketplace) from `quotes@1800cashforcars.com.au` to `LEAD_TO_EMAIL`,
- logs `[lead] saved <reference>` once the quote is in Supabase. The lead's details are written to the Vercel function logs only when that save fails, as a backup,
- records where the visitor came from (see "Where each quote came from" below),
- retries a failed email once. If it still fails, the customer is asked to call or text instead of seeing a false "thanks", and the email is retried in the background for about three minutes. `LEAD NOT DELIVERED` is logged only if every retry fails.
- shows a generic message if something unexpected fails, and keeps the detail in the server logs.

The quote card's heading is exactly "Get a free quote (Instant)" on every screen (`QuoteFormHeading` in `src/components/QuoteForm.tsx`). Every field shows on every screen size: make, model, year, suburb, name, mobile, email, price and the car's condition. Nothing is folded away on a phone, and the price field is never put behind a link or toggle.

### Where each quote came from
`src/lib/ad-source.ts` notes how a visitor reached the site on the first page of their visit: a Google Ads click ID (`gclid`, `gbraid` or `wbraid`), campaign tags (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`), the landing page and the host of the site that linked to it. It is kept in the browser's session storage for the tab and sent with the quote form. The lead email gets a "Came from" line, for example `Google Ads (google / cpc) · campaign brisbane · landed on /`, and the same details are saved in the `attribution` column in Supabase. To tell ChatGPT ads apart from other visits, add campaign tags to the ad's link, for example `?utm_source=chatgpt&utm_medium=paid&utm_campaign=<name>`.

Phone taps are counted in Vercel Web Analytics and the ChatGPT ads tag. To count them as a Google Ads conversion as well, create a conversion action for phone number clicks in Google Ads and paste its `send_to` value into `GOOGLE_ADS_CALL_CONVERSION` in `src/lib/quote-conversion.ts`. While that is blank nothing is sent to Google for a tap.

The limiter is an in-memory sliding window. Each serverless instance keeps its own counts, and a cold start clears them. A durable limit would need a store such as Upstash, which is a new service and new environment variables, so it is not connected here.

AutoVal lookup allows 20 requests per IP per 10 minutes, and a valuation allows 5. Both return the same short 429 message. Lookup and valuation failures return a generic message; the underlying error is only logged.

Env vars (Vercel): `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN` (from the integration), `LEAD_TO_EMAIL` (comma-separate multiple), `OPENAI_ADS_CAPI_KEY`.

`OPENAI_ADS_CAPI_KEY` is server-only. Do not prefix it with `NEXT_PUBLIC_`. When it is unset, quote submission is unchanged and no server lead event is sent.

## Saving quotes in Supabase

Optional. After the honeypot, the timing check, validation and the rate limit, an accepted quote is inserted into Supabase as well as emailed. Rate-limited requests and incomplete honeypot hits are not stored. A complete honeypot hit is stored with `spam_reason` set and is not emailed. If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is unset, the insert is skipped and the site behaves exactly as it does today: the lead is emailed (and written to the function logs). If the insert fails, the failure is logged on the server and the email still sends. The visitor is not told about the database.

1. Create a Supabase project.
2. Run `supabase/migrations/20261022235000_quote_submissions.sql` in the Supabase SQL editor, or apply it with the Supabase CLI.
3. Run this on the live project so each quote can store its reference. It is not applied from this repo:

```sql
alter table public.quote_submissions add column if not exists ref text unique;
```

The same statement is in `supabase/migrations/20261025160000_quote_submissions_ref.sql`. Until that column exists, the insert fails, the failure is logged, and the email still sends.

Also run `supabase/migrations/20261115120000_quote_submissions_spam_reason.sql` (the `spam_reason` column) and `supabase/migrations/20261123120000_quote_submissions_attribution.sql` (the `attribution` column). Until `attribution` exists, each quote is saved without it and the email still carries the "Came from" line.

4. In the Vercel project settings, add `SUPABASE_URL` (the project URL) and `SUPABASE_SERVICE_ROLE_KEY` (the `service_role` secret) for the environments that should store leads. Add these yourself. Do not prefix the service role key with `NEXT_PUBLIC_`. It bypasses row level security and must stay on the server.

The `quote_submissions` table has row level security enabled and no policies, so the anon and authenticated keys cannot read or write leads. Stored columns are `name`, `phone`, `email`, `address`, `vehicle`, `description`, `expected`, `page`, `ref`, plus `user_agent`. `email` is already a column and is left blank when the visitor skips it. `ref` is the reference from the migration above. `attribution` (JSON) is where the visitor came from, and `spam_reason` is set only on a suspected-spam row. `page` is the source page. `id` and `created_at` are generated by the database. The honeypot and the timing field are not stored.

Make, model and year are separate required form fields. The live table has no columns for them, so the insert writes `vehicle` as `year make model` (for example `2012 Toyota Corolla`) and writes the price to `expected`. That column is `NOT NULL` text, so a blank price is stored as `""`. The email lists Make, Model and Year on their own lines as well as that combined vehicle line, and includes Price only when the visitor entered one. Adding `make`, `model` and `year` columns would keep the three values distinct in the database. That change is not applied from this repo.

## Platform
- Vercel Web Analytics is on (no cookies).
- www redirects to the bare domain. Security headers, including a strict Content-Security-Policy, are set in `next.config.ts`. On Vercel, `scripts/csp-adapter.mjs` fills inline-script hashes into the routing object before the deployment config is written. `scripts/csp-hashes.ts` checks that output. Production bundles may mention `vercel.live` only behind the `__vercel_toolbar=1` cookie; that opt-in is not allowlisted and is not loaded for public visitors.
- Structured data: AutomotiveBusiness, FAQPage and BreadcrumbList.
- Sitemap, robots, social share image, app icons and web manifest are generated in `src/app`.
- Sitemap dates: every date is set by hand and none comes from git or the build. The service pages carry their own `updated` date (see above). Every other page has a date in `src/lib/page-dates.ts`. Change a page's date only when its copy, its title or description, or its schema changes, and only for that page. A styling, layout or shared-component change is not a reason. On the price guide, the schema's `dateModified` is the date printed on the page (`UPDATED_ISO`).

## Develop
```bash
npm install
vercel env pull   # optional: pulls env vars into .env.local
npm run dev
```
