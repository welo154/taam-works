import type { Project } from "@/lib/projects/types";

/**
 * LOCAL FIXTURES — not production CMS data.
 * Home covers are Figma exports. Remaining gallery rows still use
 * placeholders until project-page media is supplied.
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

const figmaCover = (
  id: string,
  file: string,
  width: number,
  height: number,
  alt: string,
): Project["cover"] => ({
  id,
  kind: "image",
  src: `/work/${file}`,
  alt,
  width,
  height,
});

export const fixtureProjects: Project[] = [
  {
    id: "proj-tech-valley",
    slug: "tech-valley",
    title: "Tech Valley",
    projectYear: 2026,
    description:
      "Identity and digital presence for a technology community program. Fixture description pending client-approved English copy.",
    tags: ["Branding", "Digital"],
    cardMeta: "CAI",
    homeLabels: ["TECH VALLEY", "CAI"],
    status: "published",
    cover: figmaCover(
      "cover-tech-valley",
      "tech-valley.jpg",
      435,
      263,
      "Tech Valley project cover",
    ),
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
    projectYear: 2026,
    description:
      "[PLACEHOLDER — not a real project description] Multidisciplinary studio work spanning brand systems and exhibition presence. Replace with project-specific English copy: client/context, work delivered, approach, and outcomes where available.",
    tags: ["Branding", "Exhibition"],
    cardMeta: "AMM",
    homeLabels: ["IDEA", "AMM"],
    status: "published",
    cover: figmaCover("cover-idea", "idea.png", 434, 455, "IDEA project cover"),
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
    title: "Events",
    projectYear: 2026,
    description:
      "Creative direction and programming support for a cultural events series. Fixture description pending confirmed English copy.",
    tags: ["Events", "Direction"],
    cardMeta: "2026",
    homeLabels: ["EVENTS", "2026"],
    status: "published",
    cover: figmaCover(
      "cover-events",
      "events.png",
      435,
      525,
      "Events project cover",
    ),
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
    title: "Multaqa Alkhatt",
    projectYear: 2025,
    description:
      "Spatial and graphic support for a large calligraphy-focused gathering. Fixture description pending confirmed English copy. Arabic lettering in artwork is preserved.",
    tags: ["Events", "Spatial"],
    cardMeta: "EVENT",
    homeLabels: ["MULTAQA ALKHATT", "EVENT", "MALAYSIA", "2025"],
    status: "published",
    cover: figmaCover(
      "cover-featured",
      "multaqa-alkhatt.png",
      1340,
      825,
      "Multaqa Alkhatt event cover",
    ),
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
