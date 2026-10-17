import { BackendRequestError, backendGet } from "@/lib/backend/client";
import { fixtureProjects } from "@/content/fixtures/projects";
import type {
  NextProjectDto,
  PaginationMeta,
  PublicProjectCardDto,
  PublicProjectDetailDto,
} from "@/lib/projects/api-types";
import { mapCardToProject, mapDetailToProject } from "@/lib/projects/map-api";
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
      data: cards.map((card) => ({
        project: mapCardToProject(card),
        layout: card.layout ?? card.homeLayout,
      })),
    };
  } catch {
    return { ok: true, data: homeFixturePlacements() };
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

export async function getWorksProjects(): Promise<
  ProjectLoadResult<ProjectCardPlacement[]>
> {
  try {
    const cards = await listPublished("works");
    return {
      ok: true,
      data: cards.map((card) => ({
        project: mapCardToProject(card),
        layout: card.layout ?? card.worksLayout,
      })),
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to load published projects.",
    };
  }
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
    throw error;
  }
}
