/** Canonical public origin. WordPress served the site on the www host. */
export const SITE_ORIGIN = "https://www.apluscarremoval.com.au";
export const SITE_NAME = "Aplus Car Removal";
export const SITE_TAGLINE = "Aplus Car Removal & Wrecking (Brisbane & SEQ)";

export const PHONE_DISPLAY = "0423 514 111";
export const PHONE_HREF = "tel:0423514111";
export const EMAIL = "info@apluscarremoval.com.au";

export const LOGO = "/wp-content/uploads/2025/10/aplus-cashforcars-logo.png";
export const FOOTER_LOGO = "/wp-content/uploads/2025/10/apluscarremoval-logo-black.png";
export const CALL_BUTTON_ICON = "/wp-content/uploads/2022/09/Group-33.svg";

/** Third-party tags carried over unchanged from the WordPress site. */
export const GTM_ID = "GTM-PBVFZF8";
export const GA4_ID = "G-BMCVXPKCB2";
export const ALLI_SITE_ID = "site_7R3BU7YCVRrrNAdq";
export const STATCOUNTER = { project: 13003780, security: "f47958cc" };
/** reCAPTCHA v3 site key (public). The matching secret is RECAPTCHA_SECRET_KEY on the server. */
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "6Ldgx2MaAAAAABDQoOMt6eFDC4kmFhkABYa0O0PN";

/** Classes WordPress put on every <body>; page-specific ones are added from the route. */
export const BODY_CLASS_COMMON =
  "wp-theme-flatsome wp-child-theme-apluscarremoval lightbox nav-dropdown-has-arrow nav-dropdown-has-shadow nav-dropdown-has-border";
