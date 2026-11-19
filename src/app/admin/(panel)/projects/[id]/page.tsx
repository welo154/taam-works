import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/app/admin/(panel)/projects/ProjectEditor";
import {
  comingSoonColumnApplied,
  loadProjects,
  migrationApplied,
  type AssetRow,
} from "@/lib/projects/db";
import type { EditorMedia, EditorRow } from "@/lib/projects/editor-types";
import { publicMediaUrl } from "@/lib/supabase/rest";

export const metadata: Metadata = { title: "Edit project" };
export const dynamic = "force-dynamic";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toEditorMedia(
  asset: AssetRow,
  all: Map<string, AssetRow>,
): EditorMedia {
  const poster = asset.poster_asset_id ? all.get(asset.poster_asset_id) : null;
  return {
    assetId: asset.id,
    path: asset.object_path,
    kind: asset.kind,
    mime: asset.mime_type,
    size: asset.byte_size,
    width: asset.width ?? 1600,
    height: asset.height ?? 1000,
    alt: asset.alt_text,
    poster: poster ? toEditorMedia(poster, new Map()) : null,
    url: publicMediaUrl(asset.object_path, asset.bucket),
  };
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [[loaded], migrated, comingSoonReady] = await Promise.all([
    loadProjects(`id=eq.${id}`),
    migrationApplied(),
    comingSoonColumnApplied(),
  ]);
  if (!loaded) notFound();

  const { row, assets, rows } = loaded;
  const cover = row.cover_asset_id ? assets.get(row.cover_asset_id) : null;
  const stack: EditorRow[] = [];
  for (const item of rows) {
    const primary = assets.get(item.primary_asset_id);
    if (!primary) continue;
    const secondary = item.secondary_asset_id
      ? assets.get(item.secondary_asset_id)
      : null;
    stack.push({
      items: secondary
        ? [toEditorMedia(primary, assets), toEditorMedia(secondary, assets)]
        : [toEditorMedia(primary, assets)],
    });
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-sm text-neutral-400 transition hover:text-cream"
      >
        ← Projects
      </Link>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        Edit project
      </p>
      <h1 className="mb-8 mt-2 text-3xl font-bold tracking-tight text-cream md:text-4xl">
        {row.title}
      </h1>
      <ProjectEditor
        migrated={migrated}
        comingSoonReady={comingSoonReady}
        initial={{
          id: row.id,
          isNew: false,
          slug: row.slug,
          titleEn: row.title,
          titleAr: row.title_ar ?? "",
          year: row.project_year,
          descriptionEn: row.description ?? "",
          descriptionAr: row.description_ar ?? "",
          tags: row.tags ?? [],
          cardMeta: row.card_meta ?? "",
          status: row.status,
          cover: cover ? toEditorMedia(cover, assets) : null,
          rows: stack,
          comingSoon: Boolean(row.coming_soon) || stack.length === 0,
          showOnHome: row.show_on_home,
          homeLayout: row.home_layout,
          worksLayout: row.works_layout,
        }}
      />
    </div>
  );
}
