import { PageHead } from "../components/PageHead";
import { useTitle } from "../components/useTitle";
import { conduct, privacy } from "../data/site";

export function Privacy() {
  useTitle("Privacy Policy");

  return (
    <>
      <PageHead title="privacy policy" lede={privacy.updated} />

      <div className="wrap">
        {privacy.sections.map((s) => (
          <section key={s.title} className="split">
            <h2 className="t-h2">{s.title}</h2>
            <div className="grid content-start gap-5">
              <p className="t-body">{s.intro}</p>
              {"list" in s && s.list && (
                <ul>
                  {s.list.map((item, i) => (
                    <li key={item} className={`py-3.5 text-ink-2 ${i === 0 ? "border-t border-line" : "border-t border-line"} ${i === s.list.length - 1 ? "border-b" : ""}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {"outro" in s && s.outro && <p className="t-body">{s.outro}</p>}
            </div>
          </section>
        ))}

        <section className="split pb-[clamp(4rem,8vw,7rem)]">
          <h2 className="t-h2">{privacy.contactTitle}</h2>
          <p className="t-body">
            {privacy.contact}{" "}
            <a href={`mailto:${conduct.supportEmail}`} className="link">
              {conduct.supportEmail}
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
