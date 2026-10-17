import { AnimatedHero } from "@/components/hero/AnimatedHero";
import { PortfolioStatus } from "@/components/projects/PortfolioStatus";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ConnectSection } from "@/components/site/ConnectSection";
import { LetTaamWork } from "@/components/site/LetTaamWork";
import { ServiceGroups } from "@/components/site/ServiceGroup";
import { StudioIntro } from "@/components/site/StudioIntro";
import { getHomeProjects } from "@/lib/projects/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const homeProjects = await getHomeProjects();

  return (
    <>
      <AnimatedHero />
      <StudioIntro />
      <section
        className="site-shell pb-[var(--space-section)]"
        aria-labelledby="selected-work-heading"
      >
        <h2 id="selected-work-heading" className="sr-only">
          Selected work
        </h2>
        {homeProjects.ok ? (
          homeProjects.data.length > 0 ? (
            <ProjectGrid
              placements={homeProjects.data}
              labelledBy="selected-work-heading"
            />
          ) : null
        ) : (
          <PortfolioStatus message={homeProjects.message} />
        )}
      </section>
      <ServiceGroups />
      <LetTaamWork />
      <ConnectSection />
    </>
  );
}
