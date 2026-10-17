import type { Metadata } from "next";
import { PortfolioStatus } from "@/components/projects/PortfolioStatus";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ConnectSection } from "@/components/site/ConnectSection";
import { getWorksProjects } from "@/lib/projects/queries";

export const metadata: Metadata = {
  title: "Works",
  description: "Selected projects from TAAM Works.",
};

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const result = await getWorksProjects();

  return (
    <>
      <section
        className="site-shell py-[var(--space-section)]"
        aria-labelledby="works-heading"
      >
        <h1
          id="works-heading"
          className="mb-10 text-3xl tracking-tight text-cream md:mb-14 md:text-4xl"
        >
          Works
        </h1>
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
      <ConnectSection />
    </>
  );
}
