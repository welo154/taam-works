import { BackendRequestError, backendGet } from "@/lib/backend/client";
import { fixtureProjects } from "@/content/fixtures/projects";
import type {
  NextProjectDto,
  PaginationMeta,
  PublicProjectCardDto,
  PublicProjectDetailDto,
} from "@/lib/projects/api-types";
import { mapCardToProject, mapDetailToProject } from "@/lib/projects/map-api";
import { readStudioProjects } from "@/lib/projects/studio-store";
import type { StudioProject } from "@/lib/projects/studio-store";
import type { Project, ProjectCardPlacement } from "@/lib/projects/types";

export type ProjectLoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

async function listPublished(
  placement: "home" | "works",
  pageSize = 24,
): Promise<PublicProjectCardDto[]> {
  const result = await backendGet<PublicProjectCardDto[], PaginationMeta>(
    `/api/v1/projects?placement=${placement}&page=1&pageSize=${pageSize}`,
  );
  return result.data ?? [];
}

export async function getHomeProjects(): Promise<
  ProjectLoadResult<ProjectCardPlacement[]>
> {
  try {
    const cards = await listPublished("home");
    return {
      ok: true,
      data: await withStudioProjects(
        cards.map((card) => ({
          project: mapCardToProject(card),
          layout: card.layout ?? card.homeLayout,
        })),
        "home",
      ),
    };
  } catch {
    return { ok: true, data: await withStudioProjects(homeFixturePlacements(), "home") };
  }
}

function homeFixturePlacements(): ProjectCardPlacement[] {
  return fixtureProjects
    .filter((project) => project.showOnHome && project.status === "published")
    .sort((a, b) => a.homeOrder - b.homeOrder)
    .map((project) => ({
      project,
      layout: project.homeLayout,
    }));
}

function worksFixturePlacements(): ProjectCardPlacement[] {
  return fixtureProjects
    .filter((project) => project.status === "published")
    .sort((a, b) => a.worksOrder - b.worksOrder)
    .map((project) => ({
      project,
      layout: project.worksLayout,
    }));
}

function studioPlacement(
  project: StudioProject,
  placement: "home" | "works",
): ProjectCardPlacement | null {
  if (placement === "home" && !project.showOnHome) return null;
  return {
    layout: "third",
    project: {
      id: project.id,
      slug: project.slug,
      title: project.titleEn,
      projectYear: project.year,
      description: project.descriptionEn,
      tags: project.tags,
      cardMeta: String(project.year),
      homeLabels: [project.titleEn.toUpperCase(), String(project.year)],
      status: "published",
      cover: {
        id: `${project.id}-cover`,
        kind: "image",
        src: project.cover.src,
        alt: project.cover.alt,
        width: Math.round(project.cover.width),
        height: Math.round(project.cover.height),
      },
      media: [],
      worksOrder: project.worksOrder,
      worksLayout: "third",
      showOnHome: project.showOnHome,
      homeOrder: project.homeOrder,
      homeLayout: "third",
    },
  };
}

async function withStudioProjects(
  placements: ProjectCardPlacement[],
  placement: "home" | "works",
) {
  const studio = await readStudioProjects();
  const seen = new Set(placements.map((item) => item.project.slug));
  const extra = studio.flatMap((project) => {
    const item = studioPlacement(project, placement);
    if (!item || seen.has(item.project.slug)) return [];
    return [item];
  });
  const order = (item: ProjectCardPlacement) =>
    placement === "home" ? item.project.homeOrder : item.project.worksOrder;
  return [...placements, ...extra].sort((a, b) => order(a) - order(b));
}

export async function getWorksProjects(): Promise<
  ProjectLoadResult<ProjectCardPlacement[]>
> {
  try {
    const cards = await listPublished("works");
    return {
      ok: true,
      data: await withStudioProjects(
        cards.map((card) => ({
          project: mapCardToProject(card),
          layout: card.layout ?? card.worksLayout,
        })),
        "works",
      ),
    };
  } catch (error) {
    if (
      error instanceof BackendRequestError &&
      error.code === "backend_unreachable"
    ) {
      return {
        ok: true,
        data: await withStudioProjects(worksFixturePlacements(), "works"),
      };
    }
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to load published projects.",
    };
  }
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
    next: following
      ? { slug: following.slug, title: following.title }
      : null,
  };
}

export async function getProjectBySlug(slug: string): Promise<{
  project: Project;
  next: NextProjectDto;
} | null> {
  try {
    const result = await backendGet<
      PublicProjectDetailDto,
      { nextProject: NextProjectDto }
    >(`/api/v1/projects/${encodeURIComponent(slug)}`);
    if (!result.data) return null;
    return {
      project: mapDetailToProject(result.data),
      next: result.meta?.nextProject ?? null,
    };
  } catch (error) {
    if (error instanceof BackendRequestError && error.status === 404) {
      return null;
    }
    if (
      error instanceof BackendRequestError &&
      error.code === "backend_unreachable"
    ) {
      return fixtureProjectBySlug(slug);
    }
    throw error;
  }
}
