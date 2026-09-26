# 1800 Cash For Cars

Website for [1800cashforcars.com.au](https://1800cashforcars.com.au). It's a Next.js (App Router) + Tailwind site, deployed on Vercel from GitHub.

## Edit business details
Everything (phone number, hours, email, ABN, service areas, FAQs) lives in `src/lib/site.ts`. Change it there, commit, and push. Vercel redeploys automatically.

## Quote requests
The 3-step quote form posts to a server action (`src/app/actions.ts`), which emails each lead via **Resend** (provisioned through the Vercel Marketplace).

Env vars (set in Vercel):
- `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN`: added by the Resend integration
- `LEAD_TO_EMAIL`: where leads are sent (comma-separate multiple addresses)

Every lead is also written to the Vercel function logs (`[lead] …`) as a backup.

## Develop
```bash
npm install
vercel env pull   # optional: pulls env vars into .env.local
npm run dev
```
