import type { Metadata } from "next";
import Link from "next/link";
import { readStudioProjects } from "@/lib/projects/studio-store";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await readStudioProjects();

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-3 max-w-2xl text-sm text-neutral-400">
            New projects use the same page as IDEA: English and Arabic titles,
            both paragraphs, tags, and an ordered column of photos and videos.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="shrink-0 bg-yellow px-4 py-2 text-sm font-medium text-black"
        >
          Add project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 text-sm text-neutral-400">
          No dashboard projects yet. IDEA stays on its own page.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
          {projects.map((project) => (
            <li key={project.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-lg">{project.titleEn}</p>
                <p className="text-sm text-neutral-500">
                  {project.year} · /works/{project.slug}
                </p>
              </div>
              <Link
                href={`/works/${project.slug}`}
                className="text-sm text-yellow underline-offset-4 hover:underline"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
