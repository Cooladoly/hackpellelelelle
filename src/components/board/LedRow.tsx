/**
 * One row of a 5x7 dot-matrix display, drawn on a canvas. Each dot is its own LED: when the text
 * changes the dots that differ switch off and on one at a time, and on first paint a scan runs
 * across the row once. With reduced motion (or ATMOSPHERE_ON off) it simply shows the text.
 * It is decoration only; the readable value lives in the markup around it.
 */
import { useEffect, useRef } from "react";
import { ATMOSPHERE_ON } from "@/data/site";

const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ":": ["0", "0", "1", "0", "1", "0", "0"],
};
const ROWS = 7;

type Cell = { x: number; y: number; on: boolean };

function layout(text: string) {
  const cells: Cell[] = [];
  let x0 = 0;
  [...text].forEach((ch, i) => {
    const g = GLYPHS[ch] ?? GLYPHS["0"];
    g.forEach((row, y) => [...row].forEach((bit, x) => cells.push({ x: x0 + x, y, on: bit === "1" })));
    x0 += g[0].length + (i < text.length - 1 ? 1 : 0);
  });
  return { cells, cols: x0 };
}

type LedColors = { cyan: number[]; hot: number[]; off: string };

/**
 * The LED colours come from the design tokens (a canvas cannot read CSS variables itself):
 * --color-signal when lit, --color-signal-hot for the flash as a dot comes on, and --color-ink,
 * very faint, for a dot that is off. The fallbacks are the same values, for a page without the stylesheet.
 */
function ledColors(): LedColors {
  const css = getComputedStyle(document.documentElement);
  const rgb = (name: string, fallback: number[]) => {
    const m = /^#([0-9a-f]{6})$/i.exec(css.getPropertyValue(name).trim());
    if (!m) return fallback;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  return {
    cyan: rgb("--color-signal", [0, 191, 255]),
    hot: rgb("--color-signal-hot", [214, 246, 255]),
    off: css.getPropertyValue("--color-ink").trim() || "rgb(242 244 246)",
  };
}

export function LedRow({ text, className }: { text: string; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sim = useRef<{
    cols: number;
    cells: Cell[];
    level: Float32Array;
    from: Float32Array;
    to: Float32Array;
    start: Float64Array;
    raf: number;
  } | null>(null);
  const animate = useRef(false);
  const colors = useRef<LedColors | null>(null);

  /** Draw the current levels at the canvas's current size. */
  const paint = () => {
    const c = canvas.current;
    const s = sim.current;
    if (!c || !s) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const pitch = c.width / s.cols;
    const r = pitch * 0.36;
    const now = performance.now();
    if (!colors.current) colors.current = ledColors();
    const col = colors.current;
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < s.cells.length; i++) {
      const cx = (s.cells[i].x + 0.5) * pitch;
      const cy = (s.cells[i].y + 0.5) * pitch;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = col.off;
      ctx.globalAlpha = 0.085;
      ctx.fill();
      ctx.globalAlpha = 1;
      const lvl = s.level[i];
      if (lvl > 0.02) {
        const heat = s.to[i] > s.from[i] ? Math.min(1, Math.max(0, 1 - (now - s.start[i]) / 220)) : 0;
        const mix = (k: number) => Math.round(col.cyan[k] + (col.hot[k] - col.cyan[k]) * heat);
        ctx.save();
        ctx.shadowColor = `rgba(${col.cyan.join(",")},0.85)`;
        ctx.shadowBlur = pitch * 0.6 * lvl;
        ctx.fillStyle = `rgba(${mix(0)},${mix(1)},${mix(2)},${0.18 + 0.82 * lvl})`;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  };

  const run = () => {
    const s = sim.current;
    if (!s || s.raf) return;
    const step = () => {
      const now = performance.now();
      let busy = false;
      for (let i = 0; i < s.level.length; i++) {
        const t = (now - s.start[i]) / 240;
        if (t >= 1) s.level[i] = s.to[i];
        else {
          busy = true;
          const k = Math.max(0, t);
          s.level[i] = s.from[i] + (s.to[i] - s.from[i]) * (1 - Math.pow(1 - k, 3));
        }
      }
      paint();
      s.raf = busy ? requestAnimationFrame(step) : 0;
    };
    s.raf = requestAnimationFrame(step);
  };

  // size the canvas to its box and redraw when it changes
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const fit = () => {
      const s = sim.current;
      const cols = s?.cols ?? layout(text).cols;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(c.clientWidth * dpr));
      c.width = w;
      c.height = Math.round((w / cols) * ROWS);
      paint();
    };
    animate.current =
      ATMOSPHERE_ON && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    fit();
    return () => {
      ro.disconnect();
      if (sim.current) cancelAnimationFrame(sim.current.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a new text: switch only the dots that differ, each after a small random delay
  useEffect(() => {
    const { cells, cols } = layout(text);
    const now = performance.now();
    const prev = sim.current;
    if (!prev || prev.cells.length !== cells.length) {
      const n = cells.length;
      const first = {
        cols,
        cells,
        level: new Float32Array(n),
        from: new Float32Array(n),
        to: Float32Array.from(cells, (c) => (c.on ? 1 : 0)),
        start: new Float64Array(n),
        raf: 0,
      };
      if (animate.current) {
        // the power-up scan: a wave crosses the row from left to right
        for (let i = 0; i < n; i++) first.start[i] = now + 950 + (cells[i].x / cols) * 800;
      } else {
        first.level.set(first.to);
        first.start.fill(now - 1000);
      }
      sim.current = first;
    } else {
      cancelAnimationFrame(prev.raf);
      prev.raf = 0;
      prev.cells = cells;
      for (let i = 0; i < cells.length; i++) {
        const target = cells[i].on ? 1 : 0;
        if (target !== prev.to[i]) {
          prev.from[i] = prev.level[i];
          prev.to[i] = target;
          prev.start[i] = animate.current ? now + Math.random() * 200 : now - 1000;
          if (!animate.current) prev.level[i] = target;
        }
      }
    }
    const c = canvas.current;
    if (c) c.height = Math.round((c.width / (sim.current?.cols ?? cols)) * ROWS);
    if (animate.current) run();
    else paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // the aspect ratio is set up front so the row never changes height after it mounts
  return (
    <canvas
      ref={canvas}
      className={className ?? "led"}
      style={{ aspectRatio: `${layout(text).cols} / ${ROWS}` }}
      aria-hidden="true"
    />
  );
}
