# 1800 Cash For Cars

Website for [1800cashforcars.com.au](https://1800cashforcars.com.au). It's a Next.js (App Router) + Tailwind site, deployed on Vercel from GitHub.

## Edit business details

Business details (phone, hours, email, ABN, address, headline payout, social links, reviews, service areas, FAQs) live in `src/lib/site.ts`. Inner page copy (Cash For Cars, Car Removals, Services, Scrap Car Removal, Car Wreckers, Car Disposal) lives in `src/lib/content.ts`. Change it there, commit, and push. Vercel redeploys automatically.

## Quote requests

The labelled quote form posts to a server action (`src/app/actions.ts`), which emails each lead via **Resend** (provisioned through the Vercel Marketplace).

Env vars (set in Vercel):

- `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN`: added by the Resend integration
- `LEAD_TO_EMAIL`: where leads are sent (comma-separate multiple addresses)

Every lead is also written to the Vercel function logs (`[lead] …`) as a backup. A success message is shown only when the email provider accepts the request. Missing configuration and delivery errors show an accessible error with a call link and retain the entered details for retry.

## Develop

```bash
npm install
vercel env pull   # optional: pulls env vars into .env.local
npm run dev
```

## Verification

Run `npm test`, `npm run lint` and `npm run build`. Tests exercise quote validation, provider acceptance/rejection and network failure without sending email. Browser checks and their limits are recorded in `docs/verification.md`.

The mobile menu supports Escape and focus return. There is a skip link, visible keyboard focus, reduced-motion support and a stable hero heading. Illustrative generated image prompts are in `docs/image-prompts.md`.
