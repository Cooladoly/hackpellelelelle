import { Fragment } from "react";

/** A heading's text with every "hack::peel" in it set as the logo, as the live site does in its headings. */
export function Branded({ text }: { text: string }) {
  return text.split("hack::peel").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <Wordmark />}
      {part}
    </Fragment>
  ));
}

/**
 * The hack::peel logo, drawn the way the live site draws it: Space Grotesk bold, "hack" and "peel"
 * in white, the "::" in copper cyan. `glow` is the hero version, whose colons glow (they blink on
 * once and then breathe while motion is on); `bar` adds the copper bar centred under the name, as in
 * public/full-logo.png.
 */
export function Wordmark({
  className = "",
  glow = false,
  bar = false,
}: {
  className?: string;
  glow?: boolean;
  bar?: boolean;
}) {
  const name = (
    <span className={`wordmark ${glow ? "wordmark-glow" : ""} ${bar ? "" : className}`}>
      hack<span className="colon">::</span>peel
    </span>
  );
  if (!bar) return name;
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      {name}
      <span className="logo-bar" aria-hidden="true" />
    </span>
  );
}
