/**
 * All copy on the site, carried over verbatim from https://www.hackpeel.ca/.
 * Edit text here, not in the components.
 */

export const EVENT_START = new Date("2026-12-12T08:00:00");

/** The 34 hours the event is named for. Once it has started the clock counts these down; when they are up it goes away. */
export const EVENT_END = new Date(EVENT_START.getTime() + 34 * 60 * 60 * 1000);

/**
 * One switch for everything on the board that moves: the LED clock's scan and dot changes, the traces
 * drawing and pulsing in the hero, the spine drawing down the page, the numbers counting up, the
 * jumper cap sliding between days, and every entrance and scroll reveal. Set to false for a board that
 * is drawn once and then holds still. Visitors who ask for reduced motion get that already.
 */
export const ATMOSPHERE_ON = true;

export const DISCORD_URL = "https://discord.com/invite/8k56jfr22u";
export const TEAM_URL = "https://www.team4308.ca";
export const PROSPECTUS_URL = "/Sponsorship Prospectus.html";
export const MAP_URL = "/The Woodlands School - Map.pdf";

export const socials = [
  { label: "Linktree", href: "https://linktr.ee/hackpeel" },
  { label: "Instagram", href: "https://www.instagram.com/hackpeel/" },
  { label: "Devpost", href: "https://hack-peel.devpost.com/" },
  { label: "Email hello@hackpeel.ca", href: "mailto:hello@hackpeel.ca" },
] as const;

