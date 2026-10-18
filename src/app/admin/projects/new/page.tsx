import type { Metadata } from "next";
import Link from "next/link";
import { NewProjectForm } from "@/app/admin/projects/new/NewProjectForm";

export const metadata: Metadata = {
  title: "Add project",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <div>
      <p className="text-sm">
        <Link href="/admin/projects" className="text-neutral-400 underline-offset-4 hover:underline">
          Projects
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-semibold">Add project</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-400">
        The public page keeps the IDEA structure: title, year, English and
        Arabic paragraphs, tags, then the photo and video rows in order.
      </p>
      <NewProjectForm />
    </div>
  );
}
