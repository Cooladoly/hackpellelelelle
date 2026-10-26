import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { RoutedRegion, columnBuses, marginBuses } from "./Copper";

type Region = {
  key: string;
  kind: "patch" | "margin";
  /** for a patch: the side its buses start from */
  from?: "left" | "right" | "either";
  seed: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

/** A stable number from a string, so a page keeps the same routing from visit to visit. */
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** The box of an element's content, not of the element (a heading in a grid row is stretched to the row's height). */
function contentBox(el: Element) {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect();
}

/**
 * The box of what is actually drawn inside an element: its lines of text and its images, icons and
 * controls. A paragraph's own box is as wide as its column even when its words stop halfway.
 */
function inkBox(el: Element) {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  const take = (r: DOMRect) => {
    if (!r.width && !r.height) return;
    left = Math.min(left, r.left);
    top = Math.min(top, r.top);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.bottom);
  };
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    take(range.getBoundingClientRect());
  }
  el.querySelectorAll("img, svg, button, input, select, textarea, canvas").forEach((part) => take(part.getBoundingClientRect()));
  return { left, top, right, bottom };
}

/** Clear space kept between routing and anything with words or a part in it. */
const KEEP_OUT = 34;
/** The smallest patch worth routing. */
const MIN_PATCH = 84;

/**
 * Finds the empty board on the current page: in each two-column section, the left column above and
 * below its heading, and the room beside content that stops well short of the right column's edge
 * (the contact email and venue); and the margins either side of the content, from the top of the page (the
 * hero or the page head, which carry their own routing) and the copper pour or the footer.
 */
function measure(main: HTMLElement, path: string): Region[] {
  const box = main.getBoundingClientRect();
  const regions: Region[] = [];
  const add = (key: string, from: Region["from"], left: number, top: number, right: number, bottom: number, minW = 0) => {
    const w = Math.floor(right - left);
    const h = Math.floor(bottom - top);
    if (h < MIN_PATCH || w < Math.max(minW, 120)) return;
    regions.push({ key, kind: "patch", from, seed: hash(`${path}#${key}`), x: Math.round(left - box.left), y: Math.round(top - box.top), w, h });
  };

  if (window.matchMedia("(min-width: 900px)").matches) {
    main.querySelectorAll<HTMLElement>(".split").forEach((split, i) => {
      const [first, second] = [split.children[0], split.children[1]];
      if (!first || !second) return;
      const s = split.getBoundingClientRect();
      const cs = getComputedStyle(split);
      const top = s.top + parseFloat(cs.paddingTop);
      const bottom = s.bottom - parseFloat(cs.paddingBottom);
      const col = first.getBoundingClientRect();
      const heading = contentBox(first);
      // the left column, above and below its heading
      add(`a${i}`, "either", col.left, top + 4, col.right, heading.top - KEEP_OUT);
      add(`b${i}`, "either", col.left, heading.bottom + KEEP_OUT, col.right, bottom - 4);
      // beside content that stops well short of the right column's far edge (the contact email and the
      // venue): wiring comes in from the board's side and ends in vias short of it
      // (not beside lists and tables, whose rules run the column's full width)
      if (!second.matches("ul, ol, table") && !second.querySelector("ul, ol, table")) {
        const part = second.matches(".fp") ? second.getBoundingClientRect() : inkBox(second);
        add(`r${i}`, "right", part.right + KEEP_OUT + 8, part.top, s.right - parseFloat(cs.paddingRight), part.bottom, 240);
      }
    });
  }

  const wrap = main.querySelector(".wrap");
  const head = main.querySelector(".page-band") ?? main.querySelector("section");
  if (wrap && head) {
    const w = wrap.getBoundingClientRect();
    const start = head.getBoundingClientRect().bottom - box.top + 24;
    const pour = main.querySelector(".pour");
    const end = (pour ? pour.getBoundingClientRect().top - box.top : main.scrollHeight) - 28;
    const h = Math.floor(end - start);
    // left margin: from the page edge to just short of the spine (1.1rem outside the content)
    const leftEdge = w.left - box.left - 17.6 - 14;
    const rightStart = w.right - box.left + 22;
    const rightEdge = main.clientWidth - 8;
    // the left margin runs from the top: nothing else is routed there (the chip's wiring and the page
    // heads' fields come in from the right)
    const leftH = Math.floor(end - 24);
    if (leftH > 240 && leftEdge - 8 >= 44) {
      regions.push({ key: "ml", kind: "margin", seed: hash(`${path}#left`), x: 8, y: 24, w: Math.floor(leftEdge - 8), h: leftH });
    }
    if (h > 240 && rightEdge - rightStart >= 44) {
      regions.push({ key: "mr", kind: "margin", seed: hash(`${path}#right`), x: Math.round(rightStart), y: Math.round(start), w: Math.floor(rightEdge - rightStart), h });
    }
  }
  return regions;
}

const same = (a: Region[], b: Region[]) => JSON.stringify(a) === JSON.stringify(b);

function Field({ region }: { region: Region }) {
  const { kind, from, seed, w, h } = region;
  const buses = useMemo(
    () => (kind === "patch" ? columnBuses(seed, w, h, from) : marginBuses(seed, w, h)),
    [kind, from, seed, w, h],
  );
  return <RoutedRegion buses={buses} x={region.x} y={region.y} width={w} height={h} />;
}

/**
 * Copper under the mask for the rest of the page: routing laid into the empty board, measured from the
 * page as it is drawn and laid again when its size or content changes. It sits under everything in
 * <main> and keeps clear of the words.
 */
export function BoardLayer() {
  const { pathname } = useLocation();
  const host = useRef<HTMLDivElement>(null);
  const [regions, setRegions] = useState<Region[]>([]);

  useLayoutEffect(() => {
    const layer = host.current;
    const main = layer?.parentElement;
    if (!layer || !main) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = measure(main, pathname);
        setRegions((prev) => (same(prev, next) ? prev : next));
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(main);
    // a lazily loaded page, or an answer opening, changes what is empty; the layer's own redraws do not count
    const mo = new MutationObserver((records) => {
      if (records.some((r) => !layer.contains(r.target))) update();
    });
    mo.observe(main, { childList: true, subtree: true });
    window.addEventListener("resize", update);
    document.fonts?.ready.then(update);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <div ref={host} className="board-layer" aria-hidden="true">
      {regions.map((r) => (
        <Field key={`${pathname}${r.key}`} region={r} />
      ))}
    </div>
  );
}
