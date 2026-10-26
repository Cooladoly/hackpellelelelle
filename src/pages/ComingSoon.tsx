import { Link } from "../components/Link";
import { Pins } from "@/components/board/Pins";
import { SwitchLink } from "@/components/board/switch";
import { PageHead } from "../components/PageHead";
import { useTitle } from "../components/useTitle";

export function ComingSoon({ title }: { title: string }) {
  useTitle(title);

  return (
    <div className="min-h-[50vh]">
      <PageHead title="coming soon">
        <SwitchLink to="/register">Register Now</SwitchLink>
        <Link to="/schedule" className="btn btn-secondary">
          View Schedule
        </Link>
      </PageHead>
      {/* the part for this page has not been fitted yet: its footprint is on the board, empty */}
      <div className="wrap pb-[clamp(4rem,8vw,7rem)]">
        <div className="socket" aria-hidden="true">
          <span className="chip-pin1" />
          <Pins side="l" count={6} inset="1.25rem" />
          <Pins side="r" count={6} inset="1.25rem" />
        </div>
      </div>
    </div>
  );
}
