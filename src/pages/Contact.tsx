import { CopyButton } from "@/components/ui/copy-button";
import { SwitchLink } from "@/components/board/switch";
import { PageHead } from "../components/PageHead";
import { useTitle } from "../components/useTitle";
import { contact } from "../data/site";

export function Contact() {
  useTitle("Contact");

  return (
    <>
      <PageHead title="get in touch" lede={contact.lede} />

      <div className="wrap">
        <section className="split">
          <h2 className="t-h2">{contact.emailTitle}</h2>
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="link text-[clamp(1.5rem,3.6vw,2.5rem)] font-semibold tracking-tight"
              >
                {contact.email}
              </a>
              <CopyButton text={contact.email} label="Copy email address" />
            </div>
            <p className="t-meta mt-3">{contact.emailNote}</p>
          </div>
        </section>

        <section className="split">
          <h2 className="t-h2">{contact.venueTitle}</h2>
          <div>
            <address className="text-xl not-italic leading-relaxed">
              {contact.venue.map((line, i) => (
                <span key={line} className={i === 0 ? "block font-semibold" : "block text-ink-2"}>
                  {line}
                </span>
              ))}
            </address>
            <p className="t-meta mt-3">{contact.venueNote}</p>
          </div>
        </section>

        <section className="split pb-[clamp(4rem,8vw,7rem)]">
          <h2 className="t-h2">{contact.volunteerTitle}</h2>
          <div>
            <p className="t-body text-lg">{contact.volunteer}</p>
            <SwitchLink to="/register" className="mt-8">
              {contact.apply}
            </SwitchLink>
          </div>
        </section>
      </div>
    </>
  );
}
