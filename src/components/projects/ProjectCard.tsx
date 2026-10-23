import Link from "next/link";
import { ProjectImage } from "@/components/projects/ProjectImage";
import type { Project, ProjectLayout } from "@/lib/projects/types";

const spanClass: Record<ProjectLayout, string> = {
  third: "col-span-6 sm:col-span-3 lg:col-span-2",
  half: "col-span-6 sm:col-span-3 lg:col-span-3",
  wide: "col-span-6 lg:col-span-4",
  full: "col-span-6",
};

type ProjectCardProps = {
  project: Project;
  layout: ProjectLayout;
};

export function ProjectCard({ project, layout }: ProjectCardProps) {
  const { cover } = project;
  const labels = project.homeLabels ?? [
    project.title.toUpperCase(),
    project.cardMeta ?? String(project.projectYear),
  ];

  return (
    <article
      className={`${spanClass[layout]} self-start${project.tightGap ? " project-card-tight" : ""}${project.cardAlign ? " project-card-sized" : ""}`}
      style={
        project.cardAlign
          ? ({
              "--card-width": `${cover.width}px`,
              "--card-align": project.cardAlign,
            } as React.CSSProperties)
          : undefined
      }
    >
      <Link
        href={`/works/${project.slug}`}
        className="group block focus-visible:outline-offset-4"
      >
        <div
          className={`project-card-label${project.captionItalic ? " project-card-label-italic" : ""}`}
        >
          {labels.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
        <div className="overflow-hidden bg-cream/5">
          <ProjectImage
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            slug={project.slug}
            className="w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes={
              layout === "full"
                ? "100vw"
                : layout === "wide"
                  ? "(max-width: 1024px) 100vw, 887px"
                  : layout === "half"
                    ? "(max-width: 1024px) 50vw, 50vw"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />
        </div>
      </Link>
    </article>
  );
}
