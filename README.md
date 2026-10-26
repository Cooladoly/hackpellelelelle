# hack::peel website

A rebuild of https://www.hackpeel.ca/ with the same pages, the same copy, the same logos and the same brand (near-black and cyan, and the original hack::peel logo), redesigned as a circuit board with the power on: a dark soldermask ground with copper routed under it, one copper trace down the page, controls that behave like parts, and a countdown drawn as a chip with LEDs on it.

Vite, React, TypeScript, Tailwind CSS v4, React Router. The interactive pieces are installed open-source components (Watermelon UI, shadcn/ui on Radix, 21st.dev, NumberFlow, Motion), listed under "Installed UI components" below. The fonts are the live site's own, Space Grotesk (the logo's face, used for every word) and JetBrains Mono (times, years, prices), self-hosted through `@fontsource-variable`, so there are no external font requests; the build preloads Space Grotesk so the logo draws in it straight away.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks, then writes dist/
npm run preview  # serves dist/
```

## The board

The board idea is used where it does a job and nowhere else. An earlier pass also drew part labels (J1, SW1, TP1...), pads under the nav links, side tabs on every button, bright wires across the home page and empty chip bodies; those read as glitches and were removed. Please don't bring them back. The copper that is on the page now is different in kind: faint routing under the soldermask, never labelled, never across the text.

| On the page | On the board |
| --- | --- |
| The logo | The live site's own: "hack::peel" in Space Grotesk bold with the colons in cyan; in the home hero the colons glow and a cyan bar sits under the name, as in `public/full-logo.png` |
| Background | Copper under the soldermask, across the whole board: buses of faint traces that turn at 45 degrees and drop into vias. On wide screens the countdown chip's pins are wired into it; every inner page's head has its own field coming in from the right edge; the empty space under each section heading (and beside the contact email and venue) has a patch of its own; and trunks run down both side margins, more of them the wider the screen. The routing is laid around the page as drawn and never sits under words. Now and then a short cyan pulse runs along a trace |
| Navigation | Plain links; the current page is underlined in copper on the header's lower edge |
| Buttons | Tactile switches: a square body on a darker plinth that travels down when pressed |
| Home countdown | A chip with a 5x7 LED dot matrix, the one big board piece on the site |
| The four stats | One strip of equal figures divided by hairlines |
| "Organised By:" | A section heading at full size, with the team's mark at the size the live site gives it, in a panel you can click |
| Sponsors (home) | A reel of carrier tape, the tape that feeds parts to a placement machine, with a logo in each pocket; it moves slowly, stops under the pointer, and has a Pause button |
| "Why hack::peel?", About values, conduct principles | Each leads with the live site's own icon on a small footprint |
| Organiser, sponsor tiles, footer icons | Footprints with corner marks |
| FAQ rows | DIP switches: the knob slides to ON and its LED lights when the answer opens |
| Schedule days | A raised cap that slides to the day you pick |
| About history | A routed trace with a via per year, and a dashed airwire across the years nobody ran |
| Sponsorship tiers | A bill of materials with LED dots (a table on wide screens, one list per tier on phones) |
| Registration steps | An LED bar graph, with a tag above it naming the step |
| Workshops and Projects ("coming soon") | An empty footprint: the part for that page has not been fitted yet |
| Page not found | An open circuit: the trace stops at a via and the rest of the route was never laid |
| Closing call to action | A hatched copper pour |
| Footer | An edge connector |

Colour is one eleven-step neutral ramp (`--color-n0` to `--color-n10`) plus signal cyan `#00bfff` and a pale bare-metal pad colour, all defined once in `src/index.css`; the buried copper is two steps of that ramp (`--color-trace`, `--color-trace-via`). Space Grotesk carries every word; JetBrains Mono is used only for times, years, prices and step numbers.

## Where things live

| What | Where |
| --- | --- |
| All page copy (verbatim from the live site) | `src/data/site.ts` |
| Event date used by the countdown | `EVENT_START` in `src/data/site.ts` |
| Motion on/off switch | `ATMOSPHERE_ON` in `src/data/site.ts` |
| Sponsor logo sizes | `w` and `trim` on each sponsor in `src/data/site.ts` |
| Design tokens and the board's CSS (colour, type, radii, shadows, switches, motion) | `src/index.css` |
| Pages | `src/pages/` |
| Shared pieces (nav, footer, the logo, stat numbers, the sponsor reel) | `src/components/` (the logo is `Wordmark.tsx`) |
| The board: switch, LED row, clock chip, chip pins | `src/components/board/` |
| The copper under the mask (routing, pulses, page-head fields) and the chip's wiring | `src/components/board/Copper.tsx`, `src/components/board/ChipFanout.tsx` |
| The routing in the rest of the page (finds the empty board on each page and lays copper there) | `src/components/board/BoardLayer.tsx`, placed in `src/components/Layout.tsx` |
| Installed components: accordion, sheet, tooltip, timeline, copy button | `src/components/ui/` |
| Installed components: continuous tabs, step indicator, marquee, scroll fade (Watermelon UI) | `src/components/watermelon/` |
| shadcn registry settings, so `npx shadcn@latest add ...` knows where things go | `components.json` |
| Logos, venue map, standalone sponsorship prospectus, link-preview image | `public/` |
| Source of the link-preview image (`og-image.png`) | `tools/og.html` and `src/og.ts` |
| The design system, written down | `DESIGN.md` and `.impeccable/design.json` |
| Design brief, direction sketches, review screenshots (not part of the build, safe to delete) | `.impeccable/` |

