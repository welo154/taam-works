/**
 * Temporary public gate: live production shows the homepage only.
 * Override with NEXT_PUBLIC_COMING_SOON=1|0. Defaults on for Vercel production.
 */
export function isComingSoon() {
  const flag = process.env.NEXT_PUBLIC_COMING_SOON;
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  return process.env.VERCEL_ENV === "production";
}
