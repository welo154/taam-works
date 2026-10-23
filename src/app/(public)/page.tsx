import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroLabels } from "@/components/hero/HeroLabels";
import { PortfolioStatus } from "@/components/projects/PortfolioStatus";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ServiceGroups } from "@/components/site/ServiceGroup";
import { StudioIntro } from "@/components/site/StudioIntro";
import { getHomeProjects } from "@/lib/projects/queries";

const homeTitle =
  "TAAM Works · Design, Tech, Events & Spaces Studio, London";
const homeDescription =
  "TAAM Works (taamworks.com) is a London studio for design, technology, events, and spaces. TAAM builds identities, exhibitions, and experiences.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
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

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const homeProjects = await getHomeProjects();

  return (
    <>
      <section className="hero-frame" aria-label="Hero">
        <h1 className="sr-only">
          TAAM Works — interdisciplinary studio for design, technology,
          events, and spaces in London
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
            <Link href="/works" className="works-view-all">
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
