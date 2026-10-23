/**
 * Static English studio copy and navigation.
 * Homepage animation/copy are code-managed; portfolio content is data-driven.
 * Type, spacing, and hero coordinates come from TaamWorks Figma (Page 1).
 */

export const siteMeta = {
  name: "TAAM Works",
  studioLabel: "taamworks",
  copyrightYear: 2026,
  fontNote: "Acumin Pro, loaded from the licensed desktop files.",
} as const;

export const contact = {
  email: "hello@taamworks.com",
  phone: "+(20) 109 180 2996",
  behance: "https://www.behance.net/",
  instagram: "https://www.instagram.com/",
} as const;

export type NavItem = {
  id: string;
  label: string;
  color: "blue" | "red" | "pink" | "yellow" | "gray";
  href: string | null;
  opensConsultation?: boolean;
};

export const heroNav: NavItem[] = [
  { id: "about", label: "ABOUT", color: "blue", href: "/#about" },
  { id: "works", label: "WORKS", color: "red", href: "/works" },
  { id: "services", label: "SERVICES", color: "pink", href: "/#services" },
  {
    id: "contact",
    label: "CONTACT",
    color: "yellow",
    href: "/connect",
    opensConsultation: true,
  },
  // Initiatives has no confirmed destination — non-navigating label.
  { id: "initiatives", label: "INITIATIVES", color: "gray", href: null },
];

export const studioIntro = {
  id: "about",
  label: "taamworks",
  lead: "an interdisciplinary studio\nbased in London.",
  body: "Working across design, technology, experiences, and spaces. We bring together diverse disciplines to create purposeful identities, products, environments, and experiences that bring ideas to life across physical and digital experiences.",
} as const;

export type ServiceItem = {
  title: string;
  description: string;
};

export type ServiceGroup = {
  number: string;
  title: string;
  /** Exact badge lines. Spaces are intentional and differ per service. */
  badgeLines: readonly string[];
  titleLines?: readonly string[];
  intro: string;
  items: readonly ServiceItem[];
};

export const serviceGroups: readonly ServiceGroup[] = [
  {
    number: "01",
    title: "DESIGN",
    badgeLines: ["01   DESIGN"],
    intro:
      "We build identities and communication systems that help brands, organizations, and ideas establish a distinctive and consistent presence.",
    items: [
      {
        title: "Brand Identity",
        description:
          "Creating visual identity systems that translate a brand’s character into a recognizable visual language.",
      },
      {
        title: "Brand Strategy",
        description:
          "Defining positioning, personality, audience, and strategic direction to build meaningful brands.",
      },
      {
        title: "Creative Direction",
        description:
          "Establishing and overseeing the creative vision across different mediums and touchpoints.",
      },
      {
        title: "Communication Design",
        description:
          "Designing visual communication across print, digital, editorial, campaigns, and other brand applications.",
      },
      {
        title: "Type Design & Lettering",
        description:
          "Creating custom typefaces, lettering, and typographic systems tailored to specific identities and contexts.",
      },
      {
        title: "Digital Design",
        description:
          "Designing websites and digital experiences that extend identities into interactive environments.",
      },
      {
        title: "Campaign Design",
        description:
          "Developing visual concepts and communication systems for launches, campaigns, and cultural initiatives.",
      },
    ],
  },
  {
    number: "02",
    title: "TECH",
    badgeLines: ["02       TECH"],
    intro:
      "We design and develop digital products and systems where technology, functionality, and user experience work together.",
    items: [
      {
        title: "UI/UX Design",
        description:
          "Designing intuitive interfaces and user journeys around real behaviors and needs.",
      },
      {
        title: "Web Design & Development",
        description:
          "Creating responsive digital platforms from experience and interface design through development.",
      },
      {
        title: "App Design & Development",
        description:
          "Designing and developing digital applications with coherent user experiences and scalable structures.",
      },
      {
        title: "Digital Product Design",
        description:
          "Developing digital products from initial concept and functionality to interface and experience.",
      },
      {
        title: "Automation & Workflow Systems",
        description:
          "Building automated processes that simplify operations, connect tools, and reduce repetitive work.",
      },
      {
        title: "System Design",
        description:
          "Structuring interconnected digital systems, workflows, and platforms around complex organizational needs.",
      },
      {
        title: "Creative Technology",
        description:
          "Exploring technology as a creative medium through interactive experiences, installations, generative systems, and experimental digital applications.",
      },
    ],
  },
  {
    number: "03",
    title: "EVENTS",
    badgeLines: ["03 EVENTS"],
    intro:
      "We create physical and cultural experiences from concept to execution, combining strategy, storytelling, design, curation, and production.",
    items: [
      {
        title: "Event Strategy, Concept & Creative Direction",
        description:
          "Developing the central concept, strategic direction, and creative vision that shape the event and connect its content, identity, spaces, and overall experience.",
      },
      {
        title: "Curation & Programming",
        description:
          "Developing meaningful programs through speakers, exhibitions, performances, workshops, and other forms of content.",
      },
      {
        title: "Event Identity & Communication",
        description:
          "Developing visual identities and communication systems specifically for events and cultural programs.",
      },
      {
        title: "Event Management & Production",
        description:
          "Planning and coordinating the operational elements required to deliver an event from preparation to execution.",
      },
      {
        title: "Exhibitions & Installations",
        description:
          "Conceptualizing and designing exhibitions and installations that bring content and narratives into physical space.",
      },
    ],
  },
  {
    number: "04",
    title: "SPACE & OBJECTS",
    badgeLines: ["04    SPACE", "&OBJECTS"],
    titleLines: ["SPACE", "&OBJECTS"],
    intro:
      "We translate ideas and identities into physical environments and objects, connecting spatial thinking with design, function, and experience.",
    items: [
      {
        title: "Interior Design",
        description:
          "Designing interior environments around function, atmosphere, identity, and human experience.",
      },
      {
        title: "Spatial Design",
        description:
          "Creating physical environments and spatial interventions that communicate ideas through space.",
      },
      {
        title: "Retail & Pop-up Design",
        description:
          "Creating temporary and permanent branded environments for retail, activations, and public engagement.",
      },
      {
        title: "Product Design",
        description:
          "Developing physical products from concept and form to functionality and user experience.",
      },
      {
        title: "Furniture & Object Design",
        description:
          "Designing functional objects and furniture with attention to material, form, and context.",
      },
      {
        title: "Wayfinding & Environmental Graphics",
        description:
          "Integrating typography, signage, information, and visual identity into physical environments.",
      },
    ],
  },
] as const;

export const closingLine = {
  lead: "LET ",
  emphasis: "TAAM WORK!",
} as const;

export const connectCta = "LET'S CONNECT" as const;

export const worksIntro = {
  lineOne: "See what",
  lineTwoLead: "we’ve",
  mark: "taam’d.",
  lead: "A closer look at what we do, how we think, and what we bring to life. A selection of identities, ideas, and experiences shaped through our work.",
} as const;

export const consultation = {
  title: "Book a free consultation",
  lead: "Tell us a little about the work. This sends a request — it is not a confirmed appointment.",
  submit: "Send request",
  sending: "Sending request…",
  success:
    "Thank you. We have received your request and will be in touch shortly.",
  close: "Close",
  emailFallback: "Or email us directly",
} as const;
