import type { CSSProperties } from "react";
import { ArrowRight, Award, Code, Sparkles, Users, type LucideIcon } from "lucide-react";
import { ClockChip } from "../components/board/ClockChip";
import { SwitchLink } from "@/components/board/switch";
import { Link } from "../components/Link";
import { SponsorReel } from "../components/SponsorReel";
import { StatNumber } from "../components/StatNumber";
import { Branded, Wordmark } from "../components/Wordmark";
import { useTitle } from "../components/useTitle";
import { TEAM_URL, home, sponsors } from "../data/site";

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

/** The live site's icon for each reason, in the same order as home.features. */
const reasonIcons: LucideIcon[] = [Code, Users, Sparkles, Award];

export function Home() {
  useTitle();

  return (
    <>
      {/* the hero: the logo, what, why, the two actions, when and where; the clock chip beside it, wired into the board */}
      <section className="overflow-x-clip">
        <div className="wrap pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(2.5rem,6vw,4.5rem)]">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-16">
            <div className="lg:col-span-7">
              <h1 className="t-display">
                <span className="enter-wipe inline-block" style={delay(160)}>
                  <Wordmark glow bar />
                </span>
              </h1>
              <p
                className="hero-enter mt-7 text-[clamp(1.625rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.025em]"
                style={delay(430)}
              >
                {home.tagline}
              </p>
              <p className="t-lede hero-enter mt-4" style={delay(540)}>
                {home.sub}
              </p>
              <div className="hero-enter mt-10 flex flex-col gap-4 sm:flex-row" style={delay(650)}>
                <SwitchLink to="/register">
                  Register Now
                  <ArrowRight size={18} strokeWidth={2} className="arrow" aria-hidden="true" />
                </SwitchLink>
                <SwitchLink to="/schedule" variant="secondary">
                  View Schedule
                </SwitchLink>
              </div>
              <p className="hero-enter mt-10 leading-snug" style={delay(760)}>
                <span className="block text-[clamp(1.125rem,1.6vw,1.25rem)] font-semibold tracking-[-0.015em]">
                  Saturday, December 12th, 2026
                </span>
                <span className="mt-1 block text-ink-2">The Woodlands Secondary School</span>
              </p>
            </div>
            <div className="lg:col-span-5">
              <ClockChip />
            </div>
          </div>
        </div>
      </section>

      {/* the four figures: one size, read across, divided by hairlines */}
      <section className="wrap pb-[clamp(2.5rem,5vw,4rem)]" aria-label="hack::peel in numbers" data-reveal>
        <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
          {home.stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse gap-3 py-8 pl-5 pr-4 sm:pl-7 ${i % 2 === 1 ? "border-l border-line" : ""} ${
                i === 2 ? "md:border-l md:border-line" : ""
              } ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 0 ? "!pl-0" : ""} ${i === 2 ? "max-md:!pl-0" : ""}`}
            >
              <dt className="text-base font-medium text-ink-2">{s.label}</dt>
              <dd className="text-[clamp(2.5rem,4.8vw,3.75rem)] font-bold leading-none tracking-[-0.04em]">
                <StatNumber value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* organiser: a section of its own, with the team's mark at the size the live site gives it */}
      <section className="wrap">
        <div className="split" data-static>
          <h2 className="t-h2">{home.organisedBy}</h2>
          <a href={TEAM_URL} target="_blank" rel="noopener noreferrer" className="organiser fp">
            <img
              src="/sponsors/4308.png"
              alt=""
              className="logo-white h-28 w-auto flex-none sm:h-36"
              width={105}
              height={92}
            />
            <span className="grid justify-items-start gap-4">
              <span className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-[1.15] tracking-[-0.025em]">{home.team}</span>
              <span className="text-link text-lg">{home.visit}</span>
            </span>
          </a>
        </div>
      </section>

      {/* sponsors: every logo on a reel of carrier tape */}
      <section className="wrap">
        <div className="split lg:items-center">
          <div>
            <h2 className="t-h2">{sponsors.ourTitle}</h2>
            <p className="t-body mt-4">{sponsors.ourSub}</p>
            <Link to="/sponsors" className="text-link mt-6">
              Sponsor Us
            </Link>
          </div>
          <div className="min-w-0">
            <SponsorReel />
          </div>
        </div>
      </section>

      {/* why: four reasons, each a part on its footprint */}
      <section className="wrap">
        <div className="split">
          <div className="self-start">
            <h2 className="t-h2">
              <Branded text={home.whyTitle} />
            </h2>
            <p className="t-body mt-4">{home.whySub}</p>
          </div>
          <ul className="grid gap-x-12 sm:grid-cols-2">
            {home.features.map((f, i) => {
              const Icon = reasonIcons[i];
              return (
                <li
                  key={f.title}
                  className={`grid content-start gap-4 py-8 ${i > 0 ? "border-t border-line" : "pt-0"} ${
                    i === 1 ? "sm:border-t-0 sm:pt-0" : ""
                  }`}
                >
                  <h3 className="t-h3 flex items-center gap-4">
                    <span className="fp part-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    {f.title}
                  </h3>
                  <p className="t-body">{f.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* closing call to action: a copper pour */}
      <section className="pour bg-signal text-on-signal">
        <div className="pour-hatch" aria-hidden="true" />
        <div
          className="wrap grid gap-10 py-[clamp(4rem,9vw,7rem)] lg:grid-cols-12 lg:items-end lg:gap-16"
          data-reveal
        >
          <h2 className="t-h2 !text-[clamp(2.5rem,5.6vw,4rem)] lg:col-span-7">{home.ctaTitle}</h2>
          <div className="lg:col-span-5">
            <p className="max-w-[34rem] text-lg text-on-signal/85">{home.ctaBody}</p>
            <SwitchLink to="/register" variant="dark" className="mt-8">
              {home.ctaButton}
            </SwitchLink>
          </div>
        </div>
      </section>
    </>
  );
}
