import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Copper under the mask: the board's routing, seen faintly through the soldermask the way it shows
 * on a real board. Buses of parallel traces turn in 45-degree steps and drop into vias. A few traces
 * carry signal: a short cyan pulse runs along them every few seconds, only while they are on screen
 * and only when motion is welcome (see .copper in index.css). All of it is aria-hidden decoration.
 */

type Pt = { x: number; y: number };

/** A direction in 45-degree steps, y pointing down: 0 east, 1 south-east, 2 south, 3 south-west, 4 west, 5 north-west, 6 north, 7 north-east. */
export type Heading = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
/** A straight run: its heading and its length in px. */
export type Run = readonly [Heading, number];

export type Bus = {
  /** where the bus's centre line starts */
  at: readonly [number, number];
  /** how many parallel traces */
  n: number;
  /** centre-to-centre spacing of the traces, px */
  pitch?: number;
  runs: readonly Run[];
  /** how the traces finish: vias in two staggered rows, vias stepped in a diagonal, or nothing (they run off the board) */
  end?: "vias" | "ramp" | "open";
  /** a via where each trace starts (it comes up from another layer) */
  startVia?: boolean;
  /** traces that carry a pulse, as [trace index, delay in seconds] */
  pulses?: readonly (readonly [number, number])[];
  /** pulses run from the far end back to the start (signal arriving at a part) */
  inbound?: boolean;
};

const D = Math.SQRT1_2;
const STEP: readonly Pt[] = [
  { x: 1, y: 0 },
  { x: D, y: D },
  { x: 0, y: 1 },
  { x: -D, y: D },
  { x: -1, y: 0 },
  { x: -D, y: -D },
  { x: 0, y: -1 },
  { x: D, y: -D },
];

function centreLine(bus: Bus): Pt[] {
  const pts: Pt[] = [{ x: bus.at[0], y: bus.at[1] }];
  for (const [h, len] of bus.runs) {
    const p = pts[pts.length - 1];
    pts.push({ x: p.x + STEP[h].x * len, y: p.y + STEP[h].y * len });
  }
  return pts;
}

/** The centre line moved sideways by `o` px, mitred at each bend, so parallel traces keep their spacing through a turn. */
function shift(line: Pt[], o: number): Pt[] {
  const normals = line.slice(1).map((p, i) => {
    const q = line[i];
    const len = Math.hypot(p.x - q.x, p.y - q.y) || 1;
    return { x: -(p.y - q.y) / len, y: (p.x - q.x) / len };
  });
  return line.map((p, i) => {
    if (i === 0) return { x: p.x + normals[0].x * o, y: p.y + normals[0].y * o };
    if (i === line.length - 1) {
      const n = normals[i - 1];
      return { x: p.x + n.x * o, y: p.y + n.y * o };
    }
    const a = normals[i - 1];
    const b = normals[i];
    const k = o / (1 + a.x * b.x + a.y * b.y);
    return { x: p.x + (a.x + b.x) * k, y: p.y + (a.y + b.y) * k };
  });
}

type Trace = { pts: Pt[]; len: number };

function traces(bus: Bus): Trace[] {
  const pitch = bus.pitch ?? 10;
  const line = centreLine(bus);
  const first = STEP[bus.runs[0][0]];
  const last = STEP[bus.runs[bus.runs.length - 1][0]];
  return Array.from({ length: bus.n }, (_, k) => {
    const pts = shift(line, (k - (bus.n - 1) / 2) * pitch);
    // stagger the ends (and the starting vias) so neighbouring vias never touch
    const extra = bus.end === "ramp" ? k * 13 : bus.end === "open" ? 0 : (k % 2) * 15;
    const e = pts[pts.length - 1];
    pts[pts.length - 1] = { x: e.x + last.x * extra, y: e.y + last.y * extra };
    if (bus.startVia && k % 2) pts[0] = { x: pts[0].x - first.x * 15, y: pts[0].y - first.y * 15 };
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    return { pts, len };
  });
}

const path = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");

const VIA_R = 4.5;