export const navLinks = [
  { to: "/about", label: "About" },
  { to: "/schedule", label: "Schedule" },
  { to: "/workshops", label: "Workshops" },
  { to: "/projects", label: "Projects" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/faq", label: "FAQ" },
] as const;

export const footerLinks = {
  quick: [
    { to: "/about", label: "About" },
    { to: "/schedule", label: "Schedule" },
    { to: "/workshops", label: "Workshops" },
    { to: "/projects", label: "Projects" },
  ],
  involved: [
    { to: "/register", label: "Register" },
    { to: "/sponsors", label: "Sponsor Us" },
    { to: "/contact", label: "Contact" },
    { href: DISCORD_URL, label: "Join Discord" },
  ],
  legal: [
    { to: "/code-of-conduct", label: "Code of Conduct" },
    { to: "/privacy", label: "Privacy" },
    { to: "/faq", label: "FAQ" },
  ],
} as const;

/* ---------------- home ---------------- */

export const home = {
  tagline: "Build the Future in 34 Hours",
  sub: "Join Peel Region's best high school hackathon. Code, design, and innovate alongside 100+ students.",
  stats: [
    { value: "200+", label: "Participants" },
    { value: "34", label: "Hours" },
    { value: "50+", label: "Projects" },
    { value: "5+", label: "Workshops" },
  ],
  organisedBy: "Organised By:",
  team: "Team #4308: Absolute Robotics",
  visit: "Visit Our Website →",
  whyTitle: "Why hack::peel?",
  whySub:
    "Experience the ultimate high school hackathon with top-tier mentorship, workshops, and prizes.",
  features: [
    {
      title: "Beginner Friendly",
      body: "Never coded before? No problem! We have workshops for all skill levels.",
    },
    {
      title: "Team Building",
      body: "Find teammates, collaborate, and build something amazing together.",
    },
    {
      title: "Free Swag & Food",
      body: "T-shirts, stickers, meals, and snacks provided throughout the event.",
    },
    {
      title: "Win Prizes",
      body: "Compete for prizes across multiple categories and showcase your work.",
    },
  ],
  ctaTitle: "Ready to Build Something Extraordinary?",
  ctaBody:
    "Join 300+ students from across Peel Region for 34 hours of innovation, learning, and unforgettable experiences.",
  ctaButton: "Get Started Today",
};

/* ---------------- about ---------------- */

export const about = {
  lede: "hack::peel gives Peel Region high schoolers a safe, supportive space to experiment with software and hardware, build teams, and ship projects — whether it's your first prototype or your fiftieth hack.",
  missionTitle: "Our Mission",
  mission:
    "We believe every high school student deserves the opportunity to explore technology, create innovative solutions, and connect with like-minded peers. hack::peel is more than just a hackathon — it's a movement to inspire the next generation of creators, builders, and leaders in Peel Region.",
  valuesTitle: "Our Values",
  values: [
    {
      title: "Inclusivity",
      body: "We welcome students of all skill levels, backgrounds, and experiences.",
    },
    {
      title: "Community",
      body: "Building lasting connections and friendships through shared passion for tech.",
    },
    {
      title: "Innovation",
      body: "Encouraging creative problem-solving and out-of-the-box thinking.",
    },
    {
      title: "Learning",
      body: "Creating opportunities for students to learn new skills and grow.",
    },
  ],
  historyTitle: "A Nod to Our History",
  historySub:
    "From humble beginnings to becoming Peel Region's premier high school hackathon",
  history: [
    {
      year: "2022",
      title: "Founded",
      body: "Launched by students at The Woodlands Secondary School. Successfully hosted the inaugural event with 200+ participants and over $14,000 in prizes, setting the foundation for the hack::peel community.",
    },
    {
      year: "2023",
      title: "Hiatus",
      body: "Organizers attempted to relaunch the event during these years, but logistical constraints prevented hack::peel from officially running. The community and interest, however, continued to grow behind the scenes.",
    },
    {
      year: "2026",
      title: "Revival",
      body: "hack::peel is returning stronger than ever, marking a full revival. Now, run by {team}, hack::peel has the potential to reach new heights. Featuring our largest attendance, expanded tracks, polished organization, and new partnerships, 2026 will be the most ambitious and successful edition yet.",
    },
  ],
  accessTitle: "Accessibility & Inclusivity",
  access:
    "hack::peel is committed to creating an inclusive environment for all participants. We provide accommodations for students with disabilities, dietary restrictions, and other needs. Our venue is wheelchair accessible, and we offer quiet spaces for those who need them. If you have any accessibility concerns or requirements, please don't hesitate to reach out to our team.",
};

/* ---------------- schedule ---------------- */

export type ScheduleItem = { time: string; event: string; place: string };

export const schedule = {
  lede: "34 hours of workshops, hacking, food, and fun!",
  download: "Download Map",
  days: [
    {
      id: "day-1",
      name: "Day 1",
      date: "Saturday, December 12th, 2026",
      items: [
        { time: "9:00 AM", event: "Registration & Check-in", place: "Front Foyer" },
        { time: "9:30 AM", event: "Opening Ceremony", place: "Cafeteria" },
        { time: "10:00 AM", event: "Hacking Begins", place: "All Areas" },
        { time: "1:00 PM", event: "Lunch", place: "Cafeteria" },
        { time: "5:45 PM", event: "Dinner", place: "Cafeteria" },
        { time: "6:30 PM", event: "Closing Ceremony", place: "Cafeteria" },
        { time: "7:00 PM", event: "Day One Concludes", place: "All Areas" },
      ] as ScheduleItem[],
    },
    {
      id: "day-2",
      name: "Day 2",
      date: "Sunday, December 13th, 2026",
      items: [
        { time: "9:00 AM", event: "Check-in", place: "Front Foyer" },
        { time: "9:30 AM", event: "Opening Ceremony", place: "Cafeteria" },
        { time: "12:00 PM", event: "Lunch", place: "Cafeteria" },
        { time: "2:00 PM", event: "Submission Deadline", place: "Online" },
        { time: "3:00 PM", event: "Judging Begins", place: "All Areas" },
        { time: "3:00 PM", event: "Project Fair Begins", place: "Gym A/B" },
        { time: "5:00 PM", event: "Judging Concludes", place: "All Areas" },
        { time: "5:00 PM", event: "Project Fair Concludes", place: "Gym A/B" },
        { time: "5:15 PM", event: "Dinner", place: "Cafeteria" },
        { time: "6:00 PM", event: "Closing Ceremony & Awards", place: "Cafeteria" },
        { time: "7:00 PM", event: "Event Concludes", place: "All Areas" },
      ] as ScheduleItem[],
    },
  ],
};

/* ---------------- sponsors ---------------- */

export type Sponsor = {
  name: string;
  href: string;
  logo: string;
  /** Logos that are dark-on-transparent are rendered white, as on the live site. */
  white: boolean;
  /**
   * Display width in px on desktop. Chosen from each file's measured content
   * area so every mark has similar optical weight within its tier.
   */
  w: number;
  /** Px of transparent padding baked into the file, cancelled with a negative margin top and bottom. */
  trim: number;
};

export const sponsors = {
  lede: "Support local student talent and help provide mentors, meals, swag, and prizes",
  become: "Become a Sponsor",
  prospectus: "View Prospectus",
  ourTitle: "Our Sponsors",
  ourSub: "Thank you to our wonderful sponsors for making hack::peel possible.",
  tiers: [
    {
      name: "Platinum",
      items: [
        { name: "Team 4308: Absolute Robotics", href: "https://www.team4308.ca/", logo: "/sponsors/4308.png", white: true, w: 75, trim: 0 },
        { name: "The Woodlands Secondary School", href: "https://thewoodlandsss.peelschools.org/", logo: "/sponsors/woodlands.png", white: false, w: 66, trim: 0 },
        { name: "Interview Cake", href: "https://www.interviewcake.com/", logo: "/sponsors/interviewcake.svg", white: true, w: 87, trim: 7 },
        { name: "ElevenLabs", href: "https://elevenlabs.io/", logo: "/sponsors/elevenlabs.png", white: true, w: 165, trim: 0 },
      ] as Sponsor[],
    },
    {
      name: "Gold",
      items: [
        { name: "Code Crafters", href: "https://codecrafters.io/", logo: "/sponsors/codecrafters.png", white: false, w: 92, trim: 21 },
        { name: ".xyz", href: "https://gen.xyz/", logo: "/sponsors/xyz.png", white: true, w: 64, trim: 0 },
        { name: "Kariaa", href: "https://www.kariaa.com/", logo: "/sponsors/kariaa.svg", white: true, w: 157, trim: 17 },
      ] as Sponsor[],
    },
    {
      name: "Silver",
      items: [
        { name: "PCBWay", href: "https://www.pcbway.com/", logo: "/sponsors/pcbway.png", white: true, w: 88, trim: 4 },
        { name: "Featherless", href: "https://featherless.ai/", logo: "/sponsors/featherless.svg", white: true, w: 95, trim: 1 },
        { name: "Windscribe", href: "https://windscribe.com/", logo: "/sponsors/windscribe.png", white: false, w: 37, trim: 0 },
        { name: "Let's Roam", href: "https://www.letsroam.com/team-building", logo: "/sponsors/letsroam.png", white: true, w: 65, trim: 0 },
        { name: "Anakin", href: "https://anakin.io/", logo: "/sponsors/anakin.png", white: true, w: 54, trim: 7 },
      ] as Sponsor[],
    },
    {
      name: "Bronze",
      items: [
        { name: "Art of Problem Solving", href: "https://artofproblemsolving.com/online", logo: "/sponsors/aops.png", white: true, w: 72, trim: 0 },
      ] as Sponsor[],
    },
  ],
  tiersTitle: "Sponsorship Tiers",
  tiersSub: "Choose the sponsorship tier that best fits your organization's goals",
  pricing: [
    {
      name: "Platinum",
      price: "$2000",
      benefits: [
        "Custom workshop hosting",
        "In-person sponsor stall",
        "Keynote at opening/closing ceremonies",
        "Judge panel participation",
        "Reserved sponsor Discord channel",
        "Create a category-specific prize",
        "Logo on merchandise",
        "Promoted on Social Media",
        "Distribute branded merchandise",
      ],
    },
    {
      name: "Gold",
      price: "$1000",
      benefits: [
        "Keynote at opening/closing ceremonies",
        "Judge panel participation",
        "Reserved sponsor Discord channel",
        "Create a category-specific prize",
        "Logo on merchandise",
        "Promoted on Social Media",
        "Distribute branded merchandise",
      ],
    },
    {
      name: "Silver",
      price: "$500",
      benefits: [
        "Keynote at opening/closing ceremonies",
        "Reserved sponsor Discord channel",
        "Create a category-specific prize",
        "Logo on merchandise",
        "Promoted on Social Media",
      ],
    },
    {
      name: "Bronze",
      price: "$250",
      benefits: [
        "Reserved sponsor Discord channel",
        "Logo on merchandise",
        "Promoted on Social Media",
      ],
    },
  ],
  whyTitle: "Why Sponsor?",
  why: "hack::peel brings together 100+ talented high school students from across Peel Region. By sponsoring, you'll gain access to diverse talent, build brand awareness among the next generation of tech leaders, and support STEM education in the community.",
  touch: "Get in Touch",
};

/* ---------------- faq ---------------- */

export const faq = {
  lede: "Everything you need to know about hack::peel",
  groups: [
    {
      name: "General",
      items: [
        { q: "What is hack::peel?", a: "hack::peel is a 34-hour hackathon in Peel Region run for students, by students. It's a chance to learn, build projects, make friends, and win prizes!" },
        { q: "Who can attend?", a: "Any high school student (grades 9-12) in Peel Region can attend. All skill levels are welcome, from complete beginners to experienced coders." },
        { q: "How much does it cost?", a: "hack::peel is completely free! We provide meals, snacks, swag, workshops, and more at no cost to participants." },
        { q: "Do I need a team?", a: "No! You can come solo and find a team at the event, or you can register with an existing team of up to 4 people." },
      ],
    },
    {
      name: "Logistics",
      items: [
        { q: "What should I bring?", a: "Bring your laptop, charger, student ID, and any hardware you want to hack with. We'll provide meals, snacks, and WiFi." },
        { q: "Where is the venue?", a: "The event will be held at The Woodlands Secondary School (3225 Erindale Station Rd). Check the Contact page for full details and directions." },
        { q: "Can I leave and come back?", a: "Yes! While we encourage participants to stay for the full experience, you're welcome to leave and return as needed." },
        { q: "What about parking?", a: "Free parking is available at the venue. Detailed parking information will be sent in your confirmation email." },
      ],
    },
    {
      name: "Hacking",
      items: [
        { q: "I've never coded before. Can I still participate?", a: "Absolutely! We have beginner-friendly workshops and mentors who can help you get started. Many first-time hackers have built amazing projects!" },
        { q: "What can I build?", a: "Anything! Software, hardware, design projects - as long as you create it during the 34 hours, it's fair game." },
        { q: "Can I work on an existing project?", a: "No. All projects must be started from scratch at hack::peel. However, you can use existing libraries, APIs, and frameworks." },
        { q: "What prizes can I win?", a: "We have prizes across multiple categories that may include Best Overall, Best Beginner, Best Hardware, Best Design, and more. Specific prizes TBA!" },
      ],
    },
    {
      name: "Code of Conduct",
      items: [
        { q: "What are the rules?", a: "All participants must follow our Code of Conduct, which promotes a safe, inclusive, and respectful environment for everyone." },
        { q: "What if I witness harassment?", a: "Please report any incidents immediately to an organizer or mentor. We have zero tolerance for harassment of any kind." },
        { q: "Are there quiet spaces available?", a: "Yes! We provide designated quiet spaces for participants who need a break from the main hacking area. There is also a public library on the premises." },
      ],
    },
  ],
  stillTitle: "Still Have Questions?",
  still: "Can't find what you're looking for? Reach out to our team and we'll get back to you ASAP!",
  contactUs: "Contact Us",
  joinDiscord: "Join Discord",
};

/* ---------------- register ---------------- */

export const register = {
  lede: "Join 100+ students for 24 hours of coding, workshops, and collaboration!",
  note: "* Participants must be currently enrolled in grades 9-12",
  roleNote: "* Participants must be in grades 9-12",
  dietary: [
    "None",
    "Vegetarian",
    "Vegan",
    "Halal",
    "Gluten-Free",
    "Dairy-Free",
    "Nut Allergy",
    "Kosher",
    "Other",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  successTitle: "You're Registered!",
  success:
    "Thanks for registering! Check your inbox for a confirmation email with event details and how to join our Discord.",
  failTitle: "Registration Failed",
  fail: "There was an error submitting your registration. Please try again.",
};

/* ---------------- contact ---------------- */

export const contact = {
  lede: "Questions, sponsorship inquiries, or volunteer opportunities? We'd love to hear from you!",
  emailTitle: "Email Us",
  email: "hello@hackpeel.ca",
  emailNote: "We typically respond within 24 hours",
  venueTitle: "Event Venue",
  venue: ["The Woodlands Secondary School", "3225 Erindale Station Rd", "Mississauga, ON L5C 1Y5"],
  venueNote: "Parking available on-site",
  volunteerTitle: "Want to Volunteer or Mentor?",
  volunteer:
    "We're always looking for passionate mentors and volunteers to help make hack::peel amazing!",
  apply: "Apply to Volunteer",
};

/* ---------------- legal ---------------- */

export const conduct = {
  lede: "hack::peel is committed to providing a safe, inclusive, and welcoming environment for all participants",
  principles: [
    { title: "Be Respectful", body: "Treat everyone with respect. Harassment, discrimination, or hateful conduct of any kind will not be tolerated." },
    { title: "Be Inclusive", body: "Welcome participants of all backgrounds, skill levels, and experiences. Help create a supportive environment." },
    { title: "Be Professional", body: "Maintain professional conduct in all interactions. Respect personal boundaries and communicate appropriately." },
    { title: "Report Issues", body: "If you witness or experience any violations, please report them to an organizer immediately." },
  ],
  expectedTitle: "Expected Behavior",
  expected: [
    "Be kind, patient, and welcoming to all participants regardless of skill level or background",
    "Respect different viewpoints, experiences, and perspectives",
    "Give and accept constructive criticism gracefully",
    "Focus on what's best for the community and fellow participants",
    "Show empathy and respect towards other community members",
  ],
  unacceptableTitle: "Unacceptable Behavior",
  unacceptable: [
    "Harassment, intimidation, or discrimination in any form",
    "Offensive comments related to gender, gender identity, sexual orientation, disability, physical appearance, race, or religion",
    "Inappropriate physical contact or unwelcome attention",
    "Deliberate intimidation, stalking, or following",
    "Sustained disruption of talks, workshops, or other events",
  ],
  enforcementTitle: "Enforcement",
  enforcement: [
    "Participants asked to stop any harassing behavior are expected to comply immediately. If a participant engages in unacceptable behavior, the organizers may take any action they deem appropriate, including warning the offender or expulsion from the event without refund.",
    "If you are being harassed, notice that someone else is being harassed, or have any other concerns, please contact a member of event staff immediately. Staff can be identified by their hack::peel organizer badges.",
  ],
  questionsTitle: "Questions or Concerns?",
  questions: "If you have questions about this Code of Conduct or need to report a violation, please contact us at",
  supportEmail: "support@hackpeel.ca",
};

export const privacy = {
  updated: "Last updated: October 20, 2026",
  sections: [
    {
      title: "Information We Collect",
      intro: "When you register for hack::peel, we collect personal information including:",
      list: [
        "Name, email address, and school information",
        "Emergency contact details",
        "Dietary restrictions and accessibility needs",
        "Technical skill level and project interests",
      ],
    },
    {
      title: "How We Use Your Information",
      intro: "We use the information we collect to:",
      list: [
        "Process your registration and manage event logistics",
        "Communicate event updates and important information",
        "Provide appropriate meals and accommodations",
        "Improve future events through feedback and analytics",
      ],
    },
    {
      title: "Data Sharing",
      intro: "We respect your privacy and only share your information when necessary:",
      list: [
        "With MLH (Major League Hacking) as per their privacy policy",
        "When required by law or to protect our rights",
      ],
      outro: "We never sell your personal information to third parties.",
    },
    {
      title: "Data Security",
      intro:
        "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      title: "Your Rights",
      intro: "You have the right to:",
      list: [
        "Access the personal information we hold about you",
        "Request correction of inaccurate information",
        "Request deletion of your information",
        "Opt-out of promotional communications",
      ],
    },
  ],
  contactTitle: "Contact Us",
  contact:
    "If you have questions about this Privacy Policy or want to exercise your rights, please contact us at",
};
