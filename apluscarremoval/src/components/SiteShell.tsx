import type { MenuState } from "@/lib/content";
import { CALL_BUTTON_ICON, PHONE_DISPLAY, PHONE_HREF, SITE_NAME } from "@/lib/site";
import { Footer } from "./Footer";
import { Header, MobileMenu } from "./Header";

/**
 * Page chrome shared by every route: floating call button, header, footer and the off-canvas
 * menu. `mainHtml` is the page body exactly as WordPress rendered it.
 */
export function SiteShell({
  menu,
  bodyClass,
  mainHtml,
}: {
  menu: MenuState;
  /** Page-specific body classes (page-id-10, single-post, …), applied before first paint. */
  bodyClass: string;
  mainHtml: string;
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.body.className=${JSON.stringify(bodyClass)};`,
        }}
      />
      <div className="stick-call-btn">
        <a href={PHONE_HREF}>
          <img src={CALL_BUTTON_ICON} width={70} height={70} alt={SITE_NAME} />
        </a>
      </div>

      <a className="skip-link screen-reader-text" href="#main">
        Skip to content
      </a>

      <div id="wrapper">
        <div className="topmphone">
          <a href={PHONE_HREF} className="button primary is-large topmphone">
            <i className="icon-phone" aria-hidden="true" /> <span>{PHONE_DISPLAY}</span>
          </a>{" "}
        </div>

        <Header menu={menu} />

        <main id="main" className="" dangerouslySetInnerHTML={{ __html: mainHtml }} />

        <Footer menu={menu} />
      </div>

      <MobileMenu menu={menu} />
    </>
  );
}
