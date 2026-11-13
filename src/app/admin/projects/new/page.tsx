import { randomUUID } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { ProjectEditor } from "@/app/admin/projects/ProjectEditor";
import { migrationApplied } from "@/lib/projects/db";

export const metadata: Metadata = { title: "Add project" };
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const migrated = await migrationApplied();
  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-neutral-400 hover:text-neutral-100">
        ← Projects
      </Link>
      <h1 className="mb-8 mt-3 text-2xl font-semibold">Add project</h1>
      <ProjectEditor
        migrated={migrated}
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
          showOnHome: false,
          homeLayout: "third",
          worksLayout: "third",
        }}
      />
    </div>
  );
}
