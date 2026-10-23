import Link from "next/link";
import { IdeaMediaScroll } from "@/components/projects/IdeaMediaScroll";
import type { StudioAsset, StudioProject, StudioRow } from "@/lib/projects/studio-store";
import type { MediaAsset, Project } from "@/lib/projects/types";

const LEADER = "-----------------------------------------------------------";

function yearLabel(year: number | null) {
  if (!year) return null;
  return `\u2018${String(year).slice(-2)}`;
}

const VIDEO_FILE = /\.(mp4|webm|mov|m4v)(\?|$)/i;

function fittedAsset(asset: MediaAsset, slot: number): StudioAsset {
  const playable = asset.kind === "video" && VIDEO_FILE.test(asset.src);
  const width = Math.max(1, Math.min(slot, asset.width));
  const height = Math.max(1, Math.round((asset.height * width) / Math.max(asset.width, 1)));
  return {
    kind: playable ? "video" : "image",
    src: playable ? asset.src : asset.kind === "video" ? (asset.posterSrc ?? asset.src) : asset.src,
    alt: asset.alt,
    width,
    height,
  };
}

/** Map a published project onto the IDEA case. Arabic is shown only when supplied. */
export function caseFromProject(project: Project): StudioProject {
  const rows: StudioRow[] = project.media.map((row) => {
    if (row.layout === "pair") {
      return {
        id: row.id,
        layout: "pair",
        left: fittedAsset(row.primary, 359),
        right: fittedAsset(row.secondary, 360),
      };
    }
    return {
      id: row.id,
      layout: "single",
      asset: fittedAsset(row.primary, 719),
    };
  });

  return {
    id: project.id,
    slug: project.slug,
    titleEn: project.title,
    titleAr: "",
    year: project.projectYear ?? 0,
    descriptionEn: project.description,
    descriptionAr: "",
    tags: project.tags,
    cover: fittedAsset(project.cover, 719),
    rows:
      rows.length > 0
        ? rows
        : [
            {
              id: `${project.id}-cover`,
              layout: "single",
              asset: fittedAsset(project.cover, 719),
            },
          ],
    showOnHome: project.showOnHome,
    worksOrder: project.worksOrder,
    homeOrder: project.homeOrder,
    createdAt: "",
  };
}

function AssetView({
  asset,
  lead = false,
}: {
  asset: StudioAsset;
  lead?: boolean;
}) {
  const className = lead
    ? "idea-media-asset idea-media-lead"
    : "idea-media-asset";
  const style = {
    width: `${asset.width}px`,
    height: `${asset.height}px`,
    aspectRatio: `${asset.width} / ${asset.height}`,
  };
  if (asset.kind === "video") {
    return (
      <video
        className={className}
        style={style}
        src={asset.src}
        width={Math.round(asset.width)}
        height={Math.round(asset.height)}
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noplaybackrate"
      />
    );
  }
  return (
    <img
      className={className}
      style={style}
      src={asset.src}
      alt={asset.alt}
      width={Math.round(asset.width)}
      height={Math.round(asset.height)}
    />
  );
}

type ProjectCaseProps = {
  project: StudioProject;
  nextSlug: string | null;
};

export function ProjectCase({ project, nextSlug }: ProjectCaseProps) {
  const tags = project.tags.map((tag) => tag.toUpperCase()).join(", ");
  const year = yearLabel(project.year);
  const titleAr = project.titleAr.trim();
  const descriptionAr = project.descriptionAr.trim();

  return (
    <>
      <div className="idea-content">
        <IdeaMediaScroll>
          {project.rows.map((row, index) => {
            const lead = index === 0;
            if (row.layout === "single") {
              return <AssetView key={row.id} asset={row.asset} lead={lead} />;
            }
            return (
              <div
                key={row.id}
                className={lead ? "idea-media-row idea-media-lead" : "idea-media-row"}
              >
                <AssetView asset={row.left} />
                <AssetView asset={row.right} />
              </div>
            );
          })}
        </IdeaMediaScroll>
        <div className="idea-copy">
          <h1 className="idea-title">
            <span className="idea-title-en">{project.titleEn} </span>
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
          <p className="idea-copy-en">{project.descriptionEn}</p>
          {descriptionAr ? (
            <p className="idea-copy-ar" lang="ar" dir="rtl">
              {descriptionAr}
            </p>
          ) : null}
          {tags ? <p className="idea-tags">{tags}</p> : null}
        </div>
      </div>
      <div className="idea-stage" />
      <Link href={nextSlug ? `/works/${nextSlug}` : "/works"} className="idea-next">
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
