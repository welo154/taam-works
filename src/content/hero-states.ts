import type { NavItem } from "@/content/site";

export type HeroLabelId = NavItem["id"];

/**
 * Position as percentages of the Figma hero stage (951×349, node 4:960).
 * Values are top-left of each badge, matching Component 1 Frames 2–4.
 */
export type HeroPoint = {
  x: number;
  y: number;
};

export type HeroArrangement = Record<HeroLabelId, HeroPoint>;

const stage = { width: 951, height: 349 } as const;

const pct = (left: number, top: number): HeroPoint => ({
  x: (left / stage.width) * 100,
  y: (top / stage.height) * 100,
});

/** Desktop arrangements A → B → C from Figma Component 1 Frames 2, 3, 4. */
export const heroStatesDesktop: {
  A: HeroArrangement;
  B: HeroArrangement;
  C: HeroArrangement;
} = {
  A: {
    services: pct(33, 0),
    about: pct(0, 267),
    works: pct(362, 161),
    contact: pct(729, 174),
    initiatives: pct(572, 290),
  },
  B: {
    works: pct(449, 50),
    services: pct(81, 116),
    about: pct(236, 217),
    contact: pct(533, 173),
    initiatives: pct(393, 319),
  },
  C: {
    works: pct(160, 69),
    about: pct(684, 92),
    contact: pct(89, 260),
    initiatives: pct(327, 208),
    services: pct(601, 267),
  },
};

/** Collision-free mobile arrangement (settled / reduced-motion). */
export const heroStateMobile: HeroArrangement = {
  about: { x: 4, y: 4 },
  works: { x: 52, y: 4 },
  services: { x: 4, y: 78 },
  contact: { x: 4, y: 58 },
  initiatives: { x: 48, y: 78 },
};

export const heroTiming = {
  holdAMs: 400,
  transitionMs: 900,
  holdBMs: 700,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const heroSequence: Array<keyof typeof heroStatesDesktop> = [
  "A",
  "B",
  "C",
];

/** Wordmark placement inside the 951×349 stage (Asset 1@300x). */
export const heroWordmarkBox = {
  left: (118 / stage.width) * 100,
  top: (21 / stage.height) * 100,
  width: (640 / stage.width) * 100,
} as const;