Routes: `/`, `/about`, `/schedule`, `/workshops`, `/projects`, `/sponsors`, `/faq`, `/register`, `/contact`, `/code-of-conduct`, `/privacy`. `/workshops` and `/projects` say "coming soon", as on the live site.

## Motion

Everything that moves lives in one layer you can switch off:

- **Power-up (home page).** The trace down the left edge draws itself, the logo wipes in and its `::` blinks on like an LED and then glows gently in and out (as it does on the live site), the chip's wiring fades in, and the LED clock scans once and then shows the time. That is the only entrance sequence.
- **The clock.** When a value changes, the dots that differ switch off and on one at a time; digits are never swapped wholesale.
- **The live board.** Now and then a short cyan pulse runs along one of the faint copper traces (two run into the clock chip, a few cross each page head, one runs each margin trunk and each patch under a heading may carry one), only while they are on screen. The sponsor tape on the home page feeds slowly; it stops while the pointer or keyboard focus is on it, and its Pause button stops it for good.
- **While scrolling.** The rules between sections draw themselves and content fades in, the stat numbers count up once, and the About trace is laid one year at a time.
- **Small things.** Switches press down, the current page's underline grows in, the logo turns cyan under the pointer, DIP knobs slide, the day cap slides between days, the registration step tag slides to the step you point at, and page changes cross-fade.