/** The traces, vias and pulses of a set of buses, for use inside an <svg>. */
export function Routing({ buses }: { buses: readonly Bus[] }) {
  const routed = buses.map((bus) => ({ bus, ts: traces(bus) }));
  return (
    <>
      <g className="copper-trace">
        {routed.flatMap(({ ts }, b) => ts.map((t, k) => <path key={`${b}.${k}`} d={path(t.pts)} />))}
      </g>
      <g className="copper-via">
        {routed.flatMap(({ bus, ts }, b) =>
          ts.flatMap((t, k) => {
            const vias: ReactNode[] = [];
            const e = t.pts[t.pts.length - 1];
            if (bus.end !== "open") vias.push(<circle key={`${b}.${k}.e`} cx={e.x} cy={e.y} r={VIA_R} />);
            if (bus.startVia) vias.push(<circle key={`${b}.${k}.s`} cx={t.pts[0].x} cy={t.pts[0].y} r={VIA_R} />);
            return vias;
          }),
        )}
      </g>
      <g className="copper-pulses">
        {routed.flatMap(({ bus, ts }, b) =>
          (bus.pulses ?? []).flatMap(([k, delay]) => {
            const t = ts[k];
            if (!t) return [];
            const d = path(bus.inbound ? [...t.pts].reverse() : t.pts);
            // --lenn is the trace's length as a plain number; index.css turns it into the dash and the timing
            const style = { "--lenn": Math.round(t.len), "--delay": `${delay}s` } as CSSProperties;
            // a soft halo under a bright core, both running the same dash
            return [
              <path key={`${b}.${k}.h`} className="copper-halo" d={d} style={style} />,
              <path key={`${b}.${k}.p`} className="copper-pulse" d={d} style={style} />,
            ];
          }),
        )}
      </g>
    </>
  );
}

/**
 * Whether an element is on screen, so its pulses only run when someone can see them. Returns a
 * callback ref, which also covers an element that only appears after the first render.
 */
export function useOnScreen<T extends Element>() {
  const [el, setEl] = useState<T | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { rootMargin: "60px" });
    io.observe(el);
    return () => io.disconnect();
  }, [el]);
  return [setEl, on] as const;
}

/* ---------- a field of routing for the top of a page ---------- */

/** A small seeded random source, so each page's routing is fixed and the same on every visit. */
function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Lays buses in horizontal lanes so they never cross: each enters from the board's right edge (or comes up
 * through vias), runs left, turns 45 degrees up or down inside its lane, runs on and ends in vias.
 */
export function fieldBuses(seed: number, width: number, height: number): Bus[] {
  const rand = seeded(seed);
  const pick = (a: number, b: number) => a + rand() * (b - a);
  const buses: Bus[] = [];
  let top = pick(10, 34);
  let pulses = 0;
  while (top < height - 40) {
    const n = 2 + Math.floor(rand() * 6);
    const pitch = 10;
    const span = (n - 1) * pitch;
    const rise = Math.round(pick(22, 64));
    const up = rand() < 0.5;
    const lane = span + rise + 16;
    if (top + lane > height) break;
    const y = up ? top + rise + span / 2 + 8 : top + span / 2 + 8;
    const fromEdge = rand() < 0.72;
    const x = fromEdge ? width + 4 : width - pick(24, 150);
    const first = pick(fromEdge ? 90 : 40, fromEdge ? 330 : 160);
    const second = pick(70, 300);
    const hasPulse = fromEdge && pulses < 3 && rand() < 0.75;
    buses.push({
      at: [x, y],
      n,
      pitch,
      runs: [
        [4, first],
        [up ? 5 : 3, rise * Math.SQRT2],
        [4, second],
      ],
      end: rand() < 0.5 ? "vias" : "ramp",
      startVia: !fromEdge,
      pulses: hasPulse ? [[Math.floor(rand() * n), Number((pulses * 2.6 + pick(0, 1.4)).toFixed(2))]] : undefined,
    });
    if (hasPulse) pulses++;
    top += lane + pick(8, 30);
  }
  return buses;
}

/**
 * Routing for a patch of empty board inside the content (under a section's heading, or beside a part
 * that does not fill its column): buses come up through vias at one side, run across, turn 45 degrees
 * inside their lane and drop into vias before the other side, so nothing reaches the content. `from`
 * says which side they start from ("right" for a patch whose left side faces content).
 */
export function columnBuses(seed: number, width: number, height: number, from: "left" | "right" | "either" = "either"): Bus[] {
  const rand = seeded(seed);
  const pick = (a: number, b: number) => a + rand() * (b - a);
  const buses: Bus[] = [];
  let top = pick(0, 16);
  let pulsed = false;
  while (top < height - 30) {
    const n = 2 + Math.floor(rand() * 5);
    const pitch = 10;
    const span = (n - 1) * pitch;
    const rise = Math.round(pick(16, 44));
    const up = rand() < 0.5;
    const lane = span + rise + 14;
    if (top + lane > height) break;
    const y = up ? top + rise + span / 2 + 7 : top + span / 2 + 7;
    const fromLeft = from === "either" ? rand() < 0.6 : from === "left";
    const end = rand() < 0.5 ? "vias" : "ramp";
    const tail = end === "ramp" ? (n - 1) * 13 : 15;
    const usable = width - 30 - tail;
    const first = pick(0.1, 0.38) * usable;
    const second = Math.max(24, Math.min(pick(0.3, 0.6) * usable, usable - first - rise));
    const pulse = !pulsed && rand() < 0.5;
    buses.push({
      // a bus starting at the right keeps its staggered vias (15px further out) inside the patch
      at: [fromLeft ? 10 : width - 24, y],
      n,
      pitch,
      runs: [
        [fromLeft ? 0 : 4, first],
        [fromLeft ? (up ? 7 : 1) : up ? 5 : 3, rise * Math.SQRT2],
        [fromLeft ? 0 : 4, second],
      ],
      end,
      startVia: true,
      pulses: pulse ? [[Math.floor(rand() * n), Number(pick(0, 3).toFixed(2))]] : undefined,
    });
    if (pulse) pulsed = true;
    top += lane + pick(18, 46);
  }
  return buses;
}

