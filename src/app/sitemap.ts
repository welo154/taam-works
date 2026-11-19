import type { MetadataRoute } from "next";
import { getWorksProjects } from "@/lib/projects/queries";
import { getSiteUrl } from "@/lib/site-url";

// Served from cache and rebuilt at most hourly (and whenever the dashboard
// saves a project), so crawlers get it instantly instead of waiting on the
// database.
export const revalidate = 3600;

/** Last change to the fixed pages; bump when their content changes. */
const PAGES_UPDATED = new Date("2026-11-15T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const works = await getWorksProjects();
  const projects = works.ok ? works.data.map(({ project }) => project) : [];

  // Real edit dates: search engines ignore a "last modified" that is always now.
  const edited = (iso?: string) => {
    const date = iso ? new Date(iso) : PAGES_UPDATED;
    return Number.isNaN(date.getTime()) ? PAGES_UPDATED : date;
  };
  const latest = projects.reduce(
    (newest, project) =>
      edited(project.updatedAt) > newest ? edited(project.updatedAt) : newest,
    PAGES_UPDATED,
  );

  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/works`,
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/connect`,
      lastModified: PAGES_UPDATED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const seen = new Set<string>();
  for (const project of projects) {
    if (seen.has(project.slug)) continue;
    seen.add(project.slug);
    const cover = project.cover.src;
    entries.push({
      url: `${siteUrl}/works/${project.slug}`,
      lastModified: edited(project.updatedAt),
      changeFrequency: "monthly",
      priority: 0.8,
      images: cover
        ? [cover.startsWith("/") ? `${siteUrl}${cover}` : cover]
        : undefined,
    });
  }
  if (!seen.has("idea")) {
    entries.push({
      url: `${siteUrl}/works/idea`,
      lastModified: PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
