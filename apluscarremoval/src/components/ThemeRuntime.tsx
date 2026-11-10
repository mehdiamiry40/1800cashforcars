"use client";

import { useEffect } from "react";
import { initForms } from "@/lib/runtime/forms";
import { initSliders } from "@/lib/runtime/slider";

/**
 * Behaviour the WordPress theme's jQuery bundle used to provide, rewritten without
 * dependencies. Each part toggles the same classes the theme did, so the theme stylesheet
 * (which already styles `.stuck`, `.current-dropdown`, `.mfp-ready`, …) keeps working as is.
 */
export function ThemeRuntime({ recaptchaSiteKey }: { recaptchaSiteKey: string }) {
  useEffect(() => {
    const cleanups = [
      initStickyHeader(),
      initDropdowns(),
      initMobileMenu(),
      initAccordions(),
      initBackToTop(),
      initRelayPagination(),
      initParallax(),
      initSliders(),
      initForms(recaptchaSiteKey),
    ];
    document.documentElement.classList.remove("loading-site");
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [recaptchaSiteKey]);
  return null;
}

type Cleanup = () => void;
const noop: Cleanup = () => {};
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function on<K extends keyof DocumentEventMap>(
  target: Document | Window | Element,
  type: K | string,
  handler: (event: never) => void,
  options?: AddEventListenerOptions,
): Cleanup {
  target.addEventListener(type, handler as EventListener, options);
  return () => target.removeEventListener(type, handler as EventListener, options);
}

/** Header sticks once the page has scrolled its own height plus 100px, and releases at the top. */
function initStickyHeader(): Cleanup {
  const header = document.getElementById("header");
  const wrapper = header?.querySelector<HTMLElement>(".header-wrapper");
  if (!header || !wrapper || !header.classList.contains("has-sticky")) return noop;
  let stickAt: number | undefined;

  const update = () => {
    if (document.documentElement.classList.contains("has-off-canvas")) return;
    const y = window.scrollY;
    stickAt ??= wrapper.offsetHeight + 100;
    if (y > stickAt && !wrapper.classList.contains("stuck")) {
      const height = header.offsetHeight;
      wrapper.classList.add("stuck");
      header.style.height = `${height}px`;
      document.documentElement.style.setProperty("--flatsome--header--sticky-height", `${wrapper.offsetHeight}px`);
    } else if (y < 1 && wrapper.classList.contains("stuck")) {
      header.style.height = "";
      wrapper.classList.remove("stuck", "ux-no-animation");
    }
  };
  const off = on(window, "scroll", update, { passive: true });
  const timer = window.setTimeout(update, 100);
  return () => {
    off();
    window.clearTimeout(timer);
  };
}

/** Desktop dropdowns open on hover or keyboard focus, with a short delay before closing. */
function initDropdowns(): Cleanup {
  const cleanups: Cleanup[] = [];
  for (const item of document.querySelectorAll<HTMLElement>(".header-nav li.has-dropdown")) {
    const link = item.querySelector<HTMLElement>(":scope > a");
    let timer: number | undefined;
    const set = (open: boolean) => {
      item.classList.toggle("current-dropdown", open);
      link?.setAttribute("aria-expanded", String(open));
    };
    const open = () => {
      window.clearTimeout(timer);
      for (const other of item.parentElement?.querySelectorAll(":scope > li.current-dropdown") ?? []) {
        if (other !== item) other.classList.remove("current-dropdown");
      }
      set(true);
    };
    const close = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => set(false), 120);
    };
    cleanups.push(
      on(item, "mouseenter", open),
      on(item, "mouseleave", close),
      on(item, "focusin", open),
      on(item, "focusout", close),
      on(item, "keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape") set(false);
      }),
    );
    if (link && (!link.getAttribute("href") || link.getAttribute("href") === "#")) {
      // Parents without a destination only open their menu (touch screens have no hover).
      cleanups.push(
        on(link, "click", (event: MouseEvent) => {
          event.preventDefault();
          set(!item.classList.contains("current-dropdown"));
        }),
      );
    }
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}

