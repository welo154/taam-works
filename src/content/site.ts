/**
 * Static English studio copy and navigation.
 * Homepage animation/copy are code-managed; portfolio content is data-driven.
 */

export const siteMeta = {
  name: "TAAM Works",
  studioLabel: "taamworks",
  copyrightYear: 2026,
  temporaryFontNote:
    "Body type is a TEMPORARY Google font until Figma webfonts are supplied.",
} as const;

export const contact = {
  email: "hello@taamworks.example",
  phone: "+00 000 000 0000",
  emailNote: "Placeholder — replace with verified address before launch.",
  phoneNote: "Placeholder — replace with verified number before launch.",
  behance: "https://www.behance.net/",
  instagram: "https://www.instagram.com/",
  socialNote: "Placeholder social destinations until verified.",
} as const;

export type NavItem = {
  id: string;
  label: string;
  color: "blue" | "red" | "pink" | "yellow" | "gray";
  href: string | null;
};

export const heroNav: NavItem[] = [
  { id: "about", label: "About", color: "blue", href: "/#about" },
  { id: "works", label: "Works", color: "red", href: "/works" },
  { id: "services", label: "Services", color: "pink", href: "/#services" },
  { id: "contact", label: "Contact", color: "yellow", href: "/connect" },
  // Initiatives has no confirmed destination — non-navigating label.
  { id: "initiatives", label: "Initiatives", color: "gray", href: null },
];

export const studioIntro = {
  id: "about",
  label: "taamworks",
  paragraphs: [
    "TAAM is a multidisciplinary studio working across design, technology, events, and spatial practice. We shape identities, digital products, cultural programs, and environments with equal care for concept and craft.",
    "Our collaborators include cultural institutions, technology companies, and independent makers who need clear direction and considered execution.",
  ],
} as const;

/**
 * Shorter service lists match the supplied screenshots.
 * The walkthrough video shows longer lists (Creative Direction, Communication
 * Design, Type Design & Lettering, Digital Design, Product Design, Furniture &
 * Object Design, Wayfinding & Environmental Graphics, etc.). Keep this file
 * editable; revise if Figma lists differ.
 */
export const serviceGroups = [
  {
    number: "01",
    title: "Design",
    items: ["Brand Identity", "Brand Strategy"],
  },
  {
    number: "02",
    title: "Tech",
    items: ["UI/UX Design", "Web Design & Development"],
  },
  {
    number: "03",
    title: "Events",
    items: [
      "Event Strategy, Concept & Creative Direction",
      "Curation & Programming",
    ],
  },
  {
    number: "04",
    title: "Space & Objects",
    items: ["Interior Design", "Spatial Design"],
  },
] as const;

export const closingLine = "LET TAAM WORK!" as const;
export const connectCta = "LET'S CONNECT" as const;
