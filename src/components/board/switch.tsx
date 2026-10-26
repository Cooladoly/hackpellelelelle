/**
 * The site's buttons, drawn as tactile switches: a square body standing on a darker plinth
 * that travels down when pressed (see .btn in index.css). `primary` is the cyan switch, `dark`
 * sits on the copper pour, `secondary` is the outlined one.
 */
import type { ComponentProps } from "react";
import { Link } from "@/components/Link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "dark";

const tone: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  dark: "btn-dark",
};

export function SwitchButton({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn("btn", tone[variant], className)} {...props} />;
}

export function SwitchLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn("btn", tone[variant], className)} {...props} />;
}
