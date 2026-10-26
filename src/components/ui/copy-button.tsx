/**
 * Copy Button, from 21st.dev: @ncdai/copy-button (MIT, https://21st.dev/@ncdai/components/copy-button).
 * The original is an icon button that copies text and swaps its icon between idle, done and error,
 * with a sound and a haptic buzz. Adapted for hack::peel: the sound and the haptics (and the two packages
 * behind them) are gone, it is a plain button in the same hairline look as the footer icons instead of
 * shadcn's Button, the icon swap is a CSS crossfade instead of Motion, a tooltip says the result in words,
 * a live region announces it to screen readers, and there is a fallback for browsers without the Clipboard API.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CircleX, Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "done" | "error";

async function writeText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // blocked or unsupported: fall through to the older route below
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(field);
  if (!copied) throw new Error("Copy failed");
}

type Options = {
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: Error) => void;
  /** How long the done or error state stays before the button goes back to idle. */
  resetDelay?: number;
};

export function useCopyToClipboard({ onCopySuccess, onCopyError, resetDelay = 1800 }: Options = {}) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      clearTimeout(timer.current);
      try {
        await writeText(text);
        setState("done");
        onCopySuccess?.(text);
      } catch (error) {
        setState("error");
        onCopyError?.(error instanceof Error ? error : new Error("Copy failed"));
      } finally {
        timer.current = setTimeout(() => setState("idle"), resetDelay);
      }
    },
    [onCopySuccess, onCopyError, resetDelay],
  );

  return { state, copy } as const;
}

type Props = {
  text: string;
  /** What the button does, as the tooltip and screen readers say it. */
  label: string;
  doneLabel?: string;
  errorLabel?: string;
  className?: string;
} & Options;

const icon =
  "absolute size-5 motion-safe:transition-[opacity,scale] motion-safe:duration-200 data-[active=false]:scale-50 data-[active=false]:opacity-0";

export function CopyButton({ text, label, doneLabel = "Copied", errorLabel = "Copy failed", className, ...options }: Props) {
  const { state, copy } = useCopyToClipboard(options);
  const [pointing, setPointing] = useState(false);
  const message = state === "done" ? doneLabel : state === "error" ? errorLabel : "";

  return (
    <>
      {/* the tooltip also opens by itself for a moment after a copy, so touch screens see the result in words too */}
      <Tooltip open={pointing || state !== "idle"} onOpenChange={setPointing}>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-slot="copy-button"
            data-state={state}
            aria-label={label}
            onClick={() => void copy(text)}
            className={cn(
              "fp grid size-11 shrink-0 cursor-pointer place-items-center text-ink-2 transition-colors hover:text-signal",
              "data-[state=done]:border-signal data-[state=done]:text-signal data-[state=error]:border-danger data-[state=error]:text-danger",
              className,
            )}
          >
            <Copy aria-hidden="true" strokeWidth={1.75} data-active={state === "idle"} className={icon} />
            <Check aria-hidden="true" strokeWidth={1.75} data-active={state === "done"} className={icon} />
            <CircleX aria-hidden="true" strokeWidth={1.75} data-active={state === "error"} className={icon} />
          </button>
        </TooltipTrigger>
        <TooltipContent>{message || label}</TooltipContent>
      </Tooltip>
      <span role="status" className="sr-only">
        {message}
      </span>
    </>
  );
}
