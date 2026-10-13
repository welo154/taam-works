import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectCardPlacement } from "@/lib/projects/types";

type ProjectGridProps = {
  placements: ProjectCardPlacement[];
  labelledBy?: string;
};

/**
 * Six-column desktop grid: third=2, half=3, full=6.
 * Collapses toward two columns then one on narrower screens.
 */
export function ProjectGrid({ placements, labelledBy }: ProjectGridProps) {
  return (
    <div
      className="grid grid-cols-6 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14"
      role="list"
      aria-labelledby={labelledBy}
    >
      {placements.map(({ project, layout }) => (
        <div key={project.id} role="listitem" className="contents">
          <ProjectCard project={project} layout={layout} />
        </div>
      ))}
    </div>
  );
}
