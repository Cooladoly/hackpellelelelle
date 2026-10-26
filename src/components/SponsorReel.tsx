import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Marquee } from "@/components/watermelon/marquee";
import { ScrollFade } from "@/components/watermelon/scroll-fade";
import { ATMOSPHERE_ON, sponsors, type Sponsor } from "../data/site";

const ALL: Sponsor[] = sponsors.tiers.flatMap((t) => t.items);

/** True when nothing should move: the visitor asked for reduced motion, or the atmosphere is off. */
function useStill() {
  const query = "(prefers-reduced-motion: reduce)";
  const [still, setStill] = useState(() => !ATMOSPHERE_ON || window.matchMedia(query).matches);
  useEffect(() => {
    if (!ATMOSPHERE_ON) return;
    const mq = window.matchMedia(query);
    const update = () => setStill(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return still;
}

function Pockets() {
  return ALL.map((s) => (
    <div key={s.name} className="tape-cell">
      <a href={s.href} target="_blank" rel="noopener noreferrer" className="tape-pocket">
        <img
          src={s.logo}
          alt={s.name}
          loading="lazy"
          className={s.white ? "logo-white" : ""}
          // the sponsor wall's sizes, scaled to fit a pocket
          style={{ width: Math.round(s.w * 0.8), marginBlock: -Math.round(s.trim * 0.8) }}
        />
      </a>
    </div>
  ));
}

/**
 * Every sponsor's logo in a pocket of carrier tape, the reel that feeds parts to the machine that
 * places them on a board. The tape feeds slowly (Watermelon UI Marquee); it stops under the pointer
 * or keyboard focus, and a button under it stops it for good. With motion off it is a still strip
 * you can scroll (Watermelon UI Scroll Fade).
 */
export function SponsorReel() {
  const still = useStill();
  const [paused, setPaused] = useState(false);

  if (still) {
    return (
      <ScrollFade label="Sponsors" className="tape">
        <div className="flex">
          <Pockets />
        </div>
      </ScrollFade>
    );
  }
  return (
    <div>
      <Marquee pauseOnHover duration="70s" repeat={3} className={`tape tape-moving ${paused ? "is-paused" : ""}`}>
        <Pockets />
      </Marquee>
      <button
        type="button"
        className="reel-toggle"
        aria-label={paused ? "Play the sponsor reel" : "Pause the sponsor reel"}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play size={15} strokeWidth={2} aria-hidden="true" /> : <Pause size={15} strokeWidth={2} aria-hidden="true" />}
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
