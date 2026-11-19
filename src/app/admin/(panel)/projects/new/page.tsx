import { randomUUID } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { ProjectEditor } from "@/app/admin/(panel)/projects/ProjectEditor";
import { comingSoonColumnApplied, migrationApplied } from "@/lib/projects/db";

export const metadata: Metadata = { title: "Add project" };
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const [migrated, comingSoonReady] = await Promise.all([
    migrationApplied(),
    comingSoonColumnApplied(),
  ]);
  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-sm text-neutral-400 transition hover:text-cream"
      >
        ← Projects
      </Link>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        New project
      </p>
      <h1 className="mb-8 mt-2 text-3xl font-bold tracking-tight text-cream md:text-4xl">
        Add project
      </h1>
      <ProjectEditor
        migrated={migrated}
        comingSoonReady={comingSoonReady}
        initial={{
          id: randomUUID(),
          isNew: true,
          slug: "",
          titleEn: "",
          titleAr: "",
          year: new Date().getFullYear(),
          descriptionEn: "",
          descriptionAr: "",
          tags: [],
          cardMeta: "",
          status: "draft",
          cover: null,
          rows: [],
          comingSoon: true,
          showOnHome: false,
          homeLayout: "third",
          worksLayout: "third",
        }}
      />
    </div>
  );
}
