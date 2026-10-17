import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextProjectLink } from "@/components/projects/NextProjectLink";
import { ProjectMediaStack } from "@/components/projects/ProjectMediaStack";
import { ProjectSidebar } from "@/components/projects/ProjectSidebar";
import { ConnectSection } from "@/components/site/ConnectSection";
import { toNextProject } from "@/lib/projects/next-project";
import { getProjectBySlug } from "@/lib/projects/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await getProjectBySlug(slug);
    if (!result) return { title: "Project" };
    return {
      title: result.project.seoTitle ?? result.project.title,
      description:
        result.project.seoDescription ??
        result.project.description.replace(/\s+/g, " ").slice(0, 160),
    };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) notFound();

  const { project } = result;
  const next = toNextProject(result.next);

  return (
    <>
      <section
        className="site-shell py-10 md:py-14"
        aria-labelledby="project-title"
      >
        {/*
          Desktop: ~42% sticky description / ~58% media.
          Sticky is scoped to this section so it releases before Next Project.
          Mobile: normal stacked flow (no sticky).
        */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:items-start lg:gap-12">
          <ProjectSidebar project={project} />
          <ProjectMediaStack media={project.media} />
        </div>
      </section>
      <NextProjectLink next={next} />
      <ConnectSection />
    </>
  );
}
