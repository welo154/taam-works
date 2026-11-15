import { unstable_cache } from "next/cache";
import { fixtureProjects } from "@/content/fixtures/projects";
import type { NextProjectDto } from "@/lib/projects/next-project";
import {
  getPublishedBySlug as readPublishedBySlug,
  listPublished as readPublished,
} from "@/lib/projects/db";
import type { Project, ProjectCardPlacement } from "@/lib/projects/types";

/**
 * Public reads are cached for five minutes so pages can be served from the
 * edge instead of waiting on the database for every visitor and crawler.
 * Dashboard changes clear the cache at once (see PROJECTS_TAG in actions.ts).
 */
export const PROJECTS_TAG = "projects";
const CACHE = { revalidate: 300, tags: [PROJECTS_TAG] };
const listPublished = unstable_cache(readPublished, ["projects-list"], CACHE);
const getPublishedBySlug = unstable_cache(
  readPublishedBySlug,
  ["projects-by-slug"],
  CACHE,
);

export type ProjectLoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/**
 * Published projects come from Supabase. The built-in sample projects are
 * shown only while the database has nothing published (or is unreachable),
 * so the site is never empty.
 */

function homeFixturePlacements(): ProjectCardPlacement[] {
  return fixtureProjects
    .filter((project) => project.showOnHome && project.status === "published")
    .sort((a, b) => a.homeOrder - b.homeOrder)
    .map((project) => ({ project, layout: project.homeLayout }));
}

function worksFixturePlacements(): ProjectCardPlacement[] {
  return fixtureProjects
    .filter((project) => project.status === "published")
    .sort((a, b) => a.worksOrder - b.worksOrder)
    .map((project) => ({ project, layout: project.worksLayout }));
}

async function publishedOrNull(placement: "home" | "works") {
  try {
    // "Nothing published" is judged on the whole catalogue, not the homepage
    // subset, so an empty homepage selection does not bring the samples back.
    const works = await listPublished("works");
    if (works.length === 0) return null;
    if (placement === "works") return works;
    return works
      .filter((project) => project.showOnHome)
      .sort((a, b) => a.homeOrder - b.homeOrder);
  } catch (error) {
    console.error("[projects] database read failed; using samples.", error);
    return null;
  }
}

export async function getHomeProjects(): Promise<
  ProjectLoadResult<ProjectCardPlacement[]>
> {
  const projects = await publishedOrNull("home");
  if (!projects) return { ok: true, data: homeFixturePlacements() };
  return {
    ok: true,
    data: projects.map((project) => ({ project, layout: project.homeLayout })),
  };
}

export async function getWorksProjects(): Promise<
  ProjectLoadResult<ProjectCardPlacement[]>
> {
  const projects = await publishedOrNull("works");
  if (!projects) return { ok: true, data: worksFixturePlacements() };
  return {
    ok: true,
    data: projects.map((project) => ({ project, layout: project.worksLayout })),
  };
}

function fixtureProjectBySlug(slug: string): {
  project: Project;
  next: NextProjectDto;
} | null {
  const published = fixtureProjects
    .filter((project) => project.status === "published")
    .sort((a, b) => a.worksOrder - b.worksOrder || a.id.localeCompare(b.id));
  const index = published.findIndex((project) => project.slug === slug);
  if (index === -1) return null;
  const following = published[index + 1];
  return {
    project: published[index],
    next: following ? { slug: following.slug, title: following.title } : null,
  };
}

export async function getProjectBySlug(slug: string): Promise<{
  project: Project;
  next: NextProjectDto;
} | null> {
  try {
    const found = await getPublishedBySlug(slug);
    if (found) return found;
  } catch (error) {
    console.error("[projects] database read failed; using samples.", error);
  }
  return fixtureProjectBySlug(slug);
}
