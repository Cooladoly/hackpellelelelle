import { useRef, type CSSProperties } from "react";
import { useCountdown, two } from "@/lib/countdown";
import { ChipFanout } from "./ChipFanout";
import { LedRow } from "./LedRow";
import { Pins } from "./Pins";

/**
 * The clock chip: the countdown shown as two rows of a live dot-matrix display
 * (days and hours, then minutes and seconds). The visible labels are drawn for the eye;
 * the same four values are in a visually hidden list for assistive technology.
 * Before the event it counts down to the start; once the event is under way it counts down its
 * 34 hours, so the hero keeps its clock on the day most people visit; when the 34 hours are up
 * the chip goes away rather than sitting at zero.
 */
export function ClockChip() {
  const t = useCountdown();
  const chip = useRef<HTMLDivElement>(null);
  if (t.phase === "after") return null;

  const rows = [
    { text: `${two(t.days)}:${two(t.hours)}`, labels: ["Days", "Hours"] },
    { text: `${two(t.minutes)}:${two(t.seconds)}`, labels: ["Minutes", "Seconds"] },
  ];

  return (
    // on phones the chip is inset a little so its pins clear the page's spine trace
    <div className="relative mx-3 sm:mx-0">
      <div
        ref={chip}
        role="timer"
        aria-label={t.phase === "before" ? "Time until hack::peel begins" : "Time left in hack::peel"}
        className="chip hero-enter z-[1]"
        style={{ "--d": 520 } as CSSProperties}
      >
        <span className="chip-pin1" aria-hidden="true" />
        <Pins side="l" />
        <Pins side="r" />
        <div className="grid gap-7 px-10 py-12 sm:px-12">
          {rows.map((r) => (
            <div key={r.labels[0]}>
              <LedRow text={r.text} />
              <div className="clock-labels" style={{ gridTemplateColumns: "11fr 3fr 11fr" }} aria-hidden="true">
                <span>{r.labels[0]}</span>
                <span />
                <span>{r.labels[1]}</span>
              </div>
            </div>
          ))}
        </div>
        <dl className="sr-only">
          <dt>Days</dt>
          <dd>{t.days}</dd>
          <dt>Hours</dt>
          <dd>{t.hours}</dd>
          <dt>Minutes</dt>
          <dd>{t.minutes}</dd>
          <dt>Seconds</dt>
          <dd>{t.seconds}</dd>
        </dl>
      </div>
      {/* the chip's pins, routed into the board under the mask (wide screens only); it comes after the
          chip so the chip is mounted when it measures, and sits under it */}
      <ChipFanout chip={chip} />
    </div>
  );
}
