import { navLinks } from "../data/site";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SwitchLink } from "@/components/board/switch";
import { NavLink } from "./Link";
import { MenuButton } from "./MenuButton";

/**
 * The mobile menu: a shadcn Sheet on Radix Dialog, which supplies the focus trap, Escape to close,
 * scroll lock and screen-reader labelling. It is loaded only on small screens (see Nav).
 */
export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <MenuButton />
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle className="sr-only">Main menu</SheetTitle>
        <nav aria-label="Main" className="mt-20 px-6">
          <ul>
            {navLinks.map((l) => (
              <li key={l.to} className="border-b border-line">
                <SheetClose asChild>
                  <NavLink
                    to={l.to}
                    className="block py-5 text-2xl font-semibold tracking-tight text-ink-2 no-underline transition-colors hover:text-ink aria-[current=page]:text-signal"
                  >
                    {l.label}
                  </NavLink>
                </SheetClose>
              </li>
            ))}
            <li className="pt-8">
              <SheetClose asChild>
                <SwitchLink to="/register" className="w-full">
                  Register
                </SwitchLink>
              </SheetClose>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
