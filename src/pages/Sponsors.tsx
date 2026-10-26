import type { CSSProperties } from "react";
import { ExternalLink } from "lucide-react";
import { SwitchLink } from "@/components/board/switch";
import { PageHead } from "../components/PageHead";
import { Wordmark } from "../components/Wordmark";
import { useTitle } from "../components/useTitle";
import { PROSPECTUS_URL, sponsors } from "../data/site";

type TierLayout = { cols: string; cellH: string };

const layouts: Record<string, TierLayout> = {
  Platinum: { cols: "grid-cols-2 md:grid-cols-4", cellH: "10rem" },
  Gold: { cols: "grid-cols-1 sm:grid-cols-3", cellH: "8.5rem" },
  Silver: { cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5", cellH: "7.5rem" },
  Bronze: { cols: "grid-cols-1 sm:max-w-[16rem]", cellH: "7.5rem" },
};

export function Sponsors() {
  useTitle("Sponsors");
  const benefits = sponsors.pricing[0].benefits; // Platinum includes every benefit

  return (
    <>
      <PageHead
        title={
          <>
            sponsor <Wordmark />
          </>
        }
        lede={sponsors.lede}
      >
        <SwitchLink to="/contact">{sponsors.become}</SwitchLink>
        <a href={PROSPECTUS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          <ExternalLink size={18} strokeWidth={2} aria-hidden="true" />
          {sponsors.prospectus}
        </a>
      </PageHead>

      <div className="wrap">
        <section className="split">
          <div className="self-start">
            <h2 className="t-h2">{sponsors.ourTitle}</h2>
            <p className="t-body mt-4">{sponsors.ourSub}</p>
          </div>
          <div className="grid gap-12">
            {sponsors.tiers.map((tier) => {
              const l = layouts[tier.name];
              return (
                <div key={tier.name}>
                  <h3 className="t-h3 mb-4">{tier.name}</h3>
                  <ul className={`wall ${l.cols}`} style={{ "--cell-h": l.cellH } as CSSProperties}>
                    {tier.items.map((s) => (
                      <li key={s.name} className="contents">
                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="wall-cell">
                          <img
                            src={s.logo}
                            alt=""
                            loading="lazy"
                            className={s.white ? "logo-white" : ""}
                            style={{ width: s.w, marginBlock: -s.trim }}
                          />
                          <span className="t-meta text-balance">{s.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rule-top py-[clamp(2.5rem,5vw,4.5rem)]">
          <h2 className="t-h2">{sponsors.tiersTitle}</h2>
          <p className="t-body mt-4">{sponsors.tiersSub}</p>

          {/* wide screens: one comparison table */}
          <table className="matrix mt-10 hidden md:table">
            <caption className="sr-only">What each sponsorship tier includes</caption>
            <colgroup>
              <col style={{ width: "34%" }} />
              {sponsors.pricing.map((t) => (
                <col key={t.name} style={{ width: "16.5%" }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Benefit</span>
                </th>
                {sponsors.pricing.map((t) => (
                  <th key={t.name} scope="col">
                    <span className="t-h3 block">{t.name}</span>
                    <span className="num mt-1 block text-2xl font-medium">{t.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benefits.map((b) => (
                <tr key={b}>
                  <th scope="row">{b}</th>
                  {sponsors.pricing.map((t) => (
                    <td key={t.name}>
                      {t.benefits.includes(b) ? (
                        <>
                          <span className="led-dot on" aria-hidden="true" />
                          <span className="sr-only">Included</span>
                        </>
                      ) : (
                        <>
                          <span className="led-dot" aria-hidden="true" />
                          <span className="sr-only">Not included</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* narrow screens: one list per tier */}
          <div className="mt-8 md:hidden">
            {sponsors.pricing.map((t) => (
              <div key={t.name} className="border-t border-line py-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="t-h3">{t.name}</h3>
                  <p className="num text-2xl font-medium">{t.price}</p>
                </div>
                <ul className="mt-5 grid gap-3">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-ink-2">
                      <span className="led-dot on mt-[0.4rem] flex-none" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="split pb-[clamp(4rem,8vw,7rem)]">
          <h2 className="t-h2">{sponsors.whyTitle}</h2>
          <div>
            <p className="t-body text-lg">{sponsors.why}</p>
            <SwitchLink to="/contact" className="mt-8">
              {sponsors.touch}
            </SwitchLink>
          </div>
        </section>
      </div>
    </>
  );
}
