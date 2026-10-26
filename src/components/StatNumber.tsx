import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { ATMOSPHERE_ON } from "../data/site";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function startsAtZero() {
  return (
    ATMOSPHERE_ON &&
    typeof IntersectionObserver !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * A number like "200+" that rolls up from zero once, the first time it scrolls into view.
 * The rolling is NumberFlow (MIT, https://number-flow.barvian.me). The final value is always
 * in the accessible text, and with reduced motion the final value shows straight away.
 */
export function StatNumber({ value }: { value: string }) {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const [shown, setShown] = useState(() => (startsAtZero() ? 0 : target));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (shown === target || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(target);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [shown, target]);

  return (
    <span ref={ref}>
      <NumberFlow
        aria-hidden="true"
        value={shown}
        suffix={suffix}
        format={{ useGrouping: false }}
        animated={ATMOSPHERE_ON}
        transformTiming={{ duration: 1500, easing: EASE }}
        spinTiming={{ duration: 1500, easing: EASE }}
        opacityTiming={{ duration: 400, easing: "ease-out" }}
      />
      <span className="sr-only">{value}</span>
    </span>
  );
}
