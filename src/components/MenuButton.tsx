import { Menu } from "lucide-react";

/** The menu button. It lives apart from the Sheet so it can show while the Sheet's code is still loading. */
export function MenuButton(props: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      className="fp grid size-11 place-items-center transition-colors hover:text-signal min-[900px]:hidden"
      {...props}
    >
      <Menu size={24} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
