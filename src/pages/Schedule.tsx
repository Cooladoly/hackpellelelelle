import { useState } from "react";
import { Download } from "lucide-react";
import { ContinuousTabs } from "@/components/watermelon/continuous-tabs";
import { PageHead } from "../components/PageHead";
import { Wordmark } from "../components/Wordmark";
import { useTitle } from "../components/useTitle";
import { MAP_URL, schedule } from "../data/site";

const tabId = (id: string) => `tab-${id}`;
const panelId = (id: string) => `panel-${id}`;

export function Schedule() {
  useTitle("Schedule");
  const [active, setActive] = useState(schedule.days[0].id);
  const day = schedule.days.find((d) => d.id === active) ?? schedule.days[0];

  return (
    <>
      <PageHead
        title={
          <>
            <Wordmark /> schedule
          </>
        }
        lede={schedule.lede}
      >
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" download className="btn btn-secondary">
          <Download size={18} strokeWidth={2} aria-hidden="true" />
          {schedule.download}
        </a>
      </PageHead>

      <div className="wrap pb-[clamp(4rem,8vw,7rem)]">
        <ContinuousTabs
          label="Event days"
          value={active}
          onValueChange={setActive}
          tabId={tabId}
          panelId={panelId}
          tabs={schedule.days.map((d) => ({ id: d.id, label: d.name, detail: d.date }))}
        />

        <div role="tabpanel" id={panelId(day.id)} aria-labelledby={tabId(day.id)} tabIndex={0} className="mt-10">
          <ol className="border-b border-line">
            {day.items.map((item, i) => (
              <li
                key={`${item.time}-${item.event}-${i}`}
                className="row-hover grid grid-cols-[6.25rem_1fr] gap-x-4 gap-y-1 border-t border-line py-5 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-x-8"
              >
                <p className="num text-ink-2">{item.time}</p>
                <p className="text-lg font-medium leading-snug">{item.event}</p>
                <p className="t-meta col-start-2 sm:col-start-3 sm:text-right sm:text-base">{item.place}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
