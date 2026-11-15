import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseFromProject, ProjectCase } from "@/components/projects/ProjectCase";
import { toNextProject } from "@/lib/projects/next-project";
import { getProjectBySlug } from "@/lib/projects/queries";
import { getSiteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Built on first visit, then cached; dashboard saves refresh it at once.
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await getProjectBySlug(slug);
    if (!result) return { title: "Project" };
    const { project } = result;
    return projectMetadata(
      project.seoTitle ?? project.title,
      project.seoDescription ?? project.description,
      project.cover.src,
      slug,
    );
  } catch {
    return { title: "Project" };
  }
}

function projectMetadata(
  title: string,
  description: string,
  cover: string,
  slug: string,
): Metadata {
  const summary = description.replace(/\s+/g, " ").trim().slice(0, 160);
  const images = cover ? [cover] : undefined;
  return {
    title,
    description: summary,
    alternates: { canonical: `/works/${slug}` },
    openGraph: { type: "article", title, description: summary, images },
    twitter: { card: "summary_large_image", title, description: summary, images },
  };
}

function ProjectJsonLd({
  title,
  description,
  slug,
  image,
  year,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  image: string;
  year: number | null;
  tags: string[];
}) {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url: `${siteUrl}/works/${slug}`,
    image: image.startsWith("/") ? `${siteUrl}${image}` : image,
    dateCreated: year ? String(year) : undefined,
    keywords: tags.length ? tags.join(", ") : undefined,
    creator: { "@type": "Organization", name: "TAAM Works", url: siteUrl },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) notFound();

  const { project } = result;
  const next = toNextProject(result.next);

  return (
    <>
      <ProjectJsonLd
        title={project.title}
        description={project.description}
        slug={slug}
        image={project.cover.src}
        year={project.projectYear}
        tags={project.tags}
      />
      <ProjectCase
        project={caseFromProject(project)}
        nextSlug={next.kind === "project" ? next.slug : null}
      />
    </>
  );
}
