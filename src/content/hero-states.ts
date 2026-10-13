import type { NavItem } from "@/content/site";

export type HeroLabelId = NavItem["id"];

/** Position as percentages of the bounded hero stage (not the viewport). */
export type HeroPoint = {
  x: number;
  y: number;
};

export type HeroArrangement = Record<HeroLabelId, HeroPoint>;

/**
 * Desktop arrangements A → B → C from the brief / walkthrough.
 * Coordinates are approximate until Figma exports refine them.
 */
export const heroStatesDesktop: {
  A: HeroArrangement;
  B: HeroArrangement;
  C: HeroArrangement;
} = {
  A: {
    services: { x: 8, y: 18 },
    about: { x: 10, y: 72 },
    works: { x: 42, y: 38 },
    contact: { x: 78, y: 36 },
    initiatives: { x: 72, y: 78 },
  },
  B: {
    works: { x: 48, y: 14 },
    services: { x: 8, y: 42 },
    about: { x: 38, y: 78 },
    contact: { x: 78, y: 48 },
    initiatives: { x: 55, y: 88 },
  },
  C: {
    works: { x: 10, y: 16 },
    about: { x: 78, y: 18 },
    contact: { x: 12, y: 78 },
    initiatives: { x: 48, y: 82 },
    services: { x: 78, y: 76 },
  },
};

/** Collision-free mobile arrangement (settled / reduced-motion). */
export const heroStateMobile: HeroArrangement = {
  about: { x: 18, y: 12 },
  works: { x: 78, y: 12 },
  services: { x: 16, y: 88 },
  contact: { x: 52, y: 88 },
  initiatives: { x: 86, y: 88 },
};

export const heroTiming = {
  /** Hold at A before first move */
  holdAMs: 400,
  /** Transition duration A→B and B→C */
  transitionMs: 900,
  /** Hold at B before moving to C */
  holdBMs: 700,
  /** CSS easing — exact Figma curves unknown */
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const heroSequence: Array<keyof typeof heroStatesDesktop> = [
  "A",
  "B",
  "C",
];
