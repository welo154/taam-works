import type { Metadata } from "next";
import Link from "next/link";
import { badge, btnGhost, btnPrimary, card, cardPad, eyebrow, pageTitle, STATUS_BADGE } from "@/app/admin/ui";
import { bookingDetails, listInquiries, type Inquiry } from "@/lib/inquiries";
import { loadProjects, type LoadedProject } from "@/lib/projects/db";
import { supabaseConfigured } from "@/lib/supabase/rest";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

function Stat({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: number;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className={`${card} p-5 ${accent ? "border-yellow/40 bg-yellow/[0.07]" : ""}`}>
      <p className={eyebrow}>{label}</p>
      <p className={`mt-3 text-5xl font-bold tracking-tight ${accent ? "text-yellow" : "text-cream"}`}>
        {value}
      </p>
      <p className="mt-2 text-sm text-neutral-400">{hint}</p>
    </div>
  );
}

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OverviewPage() {
  if (!supabaseConfigured()) {
    return (
      <p className={`${cardPad} text-sm text-neutral-300`}>
        The database is not connected. Set SUPABASE_URL and SUPABASE_SECRET_KEY.
      </p>
    );
  }

  let projects: LoadedProject[] = [];
  let inquiries: Inquiry[] = [];
  let failed = false;
  try {
    [projects, inquiries] = await Promise.all([
      loadProjects("order=updated_at.desc"),
      listInquiries(50),
    ]);
  } catch {
    failed = true;
  }

  const published = projects.filter((p) => p.row.status === "published").length;
  const drafts = projects.filter((p) => p.row.status === "draft").length;
  const onHome = projects.filter(
    (p) => p.row.status === "published" && p.row.show_on_home,
  ).length;
  const fresh = inquiries.filter((inquiry) => inquiry.status === "new");

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Overview</p>
          <h1 className={`${pageTitle} mt-2`}>Welcome back.</h1>
        </div>
        <Link href="/admin/projects/new" className={btnPrimary}>
          + Add project
        </Link>
      </header>

      {failed ? (
        <p className={`${cardPad} text-sm text-red-300`}>
          The database could not be reached. If it was paused, restore it in
          Supabase and reload.
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="New requests" value={fresh.length} hint="Waiting for a reply" accent={fresh.length > 0} />
        <Stat label="Published" value={published} hint="Live on the site" />
        <Stat label="Drafts" value={drafts} hint="Not visible yet" />
        <Stat label="On homepage" value={onHome} hint="Shown in selected work" />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={cardPad}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-cream">Latest requests</h2>
            <Link href="/admin/requests" className={btnGhost}>
              See all
            </Link>
          </div>
          {inquiries.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-400">
              No consultation requests yet.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-white/10">
              {inquiries.slice(0, 5).map((inquiry) => {
                const details = bookingDetails(inquiry);
                return (
                  <li key={inquiry.id} className="flex items-center gap-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-cream">{inquiry.name}</p>
                      <p className="truncate text-sm text-neutral-400">
                        {inquiry.service_interest}
                        {details.phone ? ` · ${details.phone}` : ""}
                      </p>
                    </div>
                    <span className={`${badge} ${STATUS_BADGE[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                    <span className="hidden text-xs text-neutral-500 sm:block">
                      {when(inquiry.created_at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={cardPad}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-cream">Recently edited</h2>
            <Link href="/admin/projects" className={btnGhost}>
              All projects
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-400">
              No projects yet. Add the first one to replace the sample work on
              the site.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-white/10">
              {projects.slice(0, 5).map(({ row, rows }) => (
                <li key={row.id}>
                  <Link
                    href={`/admin/projects/${row.id}`}
                    className="flex items-center gap-4 py-3.5 transition hover:opacity-80"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-cream">{row.title}</p>
                      <p className="text-sm text-neutral-400">
                        {row.project_year ?? "No year"} · {rows.length}{" "}
                        {rows.length === 1 ? "row" : "rows"}
                      </p>
                    </div>
                    <span className={`${badge} ${STATUS_BADGE[row.status]}`}>
                      {row.status}
                    </span>
                    <span aria-hidden="true" className="text-neutral-500">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
