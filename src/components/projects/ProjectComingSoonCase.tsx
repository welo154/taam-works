import type { Project } from "@/lib/projects/types";

type ProjectComingSoonCaseProps = {
  project: Project;
};

/** Centered Coming soon screen — no cover, copy, or next-project chrome. */
export function ProjectComingSoonCase({ project }: ProjectComingSoonCaseProps) {
  return (
    <section
      className="project-coming-screen"
      aria-label={`${project.title} — Coming soon`}
    >
      <h1 className="sr-only">{project.title}</h1>
      <p className="project-coming-kicker">TAAM WORKS</p>
      <p className="project-coming-title">Coming soon</p>
      <p className="project-coming-lead">
        This project is on its way. Check back soon.
      </p>
    </section>
  );
}

export function showsComingSoon(project: Project) {
  return project.comingSoon || project.media.length === 0;
}
