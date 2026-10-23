const CANONICAL_SITE_URL = "https://www.taamworks.com";

/** Canonical public origin, used for metadataBase, sitemap, robots, JSON-LD. */
export function getSiteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? CANONICAL_SITE_URL).replace(
    /\/$/,
    "",
  );
  try {
    const url = new URL(raw);
    if (url.hostname === "taamworks.com") url.hostname = "www.taamworks.com";
    return url.origin;
  } catch {
    return CANONICAL_SITE_URL;
  }
}
