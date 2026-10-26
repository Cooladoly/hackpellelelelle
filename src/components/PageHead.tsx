import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CopperField } from "@/components/board/Copper";

/** A stable number from the page's path, so every page gets its own routing and keeps it. */
function seedOf(path: string) {
  let h = 2166136261;
  for (let i = 0; i < path.length; i++) h = Math.imul(h ^ path.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** The top of an inner page: its title and lede, over a field of copper routed in from the board's right edge. */
export function PageHead({
  title,
  lede,
  note,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
}) {
  const { pathname } = useLocation();
  return (
    <header className="page-band">
      {/* on phones the title spans the screen, so the field sits further back */}
      <CopperField seed={seedOf(pathname)} className="opacity-45 sm:opacity-100" />
      <div className="wrap page-head relative">
        <h1 className="t-h1">{title}</h1>
        {lede && <p className="t-lede mt-6">{lede}</p>}
        {note && <p className="t-meta mt-4">{note}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </header>
  );
}
