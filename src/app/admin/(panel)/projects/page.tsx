import type { Metadata } from "next";
import Link from "next/link";
import {
  deleteProject,
  moveProject,
  setStatus,
  updatePlacement,
} from "@/app/admin/(panel)/projects/actions";
import { ConfirmButton } from "@/app/admin/(panel)/projects/ConfirmButton";
import {
  badge,
  btnDanger,
  btnPrimary,
  btnSmall,
  card,
  cardPad,
  eyebrow,
  iconButton,
  pageTitle,
  selectSmall,
  STATUS_BADGE,
} from "@/app/admin/ui";
import {
  assetToMedia,
  loadProjects,
  migrationApplied,
  type LoadedProject,
} from "@/lib/projects/db";
import { LAYOUT_LABELS } from "@/lib/projects/editor-types";
import type { ProjectLayout } from "@/lib/projects/types";
import { supabaseConfigured } from "@/lib/supabase/rest";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

function Thumb({ project, size = "h-24 w-20" }: { project: LoadedProject; size?: string }) {
  const cover = project.row.cover_asset_id
    ? project.assets.get(project.row.cover_asset_id)
    : null;
  const media = cover ? assetToMedia(cover, project.assets) : null;
  const src = media ? (media.kind === "video" ? media.posterSrc : media.src) : null;
  if (!src) {
    return (
      <div
        className={`${size} flex shrink-0 items-center justify-center rounded-xl bg-white/5 text-[10px] uppercase tracking-wider text-neutral-500`}
      >
        No cover
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={`${size} shrink-0 rounded-xl object-cover`} />;
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
    <form action={moveProject} className="flex flex-col gap-1">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="list" value={list} />
      <button className={iconButton} name="direction" value="up" disabled={first} aria-label="Move up">
        ↑
      </button>
      <button className={iconButton} name="direction" value="down" disabled={last} aria-label="Move down">
        ↓
      </button>
    </form>
  );
}

export default async function AdminProjectsPage() {
  if (!supabaseConfigured()) {
    return (
      <p className={`${cardPad} text-sm text-neutral-300`}>
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
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Projects</p>
          <h1 className={`${pageTitle} mt-2`}>Your work</h1>
          <p className="mt-3 max-w-2xl text-sm text-neutral-400">
            Add a project, stack its photos and films, then choose where it
            appears. Only published projects are visible on the site.
          </p>
        </div>
        <Link href="/admin/projects/new" className={btnPrimary}>
          + Add project
        </Link>
      </header>

      {!migrated ? (
        <p className="rounded-2xl border border-yellow/40 bg-yellow/10 px-5 py-4 text-sm text-yellow">
          One database update is pending. Run{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5">
            supabase/migrations/20261113000001_bilingual_wide.sql
          </code>{" "}
          in the Supabase SQL Editor to switch on Arabic text and the Wide card
          size.
        </p>
      ) : null}

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-cream">Works page order</h2>
          <p className="text-sm text-neutral-500">
            {active.length} {active.length === 1 ? "project" : "projects"}
          </p>
        </div>
        {active.length === 0 ? (
          <div className={`${cardPad} text-center`}>
            <p className="text-lg font-bold text-cream">No projects yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-400">
              The site shows the built-in samples until the first project is
              published.
            </p>
            <Link href="/admin/projects/new" className={`${btnPrimary} mt-6`}>
              + Add your first project
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {active.map((project, index) => {
              const { row } = project;
              return (
                <li key={row.id} className={`${card} flex flex-wrap items-center gap-5 p-4 md:p-5`}>
                  <Move
                    id={row.id}
                    list="works"
                    first={index === 0}
                    last={index === active.length - 1}
                  />
                  <Thumb project={project} />
                  <div className="min-w-44 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Link
                        href={`/admin/projects/${row.id}`}
                        className="text-xl font-bold text-cream hover:text-yellow"
                      >
                        {row.title}
                      </Link>
                      <span className={`${badge} ${STATUS_BADGE[row.status]}`}>
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      {row.project_year ?? "No year"} · /works/{row.slug} ·{" "}
                      {project.rows.length}{" "}
                      {project.rows.length === 1 ? "row" : "rows"}
                    </p>

                    <form
                      action={updatePlacement}
                      className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-400"
                    >
                      <input type="hidden" name="id" value={row.id} />
                      <label className="flex items-center gap-1.5">
                        Works size
                        <select name="worksLayout" defaultValue={row.works_layout} className={selectSmall}>
                          {layouts.map((value) => (
                            <option key={value} value={value}>
                              {LAYOUT_LABELS[value]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-neutral-200">
                        <input
                          type="checkbox"
                          name="showOnHome"
                          defaultChecked={row.show_on_home}
                          className="accent-[#f5e600]"
                        />
                        On homepage
                      </label>
                      <select
                        name="homeLayout"
                        defaultValue={row.home_layout}
                        className={selectSmall}
                        aria-label="Homepage size"
                      >
                        {layouts.map((value) => (
                          <option key={value} value={value}>
                            {LAYOUT_LABELS[value]}
                          </option>
                        ))}
                      </select>
                      <button className={btnSmall}>Apply</button>
                    </form>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={row.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={row.status === "published" ? "draft" : "published"}
                      />
                      <button
                        className={btnSmall}
                        disabled={row.status !== "published" && !row.cover_asset_id}
                        title={
                          row.status !== "published" && !row.cover_asset_id
                            ? "Add a cover before publishing"
                            : undefined
                        }
                      >
                        {row.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <Link href={`/admin/projects/${row.id}`} className={btnSmall}>
                      Edit
                    </Link>
                    {row.status === "published" ? (
                      <Link href={`/works/${row.slug}`} target="_blank" className={btnSmall}>
                        View ↗
                      </Link>
                    ) : null}
                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={row.id} />
                      <ConfirmButton
                        className={btnDanger}
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
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-cream">Homepage order</h2>
        {home.length === 0 ? (
          <p className={`${cardPad} text-sm text-neutral-400`}>
            Tick “On homepage” on a project above to place it in the homepage’s
            selected work.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {home.map((project, index) => (
              <li key={project.row.id} className={`${card} flex items-center gap-4 p-4`}>
                <Move
                  id={project.row.id}
                  list="home"
                  first={index === 0}
                  last={index === home.length - 1}
                />
                <Thumb project={project} size="h-16 w-14" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-cream">
                    <span className="mr-2 text-neutral-500">{index + 1}</span>
                    {project.row.title}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {LAYOUT_LABELS[project.row.home_layout]}
                    {project.row.status !== "published" ? " · not published yet" : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {archived.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-bold text-cream">Archived</h2>
          <ul className="space-y-2">
            {archived.map((project) => (
              <li key={project.row.id} className={`${card} flex items-center gap-3 px-5 py-3 text-sm`}>
                <p className="flex-1 text-neutral-300">{project.row.title}</p>
                <form action={setStatus}>
                  <input type="hidden" name="id" value={project.row.id} />
                  <input type="hidden" name="status" value="draft" />
                  <button className={btnSmall}>Restore as draft</button>
                </form>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.row.id} />
                  <ConfirmButton
                    className={btnDanger}
                    message={`Delete "${project.row.title}" permanently?`}
                  >
                    Delete
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
