/**
 * Timeline, from 21st.dev: @cubby-ui/timeline (MIT, https://21st.dev/@cubby-ui/components/timeline).
 * The original is a composable list of dated events joined by a line, where an "active step" decides
 * whether each marker reads as completed, current or pending. Adapted for hack::peel:
 * Base UI and class-variance-authority are gone (plain elements and class names instead),
 * it renders a real ordered list with <time> dates, only the vertical layout is kept,
 * the markers are vias and the rail is copper trace (a dashed airwire where nothing was routed),
 * the date sits in its own column from 640px up, and the trace is laid segment by segment when its
 * section scrolls into view (see index.css).
 */
import * as React from "react";
import { cn } from "@/lib/utils";

type State = "pending" | "current" | "completed";

const TimelineContext = React.createContext<{ activeStep: number } | undefined>(undefined);
const TimelineItemContext = React.createContext<{ step: number } | undefined>(undefined);

function useTimeline() {
  const context = React.useContext(TimelineContext);
  if (!context) throw new Error("Timeline parts must be used inside <Timeline>");
  return context;
}

function stateOf(step: number | undefined, activeStep: number): State {
  if (step === undefined) return "pending";
  return step < activeStep ? "completed" : step === activeStep ? "current" : "pending";
}

/** `value` is the active step: earlier steps read as completed, this one as current, later ones as pending. */
function Timeline({ value = 1, className, ...props }: React.ComponentProps<"ol"> & { value?: number }) {
  return (
    <TimelineContext.Provider value={{ activeStep: value }}>
      <ol data-slot="timeline" className={cn("flex flex-col", className)} {...props} />
    </TimelineContext.Provider>
  );
}

function TimelineItem({ step, className, ...props }: React.ComponentProps<"li"> & { step: number }) {
  const { activeStep } = useTimeline();
  return (
    <TimelineItemContext.Provider value={{ step }}>
      <li
        data-slot="timeline-item"
        data-state={stateOf(step, activeStep)}
        className={cn(
          "group/timeline-item relative pl-9 not-last:pb-12 sm:grid sm:grid-cols-[6rem_1fr] sm:items-baseline sm:gap-x-4",
          className,
        )}
        {...props}
      />
    </TimelineItemContext.Provider>
  );
}

function TimelineIndicator({ className, ...props }: React.ComponentProps<"span">) {
  const { activeStep } = useTimeline();
  const item = React.useContext(TimelineItemContext);
  const state = stateOf(item?.step, activeStep);
  return (
    <span
      aria-hidden="true"
      data-slot="timeline-indicator"
      data-state={state}
      className={cn(
        // a via: a ring of copper that joins one stretch of trace to the next
        "absolute top-[0.3rem] left-0 size-[10px] rounded-full border-2",
        "data-[state=pending]:border-n6 data-[state=pending]:bg-background",
        "data-[state=completed]:border-signal data-[state=completed]:bg-background",
        "data-[state=current]:border-signal data-[state=current]:bg-signal data-[state=current]:outline-2 data-[state=current]:outline-offset-2 data-[state=current]:outline-signal/30",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The rail from this item's marker down to the next one. Hidden on the last item.
 * `dashed` (an addition to the original) draws it as a broken line, for a stretch where nothing happened.
 */
function TimelineSeparator({ dashed, className, ...props }: React.ComponentProps<"span"> & { dashed?: boolean }) {
  const { activeStep } = useTimeline();
  const item = React.useContext(TimelineItemContext);
  const state: State = item && item.step < activeStep ? "completed" : "pending";
  return (
    <span
      aria-hidden="true"
      data-slot="timeline-separator"
      data-state={state}
      className={cn(
        "absolute top-[1.25rem] -bottom-[0.3rem] left-[4px] w-[2px] group-last/timeline-item:hidden",
        // a routed trace is copper; a stretch that was never routed is drawn as a dashed airwire
        dashed
          ? "bg-[repeating-linear-gradient(to_bottom,var(--color-n8)_0_4px,transparent_4px_9px)]"
          : "data-[state=completed]:bg-signal data-[state=pending]:bg-n4",
        className,
      )}
      {...props}
    />
  );
}

/** Groups the date and title. It adds no box of its own, so both sit in the item's grid. */
function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="timeline-header" className={cn("contents", className)} {...props} />;
}

function TimelineDate({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-date"
      className={cn(
        "num block text-xl font-medium text-ink-3 sm:col-start-1 sm:row-span-2",
        "group-data-[state=completed]/timeline-item:text-ink-2 group-data-[state=current]/timeline-item:text-signal",
        className,
      )}
      {...props}
    />
  );
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="timeline-title" className={cn("t-h3 mt-1 sm:col-start-2 sm:mt-0", className)} {...props} />;
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="timeline-content" className={cn("t-body mt-2 sm:col-start-2", className)} {...props} />;
}

export { Timeline, TimelineItem, TimelineIndicator, TimelineSeparator, TimelineHeader, TimelineDate, TimelineTitle, TimelineContent };
