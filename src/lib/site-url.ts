const DEFAULT_SITE_URL = "https://taamworks.com";

/** Canonical public origin, used for metadataBase, sitemap, robots, JSON-LD. */
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  );
}
