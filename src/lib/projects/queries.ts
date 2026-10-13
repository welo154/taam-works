import { fixtureProjects } from "@/content/fixtures/projects";
import type { Project, ProjectCardPlacement } from "@/lib/projects/types";

const published = () =>
  fixtureProjects.filter((p) => p.status === "published");

export function getPublishedProjects(): Project[] {
  return published().sort(
    (a, b) => a.worksOrder - b.worksOrder || a.id.localeCompare(b.id),
  );
}

export function getHomeProjects(): ProjectCardPlacement[] {
  return published()
    .filter((p) => p.showOnHome)
    .sort((a, b) => a.homeOrder - b.homeOrder || a.id.localeCompare(b.id))
    .map((project) => ({ project, layout: project.homeLayout }));
}

export function getWorksProjects(): ProjectCardPlacement[] {
  return getPublishedProjects().map((project) => ({
    project,
    layout: project.worksLayout,
  }));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return published().find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return getPublishedProjects().map((p) => p.slug);
}
