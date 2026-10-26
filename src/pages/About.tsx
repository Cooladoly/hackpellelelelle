import { Fragment, type CSSProperties } from "react";
import { Heart, Lightbulb, Target, Users, type LucideIcon } from "lucide-react";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { PageHead } from "../components/PageHead";
import { Wordmark } from "../components/Wordmark";
import { useTitle } from "../components/useTitle";
import { TEAM_URL, about } from "../data/site";

/** The live site's icon for each value, in the same order as about.values. */
const valueIcons: LucideIcon[] = [Users, Heart, Lightbulb, Target];

function withTeamLink(text: string) {
  const [before, after] = text.split("{team}");
  return (
    <>
      {before}
      <a href={TEAM_URL} target="_blank" rel="noopener noreferrer" className="link">
        FRC Team #4308: Absolute Robotics
      </a>
      {after}
    </>
  );
}

export function About() {
  useTitle("About");

  return (
    <>
      <PageHead
        title={
          <>
            about <Wordmark />
          </>
        }
        lede={about.lede}
      />

      <div className="wrap">
        <section className="split">
          <h2 className="t-h2">{about.missionTitle}</h2>
          {/* the mission is the page's one statement, so it is set at headline scale, not body scale */}
          <p className="max-w-[28em] text-[clamp(1.5rem,2.7vw,2.125rem)] font-medium leading-[1.3] tracking-[-0.015em] text-ink">
            {about.mission}
          </p>
        </section>

        <section className="split">
          <h2 className="t-h2">{about.valuesTitle}</h2>
          <ul className="grid gap-x-12 sm:grid-cols-2">
            {about.values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <li
                  key={v.title}
                  className={`grid content-start gap-4 py-8 ${i < 2 ? "sm:pt-0" : ""} ${i > 0 ? "border-t border-line" : ""} ${i === 1 ? "sm:border-t-0" : ""} ${i === 0 ? "pt-0" : ""}`}
                >
                  <h3 className="t-h3 flex items-center gap-4">
                    <span className="fp part-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    {v.title}
                  </h3>
                  <p className="t-body">{v.body}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="split">
          <div className="self-start">
            <h2 className="t-h2">{about.historyTitle}</h2>
            <p className="t-body mt-4">{about.historySub}</p>
          </div>
          {/* the last entry is the current one; a gap of more than a year between entries draws the rail dashed */}
          <Timeline value={about.history.length}>
            {about.history.map((h, i) => {
              const next = about.history[i + 1];
              const skipped = next ? Number(next.year) - Number(h.year) > 1 : false;
              return (
                <TimelineItem key={h.year} step={i + 1} style={{ "--i": i } as CSSProperties}>
                  <TimelineIndicator />
                  <TimelineSeparator dashed={skipped} />
                  <TimelineHeader>
                    <TimelineDate dateTime={h.year}>{h.year}</TimelineDate>
                    <TimelineTitle>{h.title}</TimelineTitle>
                  </TimelineHeader>
                  <TimelineContent>
                    {h.body.includes("{team}") ? <Fragment>{withTeamLink(h.body)}</Fragment> : h.body}
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </section>

        <section className="split pb-[clamp(4rem,8vw,7rem)]">
          <h2 className="t-h2">{about.accessTitle}</h2>
          <p className="t-body text-lg">{about.access}</p>
        </section>
      </div>
    </>
  );
}
