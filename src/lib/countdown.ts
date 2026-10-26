import { useEffect, useState } from "react";
import { EVENT_END, EVENT_START } from "@/data/site";

export type Remaining = {
  /** "before" counts down to the start, "during" counts down the 34 hours that follow, "after" means there is nothing left to show. */
  phase: "before" | "during" | "after";
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function remaining(now: number): Remaining {
  const start = EVENT_START.getTime();
  const end = EVENT_END.getTime();
  const phase = now < start ? "before" : now < end ? "during" : "after";
  const target = phase === "before" ? start : end;
  const s = Math.floor(Math.max(0, target - now) / 1000);
  return {
    phase,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** Time left until the event starts, then until its 34 hours are up; refreshed every second. */
export function useCountdown(): Remaining {
  const [t, setT] = useState(() => remaining(Date.now()));
  useEffect(() => {
    const tick = window.setInterval(() => setT(remaining(Date.now())), 1000);
    return () => window.clearInterval(tick);
  }, []);
  return t;
}

export const two = (n: number) => String(n).padStart(2, "0");
