/**
 * Scroll Fade: Watermelon UI `scroll-fade` (https://registry.watermelon.sh/r/scroll-fade.json, MIT).
 * A scroll area that fades its edges only on the sides where there is more to scroll to.
 * Changes for this site: the fades blend into the board (`--color-ground`) instead of a
 * `--background` variable this theme does not define, the scroll area takes a label and keyboard
 * focus so it can be scrolled without a pointer, and only the horizontal axis is kept.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ScrollFade({
  children,
  className,
  label,
  hideScrollbar = true,
}: {
  children: ReactNode;
  className?: string;
  /** names the scroll area for assistive technology */
  label: string;
  hideScrollbar?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(Math.ceil(el.scrollLeft + el.clientWidth) < Math.floor(el.scrollWidth - 1));
  }, []);

  useLayoutEffect(() => {
    requestAnimationFrame(checkScroll);
  }, [checkScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    if (contentRef.current) ro.observe(contentRef.current);
    ro.observe(container);
    return () => {
      container.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "w-full overflow-x-auto overflow-y-hidden",
          hideScrollbar && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        <div ref={contentRef} className="w-fit min-w-full">
          {children}
        </div>
      </div>
      {showLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12"
          style={{ background: "linear-gradient(to right, var(--color-ground), transparent)" }}
        />
      )}
      {showRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12"
          style={{ background: "linear-gradient(to left, var(--color-ground), transparent)" }}
        />
      )}
    </div>
  );
}
