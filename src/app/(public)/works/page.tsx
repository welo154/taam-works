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
      <div className="works-banner" />
      <section className="works-page" aria-labelledby="works-heading">
        <h1 id="works-heading" className="works-lead">
          <span className="works-lead-line">
            {worksIntro.lineOne} {worksIntro.lineTwoLead}{" "}
          </span>
          <span className="works-lead-mark">{worksIntro.mark}</span>
        </h1>
        <p className="works-intro">{worksIntro.lead}</p>
        <div className="site-shell">
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
        </div>
      </section>
    </>
  );
}
