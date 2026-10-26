import { Suspense, useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ATMOSPHERE_ON } from "../data/site";
import { BoardLayer } from "./board/BoardLayer";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

/** Sends every page to the top instantly (the page CSS smooth-scrolls anchors, which would otherwise animate this). */
function useScrollToTop(pathname: string, hash: string) {
  useLayoutEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
}

/**
 * Scroll reveals. Ruled sections (.split) and anything marked data-reveal start
 * hidden once this has run, and are revealed as they enter the viewport.
 * Pages that load lazily (Schedule, FAQ) mount after the route changes, so the page is
 * watched for new sections as well as scanned once; a mutation callback runs before the
 * browser paints, so a section is marked before it can flash.
 * Without JavaScript, or with the atmosphere off, nothing is ever hidden.
 */
function useReveal(pathname: string) {
  useLayoutEffect(() => {
    const main = document.querySelector("main");
    if (!ATMOSPHERE_ON || typeof IntersectionObserver === "undefined" || !main) return;
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const watched = new WeakSet<Element>();
    const scan = () => {
      main.querySelectorAll<HTMLElement>(".split:not([data-static])").forEach((el) => el.setAttribute("data-reveal", ""));
      main.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(main, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);
}

export function Layout() {
  const { pathname, hash } = useLocation();
  useScrollToTop(pathname, hash);
  useReveal(pathname);

  useEffect(() => {
    document.documentElement.classList.toggle("calm", !ATMOSPHERE_ON);
  }, []);

  return (
    <div className="relative isolate">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius-field)] focus:bg-signal focus:px-4 focus:py-2 focus:font-semibold focus:text-on-signal"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="relative z-10">
        {/* copper under the mask, laid into the empty board under every section */}
        <BoardLayer />
        {/* the one trace that runs the page's full height */}
        <span className="spine" aria-hidden="true" />
        {/* while a lazily loaded page downloads, hold a full screen so the footer starts below the fold and never visibly jumps */}
        <Suspense fallback={<div className="min-h-svh" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
