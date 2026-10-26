import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SwitchLink } from "@/components/board/switch";
import { PageHead } from "../components/PageHead";
import { useTitle } from "../components/useTitle";
import { DISCORD_URL, faq } from "../data/site";

export function Faq() {
  useTitle("FAQ");

  return (
    <>
      <PageHead title="frequently asked questions" lede={faq.lede} />

      <div className="wrap">
        {faq.groups.map((g) => (
          <section key={g.name} className="split">
            <h2 className="t-h2 self-start">{g.name}</h2>
            {/* one answer open at a time per group, as on the live site */}
            <Accordion type="single" collapsible>
              {g.items.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="t-body">{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        <section className="split pb-[clamp(4rem,8vw,7rem)]">
          <h2 className="t-h2">{faq.stillTitle}</h2>
          <div>
            <p className="t-body text-lg">{faq.still}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SwitchLink to="/contact">{faq.contactUs}</SwitchLink>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                {faq.joinDiscord}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
