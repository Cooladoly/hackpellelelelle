import type { ComponentProps } from "react";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";

/** Router links that cross-fade between pages using the View Transitions API where available. */
export function Link(props: ComponentProps<typeof RouterLink>) {
  return <RouterLink viewTransition {...props} />;
}

export function NavLink(props: ComponentProps<typeof RouterNavLink>) {
  return <RouterNavLink viewTransition {...props} />;
}
