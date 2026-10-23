import type { MetadataRoute } from "next";
import { getWorksProjects } from "@/lib/projects/queries";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/works`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/connect`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const works = await getWorksProjects();
  if (works.ok) {
    for (const { project } of works.data) {
      const cover = project.cover.src;
      entries.push({
        url: `${siteUrl}/works/${project.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        images: cover
          ? [cover.startsWith("/") ? `${siteUrl}${cover}` : cover]
          : undefined,
      });
    }
  }

  return entries;
}
