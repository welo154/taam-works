import type { Metadata } from "next";
import Link from "next/link";
import {
  deleteProject,
  moveProject,
  setStatus,
  updatePlacement,
} from "@/app/admin/projects/actions";
import { ConfirmButton } from "@/app/admin/projects/ConfirmButton";
import {
  assetToMedia,
  loadProjects,
  migrationApplied,
  type LoadedProject,
} from "@/lib/projects/db";
import { LAYOUT_LABELS } from "@/lib/projects/editor-types";
import type { ProjectLayout } from "@/lib/projects/types";
import { supabaseConfigured } from "@/lib/supabase/rest";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const button =
  "border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-neutral-400 disabled:opacity-30";
const select = "border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100";

const STATUS_STYLE = {
  published: "bg-green-500/15 text-green-300",
  draft: "bg-neutral-700/40 text-neutral-300",
  archived: "bg-red-500/15 text-red-300",
} as const;

function Thumb({ project }: { project: LoadedProject }) {
  const cover = project.row.cover_asset_id
    ? project.assets.get(project.row.cover_asset_id)
    : null;
  if (!cover) return <div className="h-20 w-16 shrink-0 bg-neutral-800" />;
  const media = assetToMedia(cover, project.assets);
  const src = media.kind === "video" ? media.posterSrc : media.src;
  if (!src) return <div className="h-20 w-16 shrink-0 bg-neutral-800" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="h-20 w-16 shrink-0 object-cover" />;
}

function Move({
  id,
  list,
  first,
  last,
}: {
  id: string;
  list: "works" | "home";
  first: boolean;
  last: boolean;
}) {
  return (
    <form action={moveProject} className="flex gap-1">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="list" value={list} />
      <button className={button} name="direction" value="up" disabled={first} aria-label="Move up">
        ↑
      </button>
      <button className={button} name="direction" value="down" disabled={last} aria-label="Move down">
        ↓
      </button>
    </form>
  );
}

export default async function AdminProjectsPage() {
  if (!supabaseConfigured()) {
    return (
      <p className="text-sm text-neutral-300">
        The database is not connected. Set SUPABASE_URL and SUPABASE_SECRET_KEY.
      </p>
    );
  }

  const [all, migrated] = await Promise.all([
    loadProjects("order=works_order.asc,created_at.asc"),
    migrationApplied(),
  ]);
  const active = all.filter((project) => project.row.status !== "archived");
  const archived = all.filter((project) => project.row.status === "archived");
  const home = active
    .filter((project) => project.row.show_on_home)
    .sort((a, b) => a.row.home_order - b.row.home_order);
  const layouts = (Object.keys(LAYOUT_LABELS) as ProjectLayout[]).filter(
    (value) => migrated || value !== "wide",
  );

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-3 max-w-2xl text-sm text-neutral-400">
            Add a project, stack its photos and videos, then choose where it
            appears. Only published projects are visible on the site.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="shrink-0 bg-yellow px-4 py-2 text-sm font-medium text-black"
        >
          Add project
        </Link>
      </div>

      {!migrated ? (
        <p className="mt-6 border border-yellow/50 bg-yellow/10 px-4 py-3 text-sm text-yellow">
          One database update is pending: run{" "}
          <code>supabase/migrations/20261113000001_bilingual_wide.sql</code> in
          the Supabase SQL Editor to switch on Arabic text and the Wide card size.
        </p>
      ) : null}

      <h2 className="mt-10 text-lg font-semibold">Works page order</h2>
      {active.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">
          No projects yet. The site shows the built-in samples until the first
          project is published.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-neutral-800 border-y border-neutral-800">
          {active.map((project, index) => {
            const { row } = project;
            return (
              <li key={row.id} className="flex flex-wrap items-center gap-4 py-4">
                <Move
                  id={row.id}
                  list="works"
                  first={index === 0}
                  last={index === active.length - 1}
                />
                <Thumb project={project} />
                <div className="min-w-40 flex-1">
                  <p className="text-lg">
                    {row.title}{" "}
                    <span className={`ml-1 px-2 py-0.5 align-middle text-xs ${STATUS_STYLE[row.status]}`}>
                      {row.status}
                    </span>
                  </p>
                  <p className="text-sm text-neutral-500">
                    {row.project_year ?? "No year"} · /works/{row.slug} ·{" "}
                    {project.rows.length} {project.rows.length === 1 ? "row" : "rows"}
                  </p>
                </div>

                <form action={updatePlacement} className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
                  <input type="hidden" name="id" value={row.id} />
                  <label className="flex items-center gap-1">
                    Works
                    <select name="worksLayout" defaultValue={row.works_layout} className={select}>
                      {layouts.map((value) => (
                        <option key={value} value={value}>
                          {LAYOUT_LABELS[value]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" name="showOnHome" defaultChecked={row.show_on_home} />
                    Home
                  </label>
                  <select name="homeLayout" defaultValue={row.home_layout} className={select} aria-label="Homepage size">
                    {layouts.map((value) => (
                      <option key={value} value={value}>
                        {LAYOUT_LABELS[value]}
                      </option>
                    ))}
                  </select>
                  <button className={button}>Apply</button>
                </form>

                <div className="flex items-center gap-2">
                  <form action={setStatus}>
                    <input type="hidden" name="id" value={row.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={row.status === "published" ? "draft" : "published"}
                    />
                    <button className={button} disabled={row.status !== "published" && !row.cover_asset_id}>
                      {row.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <Link href={`/admin/projects/${row.id}`} className={button}>
                    Edit
                  </Link>
                  {row.status === "published" ? (
                    <Link href={`/works/${row.slug}`} className={button}>
                      View
                    </Link>
                  ) : null}
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={row.id} />
                    <ConfirmButton
                      className={`${button} text-red-300`}
                      message={`Delete "${row.title}" and all its files? This cannot be undone.`}
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-12 text-lg font-semibold">Homepage order</h2>
      {home.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">
          Tick “Home” on a project above to place it on the homepage.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-neutral-800 border-y border-neutral-800">
          {home.map((project, index) => (
            <li key={project.row.id} className="flex items-center gap-4 py-3">
              <Move
                id={project.row.id}
                list="home"
                first={index === 0}
                last={index === home.length - 1}
              />
              <Thumb project={project} />
              <p className="flex-1">
                {project.row.title}
                {project.row.status !== "published" ? (
                  <span className="ml-2 text-xs text-neutral-500">(not published yet)</span>
                ) : null}
              </p>
              <p className="text-xs text-neutral-400">
                {LAYOUT_LABELS[project.row.home_layout]}
              </p>
            </li>
          ))}
        </ul>
      )}

      {archived.length > 0 ? (
        <>
          <h2 className="mt-12 text-lg font-semibold">Archived</h2>
          <ul className="mt-4 divide-y divide-neutral-800 border-y border-neutral-800">
            {archived.map((project) => (
              <li key={project.row.id} className="flex items-center gap-3 py-3 text-sm">
                <p className="flex-1 text-neutral-400">{project.row.title}</p>
                <form action={setStatus}>
                  <input type="hidden" name="id" value={project.row.id} />
                  <input type="hidden" name="status" value="draft" />
                  <button className={button}>Restore as draft</button>
                </form>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.row.id} />
                  <ConfirmButton
                    className={`${button} text-red-300`}
                    message={`Delete "${project.row.title}" permanently?`}
                  >
                    Delete
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
