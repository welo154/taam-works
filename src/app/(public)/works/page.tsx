import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ConnectSection } from "@/components/site/ConnectSection";
import { getWorksProjects } from "@/lib/projects/queries";

export const metadata: Metadata = {
  title: "Works",
  description: "Selected projects from TAAM Works.",
};

export default function WorksPage() {
  const placements = getWorksProjects();

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
        <ProjectGrid placements={placements} labelledBy="works-heading" />
      </section>
      <ConnectSection />
    </>
  );
}
