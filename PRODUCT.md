# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript + Tailwind CSS (user's choice; matches the live site's React + Tailwind stack so it can be ported into their repo). No source repo was available; this is a from-scratch rebuild of the live site at https://www.hackpeel.ca/.

## Users

Primary: Peel Region high school students (grades 9-12), many of them first-time hackers, deciding whether to register for a free weekend hackathon. They arrive from a school poster, a friend, Instagram, or a Devpost link, usually on a phone.
Secondary (inferred from the live site, unconfirmed): sponsors and companies evaluating a sponsorship tier; parents and teachers checking that it is legitimate and safe; mentors and volunteers.

## Product Purpose

hack::peel is a student-run, free, 34-hour high school hackathon in Peel Region. It gives students a safe, supportive place to build software and hardware, form teams, learn in workshops and win prizes. Success is registrations, sponsor enquiries, and a site that makes the event look credible to students, parents and sponsors.

## Positioning

Run by students for students, hosted by FRC Team #4308: Absolute Robotics at The Woodlands Secondary School, Mississauga. Originally founded in 2022 (200+ participants, $14,000+ in prizes), revived for 2026.

## Operating Context

Event: Saturday December 12 and Sunday December 13, 2026, The Woodlands Secondary School, 3225 Erindale Station Rd, Mississauga, ON L5C 1Y5. Countdown target on the live site: 2026-12-12T08:00:00 (local). Registration is a two-step form (Personal Information, Additional Details) that currently writes to Firebase Realtime Database under `registrations`. Contact: hello@hackpeel.ca; legal/safety: support@hackpeel.ca. Socials: Linktree, Instagram (@hackpeel), Devpost, Discord.

## Capabilities and Constraints

- Pages: Home, About, Schedule (two days, with a downloadable venue map PDF), Workshops (coming soon), Projects (coming soon), Sponsors (13 sponsors across four tiers, plus tier pricing), FAQ (15 questions in four groups), Register, Contact, Code of Conduct, Privacy.
- All copy, numbers and links are carried over verbatim from the live site. The live site contradicts itself in places (100+ / 200+ / 300+ participants; 24 vs 34 hours on Register; Day 1 schedule lists a closing ceremony). These are preserved as-is and reported to the user, not silently fixed.
- The registration back end (Firebase) is not available to this rebuild: the form is built in full, and submission is an integration seam to be wired to the existing Firebase project.
- "View Prospectus" on Sponsors is a button with no link on the live site; kept as a button.

## Brand Commitments

- Name stylised `hack::peel` (lowercase, double colon), set as a wordmark.
- Dark (near-black #0a0a0a) with a single cyan-blue accent, hsl(195 100% 50%) (about #00bfff), as on the live site. Typefaces on the live site are Space Grotesk and JetBrains Mono.
- Team #4308 logo (4308.png, rendered white on dark) and the 13 sponsor logos, all downloaded from the live site and kept as-is.
- User binding request: same layout structure, same exact text, same images, same brand colours and logos; the change is execution quality: more professional, more credible, not "vibe coded".

## Evidence on Hand

Logos in `public/sponsors/`, venue map PDF in `public/`. No photography, no video, no testimonials. Past-event stats are only those stated on the live site (2022: 200+ participants, over $14,000 in prizes). Do not fabricate photos, quotes, judges, speakers, or sponsor claims.

## Product Principles

- Credibility first: concrete facts (date, place, who runs it, who sponsors it, what it costs) are the design material.
- A first-time 14-year-old and a sponsor's recruiter should both understand the event within one screen.
- Never invent claims; keep the live site's wording.
- Mobile first: most visitors are students on phones.

## Accessibility & Inclusion

The About page commits to an accessible venue, quiet spaces and accommodations, so the site itself should meet WCAG 2.2 AA: contrast, visible focus, keyboard-operable accordion/tabs/forms, reduced-motion respect.
