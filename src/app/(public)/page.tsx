import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroLabels } from "@/components/hero/HeroLabels";
import { PortfolioStatus } from "@/components/projects/PortfolioStatus";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ComingSoon } from "@/components/site/ComingSoon";
import { ServiceGroups } from "@/components/site/ServiceGroup";
import { StudioIntro } from "@/components/site/StudioIntro";
import { getHomeProjects } from "@/lib/projects/queries";
import { isComingSoon } from "@/lib/coming-soon";

const homeTitle = "TaamWorks - Design Studio";
const homeDescription =
  "TAAM (TaamWorks) is a design studio in London for branding, technology, events, and spaces. Search TAAM or taamworks for identities, digital products, exhibitions, and experiences.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
  },
};

// Rebuilt at most every five minutes; dashboard saves refresh it at once.
export const revalidate = 300;

export default async function HomePage() {
  if (isComingSoon()) {
    return (
      <div className="coming-soon-home">
        <section className="hero-frame" aria-label="Hero">
          <h1 className="sr-only">
            TAAM — TaamWorks design studio in London
          </h1>
          <Image
            src="/brand/taam-wordmark.png"
            alt="TAAM"
            width={641}
            height={280}
            priority
            className="hero-taam"
          />
          <HeroLabels locked />
        </section>
        <div className="coming-soon-spacer" aria-hidden="true" />
        <ComingSoon />
      </div>
    );
  }

  const homeProjects = await getHomeProjects();

  return (
    <>
      <section className="hero-frame" aria-label="Hero">
        <h1 className="sr-only">
          TAAM — TaamWorks design studio in London
        </h1>
        <Image
          src="/brand/taam-wordmark.png"
          alt="TAAM"
          width={641}
          height={280}
          priority
          className="hero-taam"
        />
        <HeroLabels />
      </section>
      <StudioIntro />
      <section
        className="selected-work site-shell"
        aria-labelledby="selected-work-heading"
      >
        <h2 id="selected-work-heading" className="sr-only">
          Selected work
        </h2>
        {homeProjects.ok ? (
          homeProjects.data.length > 0 ? (
            <>
              <ProjectGrid
                placements={homeProjects.data}
                labelledBy="selected-work-heading"
              />
              <Link href="/works" className="works-view-all" data-reveal>
                <span className="works-view-all-label">VIEW ALL</span>
              </Link>
            </>
          ) : null
        ) : (
          <PortfolioStatus message={homeProjects.message} />
        )}
      </section>
      <ServiceGroups />
    </>
  );
}
