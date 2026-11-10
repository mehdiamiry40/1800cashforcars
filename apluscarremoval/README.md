# Aplus Car Removal

Website for [apluscarremoval.com.au](https://www.apluscarremoval.com.au): Next.js (App Router), migrated from WordPress (Flatsome theme). It is a separate app from the 1800cashforcars site in the repository root, with its own dependencies and its own Vercel project.

The migration keeps the WordPress site as it was: the same URLs (with trailing slashes), page titles, descriptions, canonical and Open Graph tags, structured data, images at their original `/wp-content/uploads/...` addresses, design, and tracking tags.

## How it is put together

- **Page content** is in `content/html/<page>.html`: the body of each page exactly as WordPress rendered it. `content/routes.json` lists every URL with its title, meta tags, structured data and which menu item is highlighted. One catch-all route, `src/app/[[...slug]]/page.tsx`, prerenders them all.
- **Header, footer and mobile menu** are React components in `src/components`. Menu links are in `src/lib/menus.ts`; phone, email and tag IDs are in `src/lib/site.ts`.
- **Styles** are the WordPress stylesheets, unchanged, loaded in the original order: `src/styles/vendor/` (theme and plugin CSS) and `public/assets/wp-late-styles.css` (the Customizer's "Additional CSS", font faces and block styles, which WordPress printed after the theme). Put new rules in `src/styles/site.css`.
- **Behaviour** the theme's jQuery provided is rewritten without dependencies in `src/components/ThemeRuntime.tsx` and `src/lib/runtime/`: sticky header, dropdowns, off-canvas mobile menu, accordions, sliders, blog pagination, back-to-top and the quote form.
- **Navigation is a full page load**, as on WordPress. Tag Manager, StatCounter, Alli AI and the Trustindex reviews widget each start once per page view and rely on that.

## Editing content

- **Text or images on a page**: edit its file in `content/html/`. Put new images under `public/wp-content/uploads/`.
- **Title, description, social image**: the page's entry in `content/routes.json`.
- **Recent car removals**: add an entry at the top of `items` in `content/recent-removals.json`. The grid and its pages (`?tlzmda_page=2`, …) are generated from that file, 12 per page.
- **Menus**: `src/lib/menus.ts`.
- **A new page**: add the HTML file and a `routes.json` entry (copy a similar page's entry and change `path`, `html`, `title`, `canonical`, `metas`; `lastmod` puts it in the sitemap).
- **A new blog post**: as for a page with `"kind": "post"`, and add its card to `content/html/blog.html` and the relevant `content/html/category__*.html` listing. Add it to `content/search-index.json` to make it searchable.

## Quote form

Every "Sell Your Car Today" form posts to `POST /api/contact/` (`src/app/api/contact/route.ts`, rules in `src/lib/quote.ts`). It is the Contact Form 7 form from WordPress: same seven required fields, same messages, same `wpcf7mailsent` browser event for conversion tracking.

- The lead is emailed with **Resend** to `LEAD_TO_EMAIL`, with the customer's address as reply-to, and is also written to the function logs (`[lead] …`).
- If the email cannot be sent the visitor sees the error message, not a false thank-you.
- 5 submissions per IP per 10 minutes (in memory, per serverless instance).
- reCAPTCHA v3 runs on the production domain. The score is verified only when `RECAPTCHA_SECRET_KEY` is set.

Environment variables (Vercel):

| Name | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Required to send leads. |
| `LEAD_FROM_EMAIL` | Required. Sender on a domain verified in Resend, e.g. `Aplus Car Removal <quotes@apluscarremoval.com.au>`. |
| `LEAD_TO_EMAIL` | Recipients, comma-separated. Defaults to `info@apluscarremoval.com.au`. |
| `RECAPTCHA_SECRET_KEY` | Optional. Secret for the existing reCAPTCHA v3 site key. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Optional. Only if the site key changes. |
| `NEXT_PUBLIC_ENABLE_TAGS` | Optional. `1` loads the analytics tags outside production. |

## Platform

- Tags (Tag Manager `GTM-PBVFZF8`, GA4 `G-BMCVXPKCB2`, Alli AI, StatCounter) load on the production deployment only.
- `next.config.ts` holds the redirects WordPress served (`/cash-for-cars-brisbane/`, `/recent-purchases/`, `/sell-scrap-cars-for-cash/`, author and feed URLs), the bare-domain to `www` redirect, and the rewrites for `/?s=` search and the removals grid pages.
- Sitemaps keep their Yoast addresses: `/sitemap_index.xml`, `/page-sitemap.xml`, `/post-sitemap.xml`.
- Vercel project settings: Root Directory `apluscarremoval`, framework Next.js, default build command.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Re-importing from WordPress

`scripts/import-wordpress.mjs` rebuilds `content/`, `public/wp-content/` and the vendor stylesheets from the live WordPress site. Use it only while WordPress is still the source of truth: it overwrites `content/`, including any edits made here.

```bash
NODE_USE_ENV_PROXY=1 node scripts/import-wordpress.mjs
```

The theme stylesheet (`flatsome.css`) and icon font come from the Flatsome theme the site is licensed for.
