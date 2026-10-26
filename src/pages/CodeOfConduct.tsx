import { Heart, Shield, TriangleAlert, Users, type LucideIcon } from "lucide-react";
import { PageHead } from "../components/PageHead";
import { useTitle } from "../components/useTitle";
import { conduct } from "../data/site";

/** The live site's icon for each principle, in the same order as conduct.principles. */
const principleIcons: LucideIcon[] = [Heart, Users, Shield, TriangleAlert];

function RuledList({ items }: { items: readonly string[] }) {
  return (
    <ul>
      {items.map((t, i) => (
        <li key={t} className={`py-4 text-ink-2 ${i === 0 ? "pt-0" : "border-t border-line"}`}>
          {t}
        </li>
      ))}
    </ul>
  );
}

export function CodeOfConduct() {
  useTitle("Code of Conduct");

  return (
    <>
      <PageHead title="code of conduct" lede={conduct.lede} />

      <div className="wrap">
        <section className="border-t border-line py-[clamp(2.5rem,5vw,4.5rem)]">
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {conduct.principles.map((p, i) => {
              const Icon = principleIcons[i];
              return (
                <li key={p.title} className="grid content-start gap-4">
                  <span className="fp part-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <h2 className="t-h3">{p.title}</h2>
                  <p className="t-body -mt-1">{p.body}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="split">
          <h2 className="t-h2">{conduct.expectedTitle}</h2>
          <RuledList items={conduct.expected} />
        </section>

        <section className="split">
          <h2 className="t-h2">{conduct.unacceptableTitle}</h2>
          <RuledList items={conduct.unacceptable} />
        </section>

        <section className="split">
          <h2 className="t-h2">{conduct.enforcementTitle}</h2>
          <div className="grid gap-5">
            {conduct.enforcement.map((p) => (
              <p key={p} className="t-body">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section className="split pb-[clamp(4rem,8vw,7rem)]">
          <h2 className="t-h2">{conduct.questionsTitle}</h2>
          <p className="t-body">
            {conduct.questions}{" "}
            <a href={`mailto:${conduct.supportEmail}`} className="link">
              {conduct.supportEmail}
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
