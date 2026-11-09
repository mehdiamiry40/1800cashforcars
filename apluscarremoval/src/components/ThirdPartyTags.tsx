import Script from "next/script";
import { ALLI_SITE_ID, GA4_ID, GTM_ID, STATCOUNTER } from "@/lib/site";

/**
 * Analytics and marketing tags from the WordPress site, with the same IDs.
 * They run on the production deployment only, so previews and local runs do not send
 * visits to Analytics. Set NEXT_PUBLIC_ENABLE_TAGS=1 to force them on elsewhere.
 */
const ENABLED = process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_TAGS === "1";

export function ThirdPartyTagsNoScript() {
  if (!ENABLED) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

export function ThirdPartyTags() {
  if (!ENABLED) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA4_ID}');`}
      </Script>
      <Script id="alli-ai" strategy="afterInteractive">
        {`(function (w,d,s,o,f,js,fjs) {w['AlliJSWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);}(window, document, 'script', 'alli', 'https://static.alliai.com/widget/v1.js'));alli('init', '${ALLI_SITE_ID}');alli('optimize', 'all');`}
      </Script>
      <Script id="statcounter-config" strategy="afterInteractive">
        {`var sc_project=${STATCOUNTER.project}; var sc_invisible=1; var sc_security="${STATCOUNTER.security}";`}
      </Script>
      <Script src="https://www.statcounter.com/counter/counter.js" strategy="afterInteractive" />
      <noscript>
        <div className="statcounter">
          <a title="free web stats" href="https://statcounter.com/" target="_blank" rel="noreferrer">
            <img
              className="statcounter"
              src={`https://c.statcounter.com/${STATCOUNTER.project}/0/${STATCOUNTER.security}/1/`}
              alt="free web stats"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </noscript>
    </>
  );
}
