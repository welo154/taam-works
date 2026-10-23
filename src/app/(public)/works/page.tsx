import type { Metadata } from "next";
import { PortfolioStatus } from "@/components/projects/PortfolioStatus";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { worksIntro } from "@/content/site";
import { getWorksProjects } from "@/lib/projects/queries";

export const metadata: Metadata = {
  title: "Works",
  description: worksIntro.lead,
};

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const result = await getWorksProjects();

  return (
    <>
      <section className="works-page" aria-labelledby="works-heading">
        <div className="works-intro">
          <h1 id="works-heading" className="works-intro-title">
            <span className="works-intro-line">{worksIntro.lineOne}</span>
            <span className="works-intro-line">
              {worksIntro.lineTwoLead}{" "}
              <span className="works-intro-mark">{worksIntro.mark}</span>
            </span>
          </h1>
          <p className="works-intro-lead">{worksIntro.lead}</p>
        </div>
        {result.ok ? (
          result.data.length > 0 ? (
            <ProjectGrid
              placements={result.data}
              labelledBy="works-heading"
            />
          ) : (
            <PortfolioStatus message="No published projects yet." />
          )
        ) : (
          <PortfolioStatus message={result.message} />
        )}
      </section>
    </>
  );
}