It is built to be safe: every animation only runs when the visitor has not asked for reduced motion, nothing is hidden by a style that waits for a script to reveal it, and the decorative canvas and SVG are `aria-hidden` (the countdown's values are also in a visually hidden list). With reduced motion the sponsor tape becomes a still strip you can scroll.

To turn it all off, set `ATMOSPHERE_ON = false` in `src/data/site.ts`. The board is then drawn once and holds still: no LED scan, no glow, no pulses, no moving tape, no count-up, no sliding cap, no reveals.

## Installed UI components

The interactive parts use ready-made, accessible components instead of hand-rolled ones. Each file starts with a comment naming where it came from and what was changed, and each is restyled onto the board's own tokens rather than used as shipped. All are MIT licensed.

| Component | Source | Where it is used |
| --- | --- | --- |
| Accordion | Watermelon UI `accordion` (shadcn/ui on Radix Accordion) | FAQ, drawn as DIP switches. One answer open per group, as on the live site. |
| Continuous Tabs | Watermelon UI `continuous-tabs-base`, using Motion | Schedule days. A raised cap slides between the two days; arrow keys, Home and End work. |
| Step Indicator | Watermelon UI `step-indicator-base` | Registration steps, as an LED bar graph. Its tag sits on the current step and slides to preview the step you point at or focus; the segments are buttons in an ordered list. The tag's morph is a CSS transition, so this page loads no Motion. |
| Marquee | Watermelon UI `marquee` | The home page's sponsor reel. The repeated copies are hidden from screen readers and taken out of the tab order (`inert`), so each sponsor is heard and tabbed to once; it pauses on hover and on keyboard focus, and a Pause/Play button sits under it. |
| Scroll Fade | Watermelon UI `scroll-fade` | The same reel when motion is off: a still strip you scroll (also with the keyboard), its edges fading only where there is more to see. |
| Sheet | shadcn/ui `sheet` (Radix Dialog) | Mobile menu: focus trap, Escape to close, scroll lock. |
| Tooltip | shadcn/ui `tooltip` (Radix Tooltip) | Footer social icons and the copy button. |
| NumberFlow | `@number-flow/react` | The four stat numbers. |
| Timeline | 21st.dev `@cubby-ui/timeline` | About history: vias on a routed trace. |
| Copy Button | 21st.dev `@ncdai/copy-button` | Contact: copies the email address. |

The previous design's Shimmer Button (Watermelon UI) is gone; the buttons are the board's own switches.

Things to know:

- **Find-in-page and the FAQ.** Radix removes a closed answer from the page, so Ctrl+F will not match answers until they are opened. The live site's `<details>` elements did match, and opened themselves. Getting that back means rendering each answer with `forceMount` and `hidden="until-found"` and opening the item from a `beforematch` handler; Radix does not do this for you, so it is not wired up here.
- **Weight.** The home page loads about 145 KB of gzipped JavaScript, in two files (the page and a chunk the other pages share, with React Router in it). Motion (for the jumper cap) is only downloaded on `/schedule` (about 45 KB), the accordion only on `/faq` (about 6 KB) and the sheet only on screens under 900px (about 7 KB). The copper routing is drawn by a few lines of code, not images.
- **Adding more.** Watermelon publishes a shadcn registry: `npx shadcn@latest add https://registry.watermelon.sh/r/<name>.json`. Prefer the `-base` variants, which use theme tokens. The shadcn CLI will overwrite `src/lib/utils.ts` with a re-export and may add packages you don't want (`cn`, `radix-ui`, `tw-animate-css`); restore `utils.ts` (it is `clsx` plus `tailwind-merge`) and import from the individual `@radix-ui/react-*` packages instead.
- **21st.dev.** Its catalog (`npx @21st-dev/cli search ...`) needs you to sign in once with `npx @21st-dev/cli login`. On Windows PowerShell with script execution blocked, run `npx.cmd` instead of `npx`. A free account can download the code of two components a day; Timeline and Copy Button are the two that were used.

## Before you deploy

1. **Wire up registration.** The live site saves each registration to Firebase Realtime Database (`registrations`, with `timestamp` and `status: "pending"`). That back end is not part of this project, so submission is one function: `submitRegistration` in `src/lib/registration.ts`.
   - Easiest: set `VITE_REGISTRATION_ENDPOINT` to a URL that accepts the form as JSON via POST.
   - Or: `npm i firebase` and use the `push(ref(db, "registrations"), ...)` call shown in that file's comment.
   - In `npm run dev` submission is simulated so you can test the form. In a production build with nothing configured it fails loudly (the visitor sees "Registration Failed") instead of pretending to succeed.
2. **Single-page-app fallback.** Every route must serve `index.html`. `public/_redirects` does this on Netlify. On other hosts add the equivalent rewrite (for example `vercel.json` rewrites, or `try_files $uri /index.html` on nginx).
3. **Analytics.** `index.html` carries the same Google Analytics tag (`G-0P47S0KHZH`) as the live site. Remove it if you don't want it.
4. **Sponsorship prospectus.** `public/Sponsorship Prospectus.html` is the live site's standalone prospectus page, copied unchanged (it loads its own fonts and icons from CDNs and is not part of the redesign).
5. **Link previews.** `index.html` points `og:image` at `https://www.hackpeel.ca/og-image.png` and uses `https://www.hackpeel.ca/` as the canonical address. Change those if the site lives somewhere else. To regenerate the image, run `npm run dev`, open `/tools/og.html` in a 1200 x 630 window with reduced motion turned on, and screenshot it.

## Things the live site says that don't agree with each other

These were carried over word for word so the redesign changes the look and nothing else. You may want to fix them in `src/data/site.ts`:

- Participant counts: "100+ students" (hero, sponsors, register), "200+" participants (stats), "300+ students" (closing section).
- Register says "24 hours of coding"; everywhere else says 34 hours.
- The Day 1 schedule lists a "Closing Ceremony" at 6:30 PM and "Day One Concludes" at 7:00 PM.
- The countdown counts down to 8:00 AM on December 12 (copied from the live site), but check-in on the schedule starts at 9:00 AM.

## What was added to the copy

- Under the home-page buttons, a two-line date and venue ("Saturday, December 12th, 2026 / The Woodlands Secondary School"), taken verbatim from the Schedule and Contact pages. It is in `src/pages/Home.tsx` if you would rather remove it.
- The registration steps' numbers ("1", "2") under the step bar.
- Two buttons ("Register Now", "View Schedule") under "coming soon" on Workshops and Projects, so those pages are not dead ends.
- The registration form's two steps are named in a stepper above the form ("Personal Information", "Additional Details").
- On phones the sponsorship tiers are one list per tier instead of the wide table, and screen readers hear "Included" or "Not included" for each dot in the table.
- Once the event starts, the clock counts down its 34 hours instead (to 6:00 PM on December 13, `EVENT_END` in `src/data/site.ts`), so the hero keeps its clock on the day most people visit. When those hours are up it disappears instead of sitting at 00:00:00:00. No text is added either way; only its screen-reader label changes, from "Time until hack::peel begins" to "Time left in hack::peel".
- The footer's blue-heart emoji is now a drawn heart in the brand cyan (`aria-label="love"`).
- The footer credit adds Junyang Pu: "Built with ♥ by Harjap Singh Johar, Aaron Saini and Junyang Pu." (in `src/components/Footer.tsx`; each name stays on one line).
- The home page has an "Our Sponsors" section (between "Organised By:" and "Why hack::peel?"). Its heading and sentence are the Sponsors page's own ("Our Sponsors", "Thank you to our wonderful sponsors for making hack::peel possible."), its link reads "Sponsor Us" like the footer's, and the reel's control reads "Pause" or "Play".
- The icons the live site shows beside each "Why hack::peel?" reason, each About value and each Code of Conduct principle are back (the same lucide icons: Code, Users, Sparkles, Award; Users, Heart, Lightbulb, Target; Heart, Users, Shield, TriangleAlert).
