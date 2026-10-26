import { Suspense, lazy, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { navLinks } from "../data/site";
import { SwitchLink } from "@/components/board/switch";
import { Link, NavLink } from "./Link";
import { Wordmark } from "./Wordmark";
import { MenuButton } from "./MenuButton";

// The mobile menu (a shadcn Sheet) is only downloaded on small screens.
const MobileMenu = lazy(() => import("./MobileMenu").then((m) => ({ default: m.MobileMenu })));

function useIsSmall() {
  const query = "(max-width: 899px)";
  const [small, setSmall] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setSmall(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return small;
}

/** The header: the current page's link is underlined in copper on the header's lower edge. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const small = useIsSmall();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="hdr">
      <div className="wrap flex h-16 items-center justify-between">
        {/* as on the live site, the whole logo turns copper under the pointer */}
        <Link to="/" className="logo-link text-2xl no-underline" aria-label="hack::peel, home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 min-[900px]:flex">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav-link">
              {l.label}
            </NavLink>
          ))}
          <SwitchLink to="/register" className="btn-sm ml-3">
            Register
          </SwitchLink>
        </nav>

        {small && (
          <Suspense fallback={<MenuButton disabled />}>
            <MobileMenu open={open} onOpenChange={setOpen} />
          </Suspense>
        )}
      </div>
    </header>
  );
}
