import type { Project } from "@/lib/projects/types";

function formatYear(year: number) {
  const short = String(year).slice(-2);
  return `'${short}`;
}

type ProjectSidebarProps = {
  project: Project;
};

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  const paragraphs = project.description
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="lg:sticky lg:top-[var(--header-offset)] lg:self-start">
      <div className="flex items-baseline gap-3">
        <h1
          id="project-title"
          className="text-3xl tracking-tight text-cream md:text-4xl"
        >
          {project.title}
        </h1>
        <span
          className="min-w-0 flex-1 border-b border-dotted border-cream/40"
          aria-hidden
        />
        <time
          className="shrink-0 text-lg text-cream/80"
          dateTime={String(project.projectYear)}
        >
          {formatYear(project.projectYear)}
        </time>
      </div>

      <div className="mt-8 space-y-4 text-cream/90">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>

      {project.tags.length > 0 ? (
        <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm text-cream/55">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
