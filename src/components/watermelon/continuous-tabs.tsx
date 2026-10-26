/**
 * Continuous Tabs, from Watermelon UI (MIT, https://registry.watermelon.sh/r/continuous-tabs-base.json).
 * The original is a row of buttons with a pill that springs from one tab to the next (Motion's
 * shared-layout animation). Adapted for hack::peel: real tab semantics with arrow-key, Home and End
 * control, both days set in one dark body, and the pill drawn as a raised cap (signal edge, lighter top
 * face, a lift shadow) that slides across to the selected day; no hidden-until-mounted flash.
 */
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { ATMOSPHERE_ON } from "@/data/site";
import { cn } from "@/lib/utils";

export type ContinuousTab = { id: string; label: ReactNode; detail?: ReactNode };

type Props = {
  tabs: ContinuousTab[];
  value: string;
  onValueChange: (id: string) => void;
  /** Accessible name for the tab list. */
  label: string;
  /** Ids shared with the panels, so each tab names its panel and each panel names its tab. */
  tabId: (id: string) => string;
  panelId: (id: string) => string;
  className?: string;
};

export function ContinuousTabs({ tabs, value, onValueChange, label, tabId, panelId, className }: Props) {
  const group = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = tabs.length;
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    onValueChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    // the sliding cap follows the visitor's reduced-motion setting, and stops entirely with the atmosphere off
    <MotionConfig reducedMotion={ATMOSPHERE_ON ? "user" : "always"}>
      <LayoutGroup id={group}>
        <div
          role="tablist"
          aria-label={label}
          className={cn("relative grid rounded-[var(--radius-part)] border border-n6 bg-n0 sm:grid-cols-2", className)}
        >
          {tabs.map((tab, i) => {
            const active = tab.id === value;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={tabId(tab.id)}
                aria-selected={active}
                aria-controls={panelId(tab.id)}
                tabIndex={active ? 0 : -1}
                onClick={() => onValueChange(tab.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-1 px-6 py-5 text-left transition-colors hover:bg-n2",
                  i > 0 && "border-t border-n4 sm:border-t-0",
                )}
              >
                {/* the cap: it slides across to the selected day */}
                {active && (
                  <motion.span
                    layoutId="continuous-tab-pill"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.9 }}
                    className="jumper-cap absolute inset-1 z-[1] rounded-[var(--radius-field)] border-2 border-signal bg-n3"
                  />
                )}
                <span className={cn("relative z-10 text-xl font-semibold tracking-tight", !active && "text-ink-2")}>{tab.label}</span>
                {tab.detail && <span className={cn("relative z-10 text-sm", active ? "text-ink-2" : "text-ink-3")}>{tab.detail}</span>}
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}