/** Off-canvas menu, using the DOM structure the theme's popup styles expect. */
function initMobileMenu(): Cleanup {
  const menu = document.getElementById("main-menu");
  const trigger = document.querySelector<HTMLElement>('[data-open="#main-menu"]');
  if (!menu || !trigger) return noop;
  const html = document.documentElement;
  const body = document.body;
  let layer: { bg: HTMLElement; wrap: HTMLElement; placeholder: HTMLElement; scrollY: number } | undefined;

  const close = () => {
    if (!layer) return;
    const { bg, wrap, placeholder, scrollY } = layer;
    layer = undefined;
    bg.classList.add("mfp-removing");
    wrap.classList.add("mfp-removing");
    trigger.setAttribute("aria-expanded", "false");
    trigger.classList.remove("current-lightbox-clicked");
    window.setTimeout(
      () => {
        menu.classList.add("mfp-hide");
        placeholder.replaceWith(menu);
        bg.remove();
        wrap.remove();
        html.classList.remove("has-off-canvas", "has-off-canvas-left");
        body.classList.remove("body-scroll-lock--active");
        body.style.overflow = body.style.position = body.style.top = body.style.width = "";
        window.scrollTo(0, scrollY);
        trigger.focus({ preventScroll: true });
      },
      reducedMotion() ? 0 : 300,
    );
  };

  const open = () => {
    if (layer) return;
    const scrollY = window.scrollY;
    const bg = document.createElement("div");
    bg.className = "mfp-bg off-canvas off-canvas-left main-menu-overlay";
    const wrap = document.createElement("div");
    wrap.className = "mfp-wrap mfp-auto-cursor off-canvas off-canvas-left";
    wrap.tabIndex = -1;
    wrap.innerHTML =
      '<div class="mfp-container mfp-s-ready mfp-inline-holder"><div class="mfp-content"></div></div>' +
      '<button title="Close (Esc)" type="button" class="mfp-close"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>';
    const placeholder = document.createElement("div");
    placeholder.className = "mfp-hide";
    menu.replaceWith(placeholder);
    menu.classList.remove("mfp-hide");
    wrap.querySelector(".mfp-content")!.append(menu);
    body.prepend(bg, wrap);

    html.classList.add("has-off-canvas", "has-off-canvas-left");
    body.classList.add("body-scroll-lock--active");
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    trigger.setAttribute("aria-expanded", "true");
    trigger.classList.add("current-lightbox-clicked");
    layer = { bg, wrap, placeholder, scrollY };

    wrap.addEventListener("click", (event) => {
      const target = event.target as Element;
      if (target.closest(".mfp-close") || !target.closest(".mfp-content")) close();
    });
    bg.addEventListener("click", close);
    // Next frame, so the slide-in transition runs from the off-screen position.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bg.classList.add("mfp-ready");
        wrap.classList.add("mfp-ready");
        wrap.focus({ preventScroll: true });
      }),
    );
  };

  const toggleSubmenu = (item: Element) => {
    const active = item.classList.toggle("active");
    item.querySelector(":scope > .toggle")?.setAttribute("aria-expanded", String(active));
  };

  const cleanups = [
    on(trigger, "click", (event: MouseEvent) => {
      event.preventDefault();
      open();
    }),
    on(document, "keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    }),
    on(menu, "click", (event: MouseEvent) => {
      const target = event.target as Element;
      const item = target.closest("li.has-child");
      if (!item) return;
      const link = target.closest("a");
      const isParentRow = target.closest(".toggle") || (link && link.parentElement === item);
      if (!isParentRow) return;
      if (target.closest(".toggle") || !link?.getAttribute("href") || link.getAttribute("href") === "#") {
        event.preventDefault();
        toggleSubmenu(item);
      }
    }),
    on(window, "resize", () => {
      if (layer && window.innerWidth >= 850) close();
    }),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}

function slide(el: HTMLElement, open: boolean, done?: () => void) {
  const finish = () => {
    el.style.height = el.style.overflow = el.style.transition = el.style.paddingTop = el.style.paddingBottom = "";
    el.style.display = open ? "block" : "";
    done?.();
  };
  if (reducedMotion()) return finish();
  if (open) el.style.display = "block";
  const full = el.offsetHeight;
  el.style.overflow = "hidden";
  el.style.height = `${open ? 0 : full}px`;
  if (open) el.style.paddingTop = el.style.paddingBottom = "0";
  void el.offsetHeight; // commit the start height before transitioning
  el.style.transition = "height .2s ease, padding .2s ease";
  el.style.height = `${open ? full : 0}px`;
  el.style.paddingTop = el.style.paddingBottom = open ? "" : "0";
  window.setTimeout(finish, 210);
}

/** One panel open per accordion; a hash matching a panel's title link opens it on load. */
function initAccordions(): Cleanup {
  const toggle = (title: HTMLElement) => {
    const panel = title.nextElementSibling as HTMLElement | null;
    const accordion = title.closest(".accordion");
    if (!panel || !accordion) return;
    const opening = getComputedStyle(panel).display === "none";
    for (const other of accordion.querySelectorAll<HTMLElement>(".accordion-title.active")) {
      if (other.closest(".accordion") !== accordion) continue;
      other.classList.remove("active");
      other.setAttribute("aria-expanded", "false");
      const otherPanel = other.nextElementSibling as HTMLElement | null;
      if (otherPanel) slide(otherPanel, false);
    }
    if (opening) {
      title.classList.add("active");
      title.setAttribute("aria-expanded", "true");
      slide(panel, true, () => window.dispatchEvent(new Event("resize")));
    }
  };

  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash) {
    for (const title of document.querySelectorAll<HTMLElement>(".accordion-title")) {
      if (title.getAttribute("href")?.split("#")[1] === hash && !title.classList.contains("active")) {
        toggle(title);
        window.setTimeout(() => title.parentElement?.scrollIntoView({ behavior: "smooth" }), 500);
        break;
      }
    }
  }
  return on(document, "click", (event: MouseEvent) => {
    const title = (event.target as Element).closest<HTMLElement>(".accordion-title");
    if (!title) return;
    event.preventDefault();
    toggle(title);
  });
}

