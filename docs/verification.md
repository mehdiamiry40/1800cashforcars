# Design and accessibility verification

27 September 2026. Tested locally against a production Next.js build.

## Automated checks

- `npm test`: 7 passing tests covering required fields, invalid phone/email, missing email configuration, provider rejection, network failure, successful receipt and escaped HTML. The five new error/validation cases failed against the original action before the fix.
- `npm run lint`: passes after removing the temporary third-party audit script.
- `npm run build`: all 22 generated pages complete, including all service and location routes. Next.js prints an environment-only warning about a parent-directory lockfile outside this checkout.
- axe-core WCAG 2 A/AA, 2.1 AA and 2.2 AA checks on `/`, `/contact-us`, `/quote`, `/cash-for-cars`, `/locations/brisbane` and `/privacy` at 320px and 1280px: no automated violations across the 12 page/viewport combinations.
- axe marks three decorative service-link arrow characters on the home and location layouts for manual contrast review (non-text characters). They are hidden from assistive technology, supplement descriptive links and use the same high-contrast green as the link text on white. No text contrast issues remained.
- No horizontal overflow on those layouts at 320px or 1280px; homepage and form also visually checked at 390px.

## Interaction checks

- Skip link moves focus to the main landmark; one stable H1 on the homepage.
- All visible quote fields have associated labels. Informative images have descriptive alternative text; decorative images have empty alt text.
- Phone links use `tel:+61481438444`.
- Mobile menu exposes its expanded state, closes with Escape and returns focus to its toggle.
- FAQ disclosure opens from the keyboard.
- Local form submission without email credentials shows an announced error, focuses the error, retains name and vehicle details and provides the correct phone fallback.
- No browser console errors during the quote flow.
- Images are responsive WebP assets; the hero is preloaded, with fixed image dimensions to prevent layout shifts. The hero no longer auto-advances. Reduced-motion CSS disables smooth scrolling and transitions.

## Limits

These checks improve accessibility but do not constitute a full WCAG certification or manual assistive-technology audit. Screen-reader use with VoiceOver/NVDA and physical mobile devices has not been tested. Live email delivery was not tested: production must have working `RESEND_API_KEY`, verified sending domain and `LEAD_TO_EMAIL`. Provider responses are simulated in tests and no external quote emails were sent.

AI-generated images are labelled illustrative and do not claim to show the real fleet or premises. Existing business claims, service areas and operating hours were retained from the site; only the phone number was newly confirmed by the owner.
