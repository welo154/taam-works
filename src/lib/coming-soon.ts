/**
 * Temporary public gate: homepage-only mode.
 * Off by default so Google can index the full site.
 * Set NEXT_PUBLIC_COMING_SOON=1 to re-enable.
 */
export function isComingSoon() {
  const flag = process.env.NEXT_PUBLIC_COMING_SOON;
  return flag === "1" || flag === "true";
}
