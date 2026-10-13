import Image from "next/image";
import Link from "next/link";
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

  return (
    <article className={spanClass[layout]}>
      <Link
        href={`/works/${project.slug}`}
        className="group block focus-visible:outline-offset-4"
      >
        <div className="relative w-full overflow-hidden bg-cream/5">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            className="h-auto w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes={
              layout === "full"
                ? "100vw"
                : layout === "half"
                  ? "(max-width: 1024px) 50vw, 50vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />
        </div>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base text-cream md:text-lg">{project.title}</h3>
          {project.cardMeta ? (
            <span className="text-sm text-cream/50">{project.cardMeta}</span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