/**
 * Routing for a page margin: trunks side by side (one in a narrow margin, up to four in a wide one),
 * each a bus that comes up through vias, runs down its own lane, steps sideways at 45 degrees now and
 * then without leaving the lane, and drops into vias at the foot. Lanes never overlap, so no trunks cross.
 */
export function marginBuses(seed: number, width: number, height: number): Bus[] {
  const rand = seeded(seed);
  const pick = (a: number, b: number) => a + rand() * (b - a);
  if (height < 200) return [];
  const lanes = Math.max(1, Math.min(4, Math.floor((width + 16) / 86)));
  const laneW = width / lanes;
  const buses: Bus[] = [];
  for (let l = 0; l < lanes; l++) {
    const fit = Math.floor((laneW - 30) / 10) + 1;
    const n = Math.max(2, Math.min(5, lanes > 1 ? 2 + Math.floor(rand() * (Math.min(5, fit) - 1)) : fit));
    const span = (n - 1) * 10;
    const lo = l * laneW + span / 2 + 10;
    const hi = (l + 1) * laneW - span / 2 - 10;
    if (hi < lo) continue;
    // neighbouring trunks start and stop at different heights
    const start = 14 + (l % 2 ? pick(60, 260) : pick(0, 40));
    const stop = height - (l % 2 ? pick(0, 40) : pick(40, 220));
    let x = lo + rand() * (hi - lo);
    const x0 = x;
    let y = start;
    const runs: Run[] = [];
    while (y < stop - 40) {
      const straight = Math.min(pick(220, 620), stop - 40 - y);
      runs.push([2, straight]);
      y += straight;
      if (y >= stop - 80) break;
      const step = Math.round(pick(12, 30));
      const right = hi - x >= step && (rand() < 0.5 || x - lo < step);
      if (right) x += step;
      else if (x - lo >= step) x -= step;
      else continue;
      runs.push([right ? 1 : 3, step * Math.SQRT2]);
      y += step;
    }
    if (!runs.length) continue;
    buses.push({
      at: [x0, start],
      n,
      pitch: 10,
      runs,
      end: "vias",
      startVia: true,
      pulses: [[Math.floor(rand() * n), Number(pick(0, 5).toFixed(2))]],
    });
  }
  return buses;
}

/** One region of routing laid on the page background by BoardLayer, drawn at its measured place and size. */
export function RoutedRegion({
  buses,
  x,
  y,
  width,
  height,
}: {
  buses: readonly Bus[];
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const [ref, on] = useOnScreen<SVGSVGElement>();
  return (
    <svg
      ref={ref}
      className="copper"
      data-live={on ? "" : undefined}
      style={{ left: x, top: y }}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <Routing buses={buses} />
    </svg>
  );
}

/**
 * A field of routing pinned to the top right of its (relative, clipped) parent, as tall as the parent
 * so no bus is cut off at its foot, fading out toward the content on the left.
 */
export function CopperField({ seed, width = 880, className = "" }: { seed: number; width?: number; className?: string }) {
  const [el, setEl] = useState<SVGSVGElement | null>(null);
  const [onScreen, on] = useOnScreen<SVGSVGElement>();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const parent = el?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => setHeight(Math.round(parent.clientHeight)));
    ro.observe(parent);
    return () => ro.disconnect();
  }, [el]);

  const buses = useMemo(() => (height ? fieldBuses(seed, width, height) : []), [seed, width, height]);
  const ref = useCallback(
    (node: SVGSVGElement | null) => {
      setEl(node);
      onScreen(node);
    },
    [onScreen],
  );
  return (
    <svg
      ref={ref}
      className={`copper copper-field ${className}`}
      data-live={on ? "" : undefined}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <Routing buses={buses} />
    </svg>
  );
}
