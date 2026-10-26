import type { ReactNode } from "react";
import { Code, Heart, Link2, Mail } from "lucide-react";
import { footerLinks, socials } from "../data/site";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "./Link";
import { Wordmark } from "./Wordmark";

function InstagramGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </svg>
  );
}

const socialIcons: Record<string, ReactNode> = {
  Linktree: <Link2 size={20} strokeWidth={1.75} aria-hidden="true" />,
  Instagram: <InstagramGlyph />,
  Devpost: <Code size={20} strokeWidth={1.75} aria-hidden="true" />,
  "Email hello@hackpeel.ca": <Mail size={20} strokeWidth={1.75} aria-hidden="true" />,
};

type FooterItem = { label: string; to?: string; href?: string };

function Column({ title, items }: { title: string; items: readonly FooterItem[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink-3">{title}</h3>
      <ul className="mt-4 grid gap-3">
        {items.map((i) => (
          <li key={i.label}>
            {i.to ? (
              <Link to={i.to} className="text-ink-2 no-underline transition-colors hover:text-signal">
                {i.label}
              </Link>
            ) : (
              <a href={i.href} target="_blank" rel="noopener noreferrer" className="text-ink-2 no-underline transition-colors hover:text-signal">
                {i.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The footer is the board's edge connector: the copyright line sits on the board, the fingers run along its edge. */
export function Footer() {
  return (
    <footer className="border-t border-line-strong bg-n0">
      <div className="wrap grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link to="/" className="logo-link text-[2.5rem] no-underline" aria-label="hack::peel, home">
            <Wordmark />
          </Link>
          <p className="mt-4 max-w-sm text-balance text-ink-2">
            <span className="whitespace-nowrap">
              Built with{" "}
              <Heart
                size={15}
                strokeWidth={0}
                fill="currentColor"
                role="img"
                aria-label="love"
                className="inline-block align-[-2px] text-signal"
              />
            </span>{" "}
            {/* names never split across lines; the line may break between them */}
            <span className="whitespace-nowrap">by Harjap Singh Johar,</span>{" "}
            <span className="whitespace-nowrap">Aaron Saini</span>{" "}
            <span className="whitespace-nowrap">and Junyang Pu.</span>
          </p>
          <ul className="mt-6 flex gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="fp grid size-11 place-items-center text-ink-2 transition-colors hover:text-signal"
                    >
                      {socialIcons[s.label]}
                    </a>
                  </TooltipTrigger>
                  {/* below the icon, so it never covers the credit line above the row */}
                  <TooltipContent side="bottom">{s.label}</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          <Column title="Quick Links" items={footerLinks.quick} />
          <Column title="Get Involved" items={footerLinks.involved} />
          <Column title="Legal" items={footerLinks.legal} />
        </nav>
      </div>
      <p className="wrap t-meta pb-5">© 2026 hack::peel — All rights reserved.</p>
      <div className="fingers" aria-hidden="true" />
    </footer>
  );
}
