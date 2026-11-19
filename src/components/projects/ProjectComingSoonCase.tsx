import Link from "next/link";
import type { Project } from "@/lib/projects/types";
import { caseFromProject } from "@/components/projects/ProjectCase";

const LEADER = "-----------------------------------------------------------";

function yearLabel(year: number | null) {
  if (!year) return null;
  return `\u2018${String(year).slice(-2)}`;
}

type ProjectComingSoonCaseProps = {
  project: Project;
  nextSlug: string | null;
};

/** Cover-only project page while the media stack is still being prepared. */
export function ProjectComingSoonCase({
  project,
  nextSlug,
}: ProjectComingSoonCaseProps) {
  const studio = caseFromProject({ ...project, media: [] });
  const cover = studio.cover;
  const tags = project.tags.map((tag) => tag.toUpperCase()).join(", ");
  const year = yearLabel(project.projectYear);
  const titleAr = (project.titleAr ?? "").trim();
  const descriptionAr = (project.descriptionAr ?? "").trim();

  return (
    <>
      <div className="idea-content">
        <div className="idea-media project-coming-media">
          <img
            className="idea-media-asset idea-media-lead project-coming-cover"
            style={{
              width: `${cover.width}px`,
              height: `${cover.height}px`,
              aspectRatio: `${cover.width} / ${cover.height}`,
            }}
            src={cover.src}
            alt={cover.alt}
            width={Math.round(cover.width)}
            height={Math.round(cover.height)}
          />
          <section
            className="project-coming-soon"
            aria-label="Coming soon"
            data-reveal
          >
            <p className="project-coming-kicker">TAAM WORKS</p>
            <h2 className="project-coming-title">Coming soon</h2>
            <p className="project-coming-lead">
              The full project story is on its way. The cover is live; detail
              photos and films will land here next.
            </p>
          </section>
        </div>
        <div className="idea-copy">
          <h1 className="idea-title load-rise">
            <span className="idea-title-en">{project.title} </span>
            {titleAr ? (
              <span className="idea-title-ar" lang="ar">
                {titleAr}
              </span>
            ) : null}
            <span className="idea-leader" aria-hidden="true">
              {LEADER}
            </span>
            {year ? <span className="idea-year">{year}</span> : null}
          </h1>
          {project.description ? (
            <p
              className="idea-copy-en load-rise"
              style={{ "--load-i": 1 } as React.CSSProperties}
            >
              {project.description}
            </p>
          ) : null}
          {descriptionAr ? (
            <p
              className="idea-copy-ar load-rise"
              lang="ar"
              dir="rtl"
              style={{ "--load-i": 2 } as React.CSSProperties}
            >
              {descriptionAr}
            </p>
          ) : null}
          {tags ? (
            <p
              className="idea-tags load-rise"
              style={{ "--load-i": 3 } as React.CSSProperties}
            >
              {tags}
            </p>
          ) : null}
        </div>
      </div>
      <div className="idea-stage" />
      <Link
        href={nextSlug ? `/works/${nextSlug}` : "/works"}
        className="idea-next"
        data-reveal
      >
        <span>NEXT PROJECT</span>
        <svg
          className="idea-next-arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="59"
          height="58"
          viewBox="0 0 62 61"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M31 1.5C14.7076 1.5 1.5 14.4837 1.5 30.5C1.5 46.5163 14.7076 59.5 31 59.5C47.2924 59.5 60.5 46.5163 60.5 30.5C60.5 14.4837 47.2924 1.5 31 1.5Z"
            fill="#F5E600"
          />
          <path d="M31 42.1L42.8 30.5L31 18.9" fill="#F5E600" />
          <path
            d="M31 18.9L42.8 30.5L31 42.1M42.8 30.5L19.2 30.5M1.5 30.5C1.5 14.4837 14.7076 1.5 31 1.5C47.2924 1.5 60.5 14.4837 60.5 30.5C60.5 46.5163 47.2924 59.5 31 59.5C14.7076 59.5 1.5 46.5163 1.5 30.5Z"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#000"
          />
        </svg>
      </Link>
      <div className="idea-rule idea-rule-header" aria-hidden="true" />
      <div className="idea-rule idea-rule-content" aria-hidden="true" />
    </>
  );
}

export function showsComingSoon(project: Project) {
  return project.comingSoon || project.media.length === 0;
}
