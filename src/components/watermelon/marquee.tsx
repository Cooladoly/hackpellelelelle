/**
 * Marquee: Watermelon UI `marquee` (https://registry.watermelon.sh/r/marquee.json, MIT).
 * Changes for this site: the copies after the first are hidden from assistive technology and
 * taken out of the tab order (`inert`), so a screen reader hears each item once; the row also
 * pauses while anything inside it has keyboard focus; `duration` and `gap` take any CSS length
 * instead of three speed presets; the 4px outer padding is gone. The keyframes live in index.css
 * (`--animate-marquee`).
 */
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /** run right to left (default) or left to right */
  reverse?: boolean;
  /** stop while the pointer is over the row or focus is inside it */
  pauseOnHover?: boolean;
  /** scroll vertically instead */
  vertical?: boolean;
  /** how many copies of the content make up the row */
  repeat?: number;
  /** time for one copy to pass, as a CSS time */
  duration?: string;
  /** space between items and between copies, as a CSS length */
  gap?: string;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = "40s",
  gap = "0px",
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      style={{ "--duration": duration, "--gap": gap, ...style } as CSSProperties}
      className={cn("group flex [gap:var(--gap)] overflow-hidden", vertical ? "flex-col" : "flex-row", className)}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          inert={i > 0 || undefined}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
