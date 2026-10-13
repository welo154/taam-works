import type { Project } from "@/lib/projects/types";

/**
 * LOCAL FIXTURES — not production CMS data.
 * Media paths point at TEMPORARY placeholders under /public/placeholders.
 * Replace with original exports from Figma / DAM before launch.
 */

const ph = (
  name: string,
  width: number,
  height: number,
  alt: string,
): Project["cover"] => ({
  id: `ph-${name}`,
  kind: "image",
  src: `/placeholders/${name}.svg`,
  alt,
  width,
  height,
});

export const fixtureProjects: Project[] = [
  {
    id: "proj-tech-valley",
    slug: "tech-valley",
    title: "Tech Valley",
    projectYear: 2024,
    description:
      "Identity and digital presence for a technology community program. Fixture description pending client-approved English copy.",
    tags: ["Branding", "Digital"],
    cardMeta: "Tech",
    status: "published",
    cover: ph("cover-tech-valley", 800, 1000, "Tech Valley project cover placeholder"),
    media: [
      {
        id: "tv-m1",
        layout: "single",
        primary: ph("media-portrait", 900, 1200, "Tech Valley media placeholder"),
      },
      {
        id: "tv-m2",
        layout: "pair",
        primary: ph("media-square", 800, 800, "Tech Valley detail A placeholder"),
        secondary: ph("media-square-b", 800, 800, "Tech Valley detail B placeholder"),
      },
    ],
    worksOrder: 1,
    worksLayout: "third",
    showOnHome: true,
    homeOrder: 1,
    homeLayout: "third",
  },
  {
    id: "proj-idea",
    slug: "idea",
    title: "IDEA",
    projectYear: 2024,
    // Sample mockup reused studio intro — keep clearly as placeholder.
    description:
      "[PLACEHOLDER — not a real project description] Multidisciplinary studio work spanning brand systems and exhibition presence. Replace with project-specific English copy: client/context, work delivered, approach, and outcomes where available.",
    tags: ["Branding", "Exhibition"],
    cardMeta: "Design",
    status: "published",
    cover: ph("cover-idea", 900, 900, "IDEA project cover placeholder"),
    media: [
      {
        id: "idea-m1",
        layout: "single",
        primary: ph("media-wide", 1400, 900, "IDEA primary media placeholder"),
      },
      {
        id: "idea-m2",
        layout: "single",
        primary: ph("media-portrait", 900, 1200, "IDEA secondary media placeholder"),
      },
      {
        id: "idea-m3",
        layout: "pair",
        primary: ph("media-square", 800, 800, "IDEA pair left placeholder"),
        secondary: ph("media-square-b", 800, 800, "IDEA pair right placeholder"),
      },
    ],
    worksOrder: 2,
    worksLayout: "third",
    showOnHome: true,
    homeOrder: 2,
    homeLayout: "third",
  },
  {
    id: "proj-events",
    slug: "events-program",
    title: "Events Program",
    projectYear: 2023,
    description:
      "Creative direction and programming support for a cultural events series. Fixture description pending confirmed English copy.",
    tags: ["Events", "Direction"],
    cardMeta: "Events",
    status: "published",
    cover: ph("cover-events", 800, 1100, "Events program cover placeholder"),
    media: [
      {
        id: "ev-m1",
        layout: "single",
        primary: ph("media-portrait", 900, 1200, "Events media placeholder"),
      },
    ],
    worksOrder: 3,
    worksLayout: "third",
    showOnHome: true,
    homeOrder: 3,
    homeLayout: "third",
  },
  {
    id: "proj-calligraphy",
    slug: "calligraphy-gathering",
    title: "Calligraphy Gathering",
    projectYear: 2024,
    description:
      "Spatial and graphic support for a large calligraphy-focused gathering. Fixture description pending confirmed English copy. Arabic lettering in artwork is preserved when original media replace placeholders.",
    tags: ["Events", "Spatial"],
    cardMeta: "Featured",
    status: "published",
    cover: ph("cover-featured", 1600, 900, "Featured calligraphy cover placeholder"),
    media: [
      {
        id: "cal-m1",
        layout: "single",
        primary: ph("media-wide", 1400, 900, "Calligraphy wide media placeholder"),
      },
      {
        id: "cal-m2",
        layout: "single",
        primary: {
          id: "ph-video",
          kind: "video",
          src: "/placeholders/media-video-poster.svg",
          alt: "Video row placeholder — replace with project video",
          width: 1280,
          height: 720,
          posterSrc: "/placeholders/media-video-poster.svg",
        },
      },
    ],
    worksOrder: 4,
    worksLayout: "full",
    showOnHome: true,
    homeOrder: 4,
    homeLayout: "full",
  },
  {
    id: "proj-spatial",
    slug: "spatial-study",
    title: "Spatial Study",
    projectYear: 2023,
    description:
      "Interior and object studies for a hospitality environment. Fixture description pending confirmed English copy.",
    tags: ["Interior", "Objects"],
    status: "published",
    cover: ph("cover-spatial", 1000, 750, "Spatial study cover placeholder"),
    media: [
      {
        id: "sp-m1",
        layout: "pair",
        primary: ph("media-square", 800, 800, "Spatial pair left placeholder"),
        secondary: ph("media-square-b", 800, 800, "Spatial pair right placeholder"),
      },
    ],
    worksOrder: 5,
    worksLayout: "half",
    showOnHome: false,
    homeOrder: 0,
    homeLayout: "half",
  },
  {
    id: "proj-objects",
    slug: "object-series",
    title: "Object Series",
    projectYear: 2022,
    description:
      "Furniture and object design explorations. Fixture description pending confirmed English copy.",
    tags: ["Objects"],
    status: "published",
    cover: ph("cover-objects", 1000, 750, "Object series cover placeholder"),
    media: [
      {
        id: "ob-m1",
        layout: "single",
        primary: ph("media-wide", 1400, 900, "Object series media placeholder"),
      },
    ],
    worksOrder: 6,
    worksLayout: "half",
    showOnHome: false,
    homeOrder: 0,
    homeLayout: "half",
  },
];
