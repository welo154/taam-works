import { AnimatedHero } from "@/components/hero/AnimatedHero";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ConnectSection } from "@/components/site/ConnectSection";
import { LetTaamWork } from "@/components/site/LetTaamWork";
import { ServiceGroups } from "@/components/site/ServiceGroup";
import { StudioIntro } from "@/components/site/StudioIntro";
import { getHomeProjects } from "@/lib/projects/queries";

export default function HomePage() {
  const homeProjects = getHomeProjects();

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
        <ProjectGrid
          placements={homeProjects}
          labelledBy="selected-work-heading"
        />
      </section>
      <ServiceGroups />
      <LetTaamWork />
      <ConnectSection />
    </>
  );
}
