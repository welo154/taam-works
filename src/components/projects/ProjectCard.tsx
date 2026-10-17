import Link from "next/link";
import { ProjectImage } from "@/components/projects/ProjectImage";
import type { Project, ProjectLayout } from "@/lib/projects/types";

const spanClass: Record<ProjectLayout, string> = {
  third: "col-span-6 sm:col-span-3 lg:col-span-2",
  half: "col-span-6 sm:col-span-3 lg:col-span-3",
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
    <article className={`${spanClass[layout]} self-start`}>
      <Link
        href={`/works/${project.slug}`}
        className="group block focus-visible:outline-offset-4"
      >
        <div
          className={`mb-3 flex gap-x-4 text-[length:var(--type-caption)] leading-[19px] text-cream ${
            labels.length > 2 ? "justify-between" : "justify-between"
          }`}
        >
          {labels.map((label) => (
            <span
              key={label}
              className={
                labels.length > 2 && label === labels[labels.length - 1]
                  ? "italic"
                  : undefined
              }
            >
              {label}
            </span>
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