function initBackToTop(): Cleanup {
  const button = document.getElementById("top-link");
  if (!button) return noop;
  const update = () => button.classList.toggle("active", window.scrollY > window.innerHeight);
  update();
  const cleanups = [
    on(window, "scroll", update, { passive: true }),
    on(button, "click", (event: MouseEvent) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
    }),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * Blog grid pagination. WordPress fetched each page over AJAX; here the later pages are
 * shipped with the document as <template data-relay-page="N"> next to the grid.
 */
function initRelayPagination(): Cleanup {
  const pages = new Map<string, Element>();
  const first = document.querySelector(".ux-relay");
  if (!first) return noop;
  pages.set("1", first.cloneNode(true) as Element);
  for (const template of document.querySelectorAll<HTMLTemplateElement>("template[data-relay-page]")) {
    const relay = template.content.querySelector(".ux-relay");
    if (relay) pages.set(template.dataset.relayPage!, relay);
  }
  return on(document, "click", (event: MouseEvent) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>(".ux-relay__pagination a");
    if (!link) return;
    event.preventDefault();
    const page = pages.get(link.getAttribute("href")?.split("#/page/")[1] ?? "");
    const current = link.closest(".ux-relay");
    if (!page || !current) return;
    const next = page.cloneNode(true) as Element;
    current.replaceWith(next);
    const top = next.getBoundingClientRect().top + window.scrollY - 100;
    if (top < window.scrollY) window.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });
  });
}

/**
 * Parallax section backgrounds (`data-parallax-background`), using the theme's formula: the
 * background is made taller than its section and shifted as the section crosses the viewport.
 * As in the theme, phones and reduced-motion visitors get the plain, static background.
 */
function initParallax(): Cleanup {
  if (reducedMotion()) return noop;
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
  for (const el of elements) el.classList.add("parallax-active");
  const handheld = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  if (handheld && !document.body.classList.contains("parallax-mobile")) return noop;

  const items = elements
    .filter((el) => el.dataset.parallaxBackground !== undefined)
    .map((el) => {
      const amount = Number(el.dataset.parallax);
      return {
        el,
        strength: ((amount / 10) * -1) / (2 - Math.abs(amount) / 10),
        container: el.closest<HTMLElement>(el.dataset.parallaxContainer || "[data-parallax-container]") ?? el,
      };
    })
    .filter((item) => Number.isFinite(item.strength) && item.strength !== 0);
  if (items.length === 0) return noop;

  const update = () => {
    const viewport = window.innerHeight;
    for (const { el, strength, container } of items) {
      const height = container.offsetHeight;
      const extra = (viewport - height) * strength;
      el.style.height = `${height + extra}px`;
      const top = container.getBoundingClientRect().top;
      if (top > viewport || top + height < 0) continue;
      const offset = (viewport / 2 - (top + height / 2)) * strength - extra / 2;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      el.style.backfaceVisibility = "hidden";
    }
  };
  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };
  update();
  const cleanups = [on(window, "scroll", schedule, { passive: true }), on(window, "resize", schedule)];
  return () => {
    cancelAnimationFrame(frame);
    cleanups.forEach((cleanup) => cleanup());
  };
}
