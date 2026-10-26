import type { CSSProperties } from "react";

/**
 * A row of package pins down one side of a chip.
 */
export function Pins({
  side,
  count = 10,
  inset = "1.6rem",
}: {
  side: "l" | "r";
  count?: number;
  inset?: string;
}) {
  return (
    <span
      className={`pins ${side === "l" ? "pins-l" : "pins-r"}`}
      style={{ top: inset, bottom: inset } as CSSProperties}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="pin" />
      ))}
    </span>
  );
}
