import { Link } from "../components/Link";
import { SwitchLink } from "@/components/board/switch";
import { PageHead } from "../components/PageHead";
import { useTitle } from "../components/useTitle";

export function NotFound() {
  useTitle("Page not found");

  return (
    <div className="min-h-[50vh]">
      <PageHead title="page not found" lede="That address doesn't match a page on this site. Head back home or check the schedule.">
        <SwitchLink to="/">Back to Home</SwitchLink>
        <Link to="/schedule" className="btn btn-secondary">
          View Schedule
        </Link>
      </PageHead>
      {/* an open circuit: the trace runs out at a via, and the rest of the route was never laid */}
      <div className="wrap pb-[clamp(4rem,8vw,7rem)]">
        {/* it leaves the spine, so it starts 1.1rem left of the content edge */}
        <svg
          className="-ml-[1.1rem] block h-12 w-[min(100%+1.1rem,23rem)]"
          viewBox="0 0 352 48"
          preserveAspectRatio="xMinYMid meet"
          fill="none"
          aria-hidden="true"
        >
          <path d="M0 24H118" className="stroke-signal" strokeWidth="2.5" />
          <circle cx="127" cy="24" r="8" className="fill-ground stroke-signal" strokeWidth="2.5" />
          <circle cx="203" cy="24" r="8" className="fill-ground stroke-n6" strokeWidth="2.5" />
          <path d="M212 24H352" className="stroke-n6" strokeWidth="1.5" strokeDasharray="4 6" />
        </svg>
      </div>
    </div>
  );
}
