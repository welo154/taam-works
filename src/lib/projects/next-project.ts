import { getPublishedProjects } from "@/lib/projects/queries";
import type { Project } from "@/lib/projects/types";

export type NextProjectResult =
  | { kind: "project"; project: Project }
  | { kind: "all-work" };

/**
 * Next eligible item from published Works order.
 * Never returns the current project. End of list → All work.
 */
export function getNextProject(currentSlug: string): NextProjectResult {
  const list = getPublishedProjects();
  const index = list.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return { kind: "all-work" };
  const next = list[index + 1];
  if (!next) return { kind: "all-work" };
  return { kind: "project", project: next };
}
