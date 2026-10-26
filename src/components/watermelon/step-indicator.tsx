/**
 * Step Indicator, from Watermelon UI (MIT, https://registry.watermelon.sh/r/step-indicator-base.json).
 * The original is a row of segments with a tag above them that morphs from step to step: one strip
 * holds every label, and a clip-path shows only the one being pointed at while the strip slides over.
 * Adapted for hack::peel: the segments are an LED bar graph lit up to the current step, the tag rests
 * on the current step instead of only appearing on hover (pointing at or focusing another step previews
 * its name), the segments are real buttons in an ordered list with aria-current, react-icons are gone,
 * and the morph is a CSS transition rather than Motion, so it holds still with reduced motion or with
 * the atmosphere switched off (see .step-tag in index.css) and adds nothing to the page's script.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  steps: string[];
  /** The current step, counting from 1. */
  current: number;
  onSelect: (step: number) => void;
  /** Accessible name for the list of steps. */
  label: string;
  className?: string;
};

export function StepIndicator({ steps, current, onSelect, label, className }: Props) {
  const [shown, setShown] = useState(current - 1);
  const [tag, setTag] = useState<{ clipPath: string; x: number } | null>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => setShown(current - 1), [current]);

  // the tag's left edge lines up with its step's segment, like a silkscreen label beside its part
  useLayoutEffect(() => {
    const place = () => {
      const el = labels.current[shown];
      const btn = buttons.current[shown];
      if (!el || !btn) return;
      const total = labels.current.reduce((sum, l) => sum + (l?.offsetWidth ?? 0), 0);
      const left = el.offsetLeft;
      const right = total - left - el.offsetWidth;
      setTag({
        clipPath: `inset(0 ${(right / total) * 100}% 0 ${(left / total) * 100}% round 2px)`,
        x: btn.offsetLeft - left,
      });
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [shown, steps]);

  const rest = () => setShown(current - 1);

  return (
    <div className={cn("relative pt-12", className)}>
      <div
        aria-hidden="true"
        className="step-tag pointer-events-none absolute left-0 top-0 flex whitespace-nowrap bg-ink text-n0"
        style={tag ? { clipPath: tag.clipPath, transform: `translateX(${tag.x}px)` } : { opacity: 0 }}
      >
        {steps.map((s, i) => (
          <span
            key={s}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="px-3 py-1.5 text-sm font-semibold"
          >
            {s}
          </span>
        ))}
      </div>

      <ol
        aria-label={label}
        className="flex gap-2"
        onMouseLeave={rest}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) rest();
        }}
      >
        {steps.map((s, i) => {
          const n = i + 1;
          const state = n < current ? "done" : n === current ? "current" : "todo";
          return (
            <li key={s} className="flex-1" aria-current={state === "current" ? "step" : undefined}>
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                onClick={() => onSelect(n)}
                onMouseEnter={() => setShown(i)}
                onFocus={() => setShown(i)}
                aria-label={`Step ${n}: ${s}${state === "done" ? ", done" : state === "current" ? ", current step" : ""}`}
                className="group block w-full cursor-pointer py-2 text-left"
              >
                {/* one segment of the LED bar: lit once the step is reached */}
                <span
                  className={cn(
                    "block h-3 rounded-[var(--radius-pad)] transition-colors duration-300",
                    state === "todo" ? "bg-n4 group-hover:bg-n5" : "led-bar-on",
                  )}
                />
                <span className="step-num mt-2.5 block">{n}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
