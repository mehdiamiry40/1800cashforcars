/**
 * Carousel for the theme's `.slider[data-flickity-options]` blocks. It builds the same DOM and
 * class names Flickity did (`flickity-viewport`, `flickity-slider`, `is-selected`, page dots,
 * prev/next buttons), so the theme stylesheet, including its fade variant, styles it unchanged.
 */
type Options = {
  cellAlign?: "left" | "center" | "right";
  wrapAround?: boolean;
  autoPlay?: number | boolean;
  pauseAutoPlayOnHover?: boolean;
  prevNextButtons?: boolean;
  pageDots?: boolean;
  adaptiveHeight?: boolean;
  groupCells?: boolean | string | number;
  draggable?: boolean;
};

const ARROW = "M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z";

function arrowButton(direction: "previous" | "next"): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `flickity-button flickity-prev-next-button ${direction}`;
  button.setAttribute("aria-label", direction === "previous" ? "Previous" : "Next");
  button.innerHTML =
    `<svg class="flickity-button-icon" viewBox="0 0 100 100"><path d="${ARROW}" class="arrow"` +
    (direction === "next" ? ' transform="translate(100, 100) rotate(180) "' : "") +
    `></path></svg>`;
  return button;
}

function createSlider(root: HTMLElement): () => void {
  let options: Options = {};
  try {
    options = JSON.parse(root.dataset.flickityOptions ?? "{}");
  } catch {
    // Malformed options: fall back to the defaults.
  }
  const cells = Array.from(root.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el.tagName !== "STYLE");
  if (cells.length === 0) return () => {};

  const viewport = document.createElement("div");
  viewport.className = "flickity-viewport";
  viewport.style.touchAction = "pan-y";
  const track = document.createElement("div");
  track.className = "flickity-slider";
  track.append(...cells);
  viewport.append(track);
  root.append(viewport);
  root.classList.add("flickity-enabled");
  root.tabIndex = 0;

  type Group = { cells: HTMLElement[]; left: number; width: number };
  let groups: Group[] = [];
  let index = 0;
  let width = 0;
  let animate = false;

  const prev = options.prevNextButtons === false ? null : arrowButton("previous");
  const next = options.prevNextButtons === false ? null : arrowButton("next");
  if (prev && next) root.append(prev, next);
  const dots = options.pageDots ? document.createElement("ol") : null;
  if (dots) {
    dots.className = "flickity-page-dots";
    root.append(dots);
  }

  const select = (target: number, userInitiated = false) => {
    if (groups.length === 0) return;
    if (userInitiated) stopAutoplay();
    const last = groups.length - 1;
    index = options.wrapAround ? (target + groups.length) % groups.length : Math.min(Math.max(target, 0), last);
    const group = groups[index];
    let x = -group.left;
    if (options.cellAlign === "center") x += (width - group.width) / 2;
    else if (options.cellAlign === "right") x += width - group.width;
    track.style.transition = animate ? "transform .45s cubic-bezier(.25,.46,.45,.94)" : "";
    track.style.left = "0px";
    track.style.transform = `translateX(${width ? ((x / width) * 100).toFixed(2) : 0}%)`;

    for (const cell of cells) {
      const selected = group.cells.includes(cell);
      cell.classList.toggle("is-selected", selected);
      if (selected) cell.removeAttribute("aria-hidden");
      else cell.setAttribute("aria-hidden", "true");
    }
    const sized = options.adaptiveHeight ? group.cells : cells;
    viewport.style.height = `${Math.max(...sized.map((cell) => cell.offsetHeight))}px`;

    if (dots) {
      Array.from(dots.children).forEach((dot, i) => {
        dot.classList.toggle("is-selected", i === index);
        if (i === index) dot.setAttribute("aria-current", "step");
        else dot.removeAttribute("aria-current");
      });
    }
    const single = groups.length < 2;
    if (prev) prev.disabled = single || (!options.wrapAround && index === 0);
    if (next) next.disabled = single || (!options.wrapAround && index === last);
  };

  const layout = () => {
    width = viewport.getBoundingClientRect().width;
    if (!width) return;
    // Measure the way Flickity did: cells already absolutely positioned, margins included
    // (theme rows use negative side margins, which makes a cell narrower than the viewport).
    for (const cell of cells) {
      cell.style.position = "absolute";
      cell.style.left = "0%";
    }
    let x = 0;
    const measured = cells.map((cell) => {
      const style = getComputedStyle(cell);
      const w = cell.getBoundingClientRect().width + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      const entry = { cell, left: x, width: w };
      x += w;
      return entry;
    });
    for (const { cell, left } of measured) cell.style.left = `${((left / width) * 100).toFixed(2)}%`;
    groups = [];
    if (options.groupCells) {
      for (const entry of measured) {
        const group = groups[groups.length - 1];
        if (group && group.width + entry.width <= width + 1) {
          group.cells.push(entry.cell);
          group.width += entry.width;
        } else groups.push({ cells: [entry.cell], left: entry.left, width: entry.width });
      }
    } else groups = measured.map((entry) => ({ cells: [entry.cell], left: entry.left, width: entry.width }));

    root.classList.toggle("is-draggable", options.draggable !== false && groups.length > 1);
    if (dots && dots.children.length !== groups.length) {
      dots.replaceChildren(
        ...groups.map((_, i) => {
          const dot = document.createElement("li");
          dot.className = "dot";
          dot.setAttribute("aria-label", `Page dot ${i + 1}`);
          return dot;
        }),
      );
    }
    select(Math.min(index, groups.length - 1));
  };

  // Autoplay runs until the visitor takes over, and waits while the pointer is over the slider.
  let timer: number | undefined;
  let autoplay = Boolean(options.autoPlay) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const interval = typeof options.autoPlay === "number" ? options.autoPlay : 3000;
  const tick = () => {
    window.clearTimeout(timer);
    if (!autoplay || groups.length < 2) return;
    timer = window.setTimeout(() => {
      if (!document.hidden) select(index + 1);
      tick();
    }, interval);
  };
  function stopAutoplay() {
    autoplay = false;
    window.clearTimeout(timer);
  }

  const listeners: Array<() => void> = [];
  const listen = (target: EventTarget, type: string, handler: EventListener, opts?: AddEventListenerOptions) => {
    target.addEventListener(type, handler, opts);
    listeners.push(() => target.removeEventListener(type, handler, opts));
  };

  if (prev) listen(prev, "click", () => select(index - 1, true));
  if (next) listen(next, "click", () => select(index + 1, true));
  if (dots) {
    listen(dots, "click", (event) => {
      const dot = (event.target as Element).closest("li");
      if (dot) select(Array.from(dots.children).indexOf(dot), true);
    });
  }
  listen(root, "keydown", (event) => {
    const key = (event as KeyboardEvent).key;
    if (event.target !== root) return;
    if (key === "ArrowLeft") select(index - 1, true);
    if (key === "ArrowRight") select(index + 1, true);
  });
  if (options.pauseAutoPlayOnHover !== false) {
    listen(root, "mouseenter", () => window.clearTimeout(timer));
    listen(root, "mouseleave", tick);
  }

  // Swipe: a mostly-horizontal drag past the threshold moves one page.
  let start: { x: number; y: number } | undefined;
  let swiped = false;
  listen(viewport, "pointerdown", (event) => {
    const e = event as PointerEvent;
    if (options.draggable === false || groups.length < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    start = { x: e.clientX, y: e.clientY };
    swiped = false;
  });
  listen(window, "pointerup", (event) => {
    if (!start) return;
    const e = event as PointerEvent;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = undefined;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiped = true;
      select(index + (dx < 0 ? 1 : -1), true);
    }
  });
  listen(window, "pointercancel", () => (start = undefined));
  // A swipe that ends on a link must not also follow it.
  listen(
    viewport,
    "click",
    (event) => {
      if (swiped) {
        event.preventDefault();
        event.stopPropagation();
        swiped = false;
      }
    },
    { capture: true },
  );
  listen(viewport, "dragstart", (event) => event.preventDefault());

  let frame = 0;
  const relayout = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      animate = false;
      layout();
      animate = true;
    });
  };
  listen(window, "resize", relayout);
  listen(track, "load", relayout, { capture: true }); // images arriving change cell heights

  layout();
  animate = true;
  tick();

  return () => {
    stopAutoplay();
    cancelAnimationFrame(frame);
    listeners.forEach((off) => off());
  };
}

export function initSliders(): () => void {
  const cleanups = Array.from(
    document.querySelectorAll<HTMLElement>(".slider[data-flickity-options]:not(.flickity-enabled)"),
  ).map(createSlider);
  return () => cleanups.forEach((cleanup) => cleanup());
}
