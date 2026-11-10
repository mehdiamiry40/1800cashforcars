import { menuBase, type MenuState } from "@/lib/content";
import { HEADER_MENU, type MenuItem } from "@/lib/menus";
import { LOGO, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

function TopLevelItem({ item, menu }: { item: MenuItem; menu: MenuState }) {
  const key = `header:${item.id}`;
  const state = menu[key];
  const hasChildren = Boolean(item.children?.length);
  return (
    <li id={`menu-item-${item.id}`} className={(state ?? menuBase[key]).className}>
      <a
        href={item.href}
        aria-current={state?.current ? "page" : undefined}
        className="nav-top-link"
        aria-expanded={hasChildren ? "false" : undefined}
        aria-haspopup={hasChildren ? "menu" : undefined}
      >
        {item.label}
        {hasChildren && <i className="icon-angle-down" aria-hidden="true" />}
      </a>
      {hasChildren && (
        <ul className="sub-menu nav-dropdown nav-dropdown-bold">
          {item.children!.map((child) => {
            const childKey = `header:${child.id}`;
            const childState = menu[childKey];
            return (
              <li key={child.id} id={`menu-item-${child.id}`} className={(childState ?? menuBase[childKey]).className}>
                <a href={child.href} aria-current={childState?.current ? "page" : undefined}>
                  {child.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

/** Flatsome "logo left" header. Class names are the theme's, so its stylesheet applies unchanged. */
export function Header({ menu }: { menu: MenuState }) {
  return (
    <header id="header" className="header has-sticky sticky-jump">
      <div className="header-wrapper">
        <div id="masthead" className="header-main ">
          <div className="header-inner flex-row container logo-left medium-logo-left" role="navigation">
            <div id="logo" className="flex-col logo">
              <a href="/" title={`${SITE_NAME} - ${SITE_TAGLINE}`} rel="home">
                <img width={200} height={113} src={LOGO} className="header_logo header-logo" alt={SITE_NAME} />
                <img width={200} height={113} src={LOGO} className="header-logo-dark" alt={SITE_NAME} />
              </a>
            </div>

            <div className="flex-col show-for-medium flex-left">
              <ul className="mobile-nav nav nav-left " />
            </div>

            <div className="flex-col hide-for-medium flex-left flex-grow">
              <ul className="header-nav header-nav-main nav nav-left  nav-size-large nav-spacing-xlarge" />
            </div>

            <div className="flex-col hide-for-medium flex-right">
              <ul className="header-nav header-nav-main nav nav-right  nav-size-large nav-spacing-xlarge">
                {HEADER_MENU.map((item) => (
                  <TopLevelItem key={item.id} item={item} menu={menu} />
                ))}
              </ul>
            </div>

            <div className="flex-col show-for-medium flex-right">
              <ul className="mobile-nav nav nav-right ">
                <li className="nav-icon has-icon">
                  <div className="header-button">
                    <a
                      href="#"
                      className="icon primary button round is-small"
                      data-open="#main-menu"
                      data-pos="left"
                      data-bg="main-menu-overlay"
                      role="button"
                      aria-label="Menu"
                      aria-controls="main-menu"
                      aria-expanded="false"
                      aria-haspopup="dialog"
                    >
                      <i className="icon-menu" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="container">
            <div className="top-divider full-width" />
          </div>
        </div>

        <div className="header-bg-container fill">
          <div className="header-bg-image fill" />
          <div className="header-bg-color fill" />
        </div>
      </div>
    </header>
  );
}

/** Off-canvas menu for small screens. Hidden until the theme runtime opens it. */
export function MobileMenu({ menu }: { menu: MenuState }) {
  return (
    <div id="main-menu" className="mobile-sidebar no-scrollbar mfp-hide">
      <div className="sidebar-menu no-scrollbar ">
        <ul className="nav nav-sidebar nav-vertical nav-uppercase" data-tab="1">
          {HEADER_MENU.map((item) => {
            const key = `mobile:${item.id}`;
            const state = menu[key];
            const hasChildren = Boolean(item.children?.length);
            return (
              <li
                key={item.id}
                className={(state ?? menuBase[key]).className + (hasChildren ? " has-child" : "")}
              >
                <a href={item.href} aria-current={state?.current ? "page" : undefined}>
                  {item.label}
                </a>
                {hasChildren && (
                  <button type="button" className="toggle" aria-label="Toggle" aria-expanded="false">
                    <i className="icon-angle-down" aria-hidden="true" />
                  </button>
                )}
                {item.children?.length ? (
                  <ul className="sub-menu nav-sidebar-ul children">
                    {item.children.map((child) => {
                      const childKey = `mobile:${child.id}`;
                      const childState = menu[childKey];
                      return (
                        <li key={child.id} className={(childState ?? menuBase[childKey]).className}>
                          <a href={child.href} aria-current={childState?.current ? "page" : undefined}>
                            {child.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
