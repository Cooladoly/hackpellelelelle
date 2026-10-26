import { useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";
import { Routing, useOnScreen, type Bus } from "./Copper";

type Geometry = { w: number; h: number; ys: number[]; room: number };

const WIDE = "(min-width: 1024px)";

/**
 * The clock chip's pins, wired into the board under the mask: the right-hand pins fan out and run off
 * to the board's edge (two of them carry signal in toward the chip), the left-hand pins drop straight
 * into vias, the way a real package is fanned out. Drawn only when the chip sits in its own column.
 */
export function ChipFanout({ chip }: { chip: RefObject<HTMLElement | null> }) {
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [ref, on] = useOnScreen<SVGSVGElement>();

  useLayoutEffect(() => {
    const el = chip.current;
    if (!el) return;
    const mq = window.matchMedia(WIDE);
    const measure = () => {
      if (!mq.matches) return setGeo(null);
      const box = el.getBoundingClientRect();
      const ys = [...el.querySelectorAll<HTMLElement>(".pins-r .pin")].map((p) => {
        const r = p.getBoundingClientRect();
        return r.top + r.height / 2 - box.top;
      });
      setGeo({ w: box.width, h: box.height, ys, room: document.documentElement.clientWidth - box.right });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [chip]);

  if (!geo || geo.ys.length < 10) return null;
  const { w, h, ys, room } = geo;
  const s = ys[1] - ys[0];
  const x0 = w + 15; // the outer end of a right-hand pin
  const out = room + 40; // far enough to leave the screen

  const buses: Bus[] = [
    // the top four pins turn up and away
    { at: [x0, (ys[0] + ys[3]) / 2], n: 4, pitch: s, runs: [[0, 22], [7, 64], [0, out]], end: "open", pulses: [[1, 1.2]], inbound: true },
    // the middle two run out a little way and drop into vias
    { at: [x0, (ys[4] + ys[5]) / 2], n: 2, pitch: s, runs: [[0, 46]], end: "vias" },
    // the bottom four turn down and away
    { at: [x0, (ys[6] + ys[9]) / 2], n: 4, pitch: s, runs: [[0, 22], [1, 64], [0, out]], end: "open", pulses: [[2, 4.6]], inbound: true },
    // every left-hand pin steps out and drops into a via
    ...ys.map<Bus>((y, i) => ({ at: [-15, y], n: 1, runs: [[4, 12], [i < 5 ? 5 : 3, 16]], end: "vias" })),
  ];

  return (
    <svg
      ref={ref}
      className="copper hero-enter"
      data-live={on ? "" : undefined}
      style={{ inset: 0, zIndex: 0, "--d": 900 } as CSSProperties}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <Routing buses={buses} />
    </svg>
  );
}
