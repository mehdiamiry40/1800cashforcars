import { menuBase, type MenuState } from "@/lib/content";
import { FOOTER_MENUS_TOP, FOOTER_QUICK_LINKS, SOCIAL_LINKS, type FooterMenu } from "@/lib/menus";
import { EMAIL, FOOTER_LOGO, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

function MenuWidget({ widget, menu }: { widget: FooterMenu; menu: MenuState }) {
  return (
    <div id={widget.widgetId} className="col pb-0 widget widget_nav_menu">
      <span className="widget-title">{widget.title}</span>
      <div className="is-divider small" />
      <div className={`menu-${widget.slug}-container`}>
        <ul id={`menu-${widget.slug}`} className="menu">
          {widget.items.map((item) => {
            const key = `footer:${item.id}`;
            const state = menu[key];
            return (
              <li key={item.id} id={`menu-item-${item.id}`} className={(state ?? menuBase[key]).className}>
                <a rel={item.rel} href={item.href} aria-current={state?.current ? "page" : undefined}>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Footer({ menu }: { menu: MenuState }) {
  return (
    <footer id="footer" className="footer-wrapper">
      <div className="footer-widgets footer footer-1">
        <div className="row dark large-columns-4 mb-0">
          {FOOTER_MENUS_TOP.map((widget) => (
            <MenuWidget key={widget.widgetId} widget={widget} menu={menu} />
          ))}
        </div>
      </div>

      <div className="footer-widgets footer footer-2 dark">
        <div className="row dark large-columns-4 mb-0">
          <div id="text-7" className="col pb-0 widget widget_text">
            <div className="textwidget">
              <p>
                <img
                  loading="lazy"
                  decoding="async"
                  className="alignnone size-full wp-image-8546"
                  src={FOOTER_LOGO}
                  alt="Aplus Cash for Cars Brisbane"
                  width={240}
                  height={137}
                />
              </p>
              <p>
                APlus car removal was started with the simple aim to make car selling accessible for everyone. Our sole
                mission is to offer the customer a licensed service to help them get rid of their unwanted vehicle and
                earn cash from the exchange.
              </p>
            </div>
          </div>
          <MenuWidget widget={FOOTER_QUICK_LINKS} menu={menu} />
          <div id="text-6" className="col pb-0 widget widget_text">
            <span className="widget-title">Contact Info</span>
            <div className="is-divider small" />
            <div className="textwidget">
              <p>
                <strong>Address: </strong>
                <a href="https://share.google/WAgQVBLCI2cXjnopq" target="_blank" rel="noopener">
                  79B Breadwell St, Rocklea QLD 4106, Australia
                </a>
                <br />
                <strong>Email:</strong>
                {"\u00a0"}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </p>
              <p>
                <strong>Phone: </strong>
                <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              </p>
              <p>
                <span className="widget-title">Opening Hours</span>
              </p>
              <p>Monday-Friday: 8:00 AM to 5:00 PM</p>
              <p>Saturday: 8:00 AM to 2:00 PM</p>
              <p>Closed on Sunday</p>
            </div>
          </div>
          <div id="text-10" className="col pb-0 widget widget_text">
            <div className="textwidget">
              <p>
                <span className="widget-title">Connect with Us</span>
              </p>
              <div className="is-divider small" />
              <div className="social-icons follow-icons">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    data-label={social.label}
                    className={`icon primary button circle tooltip ${social.key}`}
                    title={`Follow on ${social.label}`}
                    aria-label={`Follow on ${social.label}`}
                    rel="noopener nofollow"
                  >
                    <i className={`icon-${social.key}`} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute-footer dark medium-text-center text-center">
        <div className="container clearfix">
          <div className="footer-secondary pull-right">
            <div className="footer-text inline-block small-block" />
          </div>
          <div className="footer-primary pull-left">
            <div className="copyright-footer">
              <p>
                ©{new Date().getFullYear()} Aplus Car Removal |{" "}
                <a href="https://abr.business.gov.au/ABN/View?abn=39627952916">ABN 39 627 952 916</a> | All Rights
                Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        id="top-link"
        className="back-to-top button icon invert plain fixed bottom z-1 is-outline circle hide-for-medium"
        aria-label="Go to top"
      >
        <i className="icon-angle-up" aria-hidden="true" />
      </button>
    </footer>
  );
}
