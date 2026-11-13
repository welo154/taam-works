"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { fixtureProjects } from "@/content/fixtures/projects";
import { isAdminAuthorized } from "@/lib/admin-auth";
import {
  loadProjects,
  migrationApplied,
  type AssetRow,
  type ProjectRow,
} from "@/lib/projects/db";
import {
  IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  VIDEO_TYPES,
  type EditorMedia,
  type EditorProject,
  type SaveResult,
  type UploadTicket,
} from "@/lib/projects/editor-types";
import type { ProjectLayout } from "@/lib/projects/types";
import {
  createSignedUpload,
  db,
  dbDelete,
  dbInsert,
  dbUpdate,
  MEDIA_BUCKET,
  removeStorageObjects,
} from "@/lib/supabase/rest";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LAYOUTS: ProjectLayout[] = ["third", "half", "wide", "full"];
const RESERVED_SLUGS = new Set(["idea", "new"]);
const SIGNED_OUT = "You are not signed in to the dashboard.";

// Server Actions are reachable by direct POST from any route, so every one
// re-checks the dashboard login instead of trusting the /admin proxy check.
async function isAdmin() {
  const requestHeaders = await headers();
  return isAdminAuthorized(requestHeaders.get("authorization"));
}

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error(SIGNED_OUT);
}

function message(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function slugify(title: string) {
  const base = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "project";
}

/** Step 1 of an upload: the browser asks for a one-time Storage URL. */
export async function createUpload(input: {
  projectId: string;
  mime: string;
  size: number;
}): Promise<UploadTicket> {
  if (!(await isAdmin())) return { ok: false, error: SIGNED_OUT };
  if (!UUID.test(input.projectId)) return { ok: false, error: "Unknown project." };
  const extension = IMAGE_TYPES[input.mime] ?? VIDEO_TYPES[input.mime];
  if (!extension) {
    return {
      ok: false,
      error: "Use JPG, PNG, WEBP or GIF photos, and MP4, WEBM or MOV videos.",
    };
  }
  if (
    !Number.isFinite(input.size) ||
    input.size <= 0 ||
    input.size > MAX_UPLOAD_BYTES
  ) {
    return { ok: false, error: "Each file must be 50 MB or smaller." };
  }
  const path = `projects/${input.projectId}/${randomUUID()}.${extension}`;
  try {
    return { ok: true, uploadUrl: await createSignedUpload(path), path };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

function checkMedia(media: EditorMedia, projectId: string): string | null {
  if (!media.assetId && !media.path.startsWith(`projects/${projectId}/`)) {
    return "A file does not belong to this project.";
  }
  if (!IMAGE_TYPES[media.mime] && !VIDEO_TYPES[media.mime]) {
    return "A file has an unsupported type.";
  }
  if (!(media.width > 0) || !(media.height > 0)) {
    return "A file is missing its size. Remove it and upload it again.";
  }
  return null;
}

export async function saveProject(input: EditorProject): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, error: SIGNED_OUT };
  try {
    return await saveProjectUnsafe(input);
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

async function saveProjectUnsafe(input: EditorProject): Promise<SaveResult> {
  const id = input.id;
  if (!UUID.test(id)) return { ok: false, error: "Unknown project." };

  const titleEn = input.titleEn.trim();
  const year = input.year;
  const tags = input.tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
  if (!titleEn) return { ok: false, error: "Enter the English title." };
  if (year !== null && (!Number.isInteger(year) || year < 1990 || year > 2100)) {
    return { ok: false, error: "Enter a project year between 1990 and 2100." };
  }
  if (!["draft", "published", "archived"].includes(input.status)) {
    return { ok: false, error: "Unknown status." };
  }
  if (input.status === "published" && !input.cover) {
    return { ok: false, error: "Add a cover before publishing." };
  }
  if (!LAYOUTS.includes(input.homeLayout) || !LAYOUTS.includes(input.worksLayout)) {
    return { ok: false, error: "Unknown card size." };
  }

  const everyMedia: EditorMedia[] = [];
  if (input.cover) everyMedia.push(input.cover);
  for (const row of input.rows) {
    if (row.items.length < 1 || row.items.length > 2) {
      return { ok: false, error: "A row holds one or two files." };
    }
    everyMedia.push(...row.items);
  }
  for (const media of everyMedia) {
    const problem =
      checkMedia(media, id) ?? (media.poster ? checkMedia(media.poster, id) : null);
    if (problem) return { ok: false, error: problem };
  }

  const migrated = await migrationApplied();
  const layout = (value: ProjectLayout): ProjectLayout =>
    value === "wide" && !migrated ? "half" : value;

  const [existing] = await loadProjects(`id=eq.${id}`);
  const fields: Record<string, unknown> = {
    title: titleEn,
    project_year: year,
    description: input.descriptionEn.trim(),
    tags,
    card_meta: input.cardMeta.trim() || null,
    show_on_home: input.showOnHome,
    home_layout: layout(input.homeLayout),
    works_layout: layout(input.worksLayout),
  };
  if (migrated) {
    fields.title_ar = input.titleAr.trim();
    fields.description_ar = input.descriptionAr.trim();
  }

  let slug: string;
  if (existing) {
    slug = existing.row.slug;
    await dbUpdate(`projects?id=eq.${id}`, fields);
  } else {
    const others = await db<
      Pick<ProjectRow, "slug" | "works_order" | "home_order">[]
    >("projects?select=slug,works_order,home_order");
    const taken = new Set([
      ...RESERVED_SLUGS,
      ...fixtureProjects.map((project) => project.slug),
      ...others.map((project) => project.slug),
    ]);
    const base = slugify(titleEn);
    slug = base;
    for (let suffix = 2; taken.has(slug); suffix += 1) slug = `${base}-${suffix}`;
    await dbInsert("projects", {
      id,
      slug,
      status: "draft",
      works_order: Math.max(0, ...others.map((p) => p.works_order)) + 1,
      home_order: Math.max(0, ...others.map((p) => p.home_order)) + 1,
      ...fields,
    });
  }

  // Record new files; keep the ones already recorded.
  const known = existing?.assets ?? new Map<string, AssetRow>();
  const used = new Set<string>();

  async function ensureAsset(media: EditorMedia, posterId: string | null) {
    if (media.assetId && known.has(media.assetId)) {
      const current = known.get(media.assetId)!;
      if (current.alt_text !== media.alt || current.poster_asset_id !== posterId) {
        await dbUpdate(`media_assets?id=eq.${media.assetId}`, {
          alt_text: media.alt,
          poster_asset_id: posterId,
        });
      }
      used.add(media.assetId);
      return media.assetId;
    }
    const [created] = await dbInsert<AssetRow>("media_assets", {
      project_id: id,
      bucket: MEDIA_BUCKET,
      object_path: media.path,
      kind: IMAGE_TYPES[media.mime] ? "image" : "video",
      mime_type: media.mime,
      byte_size: Math.round(media.size),
      width: Math.round(media.width),
      height: Math.round(media.height),
      alt_text: media.alt,
      poster_asset_id: posterId,
      upload_state: "ready",
      delivery_ready: true,
    });
    used.add(created.id);
    return created.id;
  }

  async function ensureWithPoster(media: EditorMedia) {
    const posterId = media.poster ? await ensureAsset(media.poster, null) : null;
    return ensureAsset(media, posterId);
  }

  const coverId = input.cover ? await ensureWithPoster(input.cover) : null;
  const stack: object[] = [];
  for (const [position, row] of input.rows.entries()) {
    const primary = await ensureWithPoster(row.items[0]);
    const secondary = row.items[1] ? await ensureWithPoster(row.items[1]) : null;
    stack.push({
      project_id: id,
      position,
      layout: secondary ? "pair" : "single",
      primary_asset_id: primary,
      secondary_asset_id: secondary,
    });
  }

  await dbDelete(`project_media?project_id=eq.${id}`);
  if (stack.length > 0) await dbInsert("project_media", stack);
  await dbUpdate(`projects?id=eq.${id}`, {
    cover_asset_id: coverId,
    status: input.status,
  });

  // Drop files that are no longer on the page.
  const orphans = [...known.values()].filter((asset) => !used.has(asset.id));
  if (orphans.length > 0) {
    const orphanIds = `in.(${orphans.map((asset) => `"${asset.id}"`).join(",")})`;
    // The database refuses to delete a file that is still some video's poster.
    await dbUpdate(`media_assets?id=${orphanIds}`, { poster_asset_id: null });
    await dbDelete(
      `media_assets?id=${orphanIds}`,
    );
    await removeStorageObjects(orphans.map((asset) => asset.object_path)).catch(
      () => undefined,
    );
  }

  revalidatePath("/admin/projects");
  return { ok: true, id, slug };
}

function formId(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Unknown project.");
  return id;
}

export async function updatePlacement(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const migrated = await migrationApplied();
  const pick = (key: string): ProjectLayout => {
    const value = String(formData.get(key) ?? "third") as ProjectLayout;
    if (!LAYOUTS.includes(value)) return "third";
    return value === "wide" && !migrated ? "half" : value;
  };
  await dbUpdate(`projects?id=eq.${id}`, {
    show_on_home: formData.get("showOnHome") === "on",
    home_layout: pick("homeLayout"),
    works_layout: pick("worksLayout"),
  });
  revalidatePath("/admin/projects");
}

export async function moveProject(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const list = formData.get("list") === "home" ? "home" : "works";
  const step = formData.get("direction") === "up" ? -1 : 1;
  const column = list === "home" ? "home_order" : "works_order";
  const filter = list === "home" ? "&show_on_home=eq.true" : "";
  const ordered = await db<{ id: string }[]>(
    `projects?select=id&status=neq.archived${filter}&order=${column}.asc,created_at.asc`,
  );
  const from = ordered.findIndex((project) => project.id === id);
  const to = from + step;
  if (from === -1 || to < 0 || to >= ordered.length) return;
  [ordered[from], ordered[to]] = [ordered[to], ordered[from]];
  await Promise.all(
    ordered.map((project, index) =>
      dbUpdate(`projects?id=eq.${project.id}`, { [column]: index + 1 }),
    ),
  );
  revalidatePath("/admin/projects");
}

export async function setStatus(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const status = String(formData.get("status") ?? "");
  if (!["draft", "published", "archived"].includes(status)) return;
  if (status === "published") {
    const [project] = await db<Pick<ProjectRow, "cover_asset_id">[]>(
      `projects?select=cover_asset_id&id=eq.${id}`,
    );
    if (!project?.cover_asset_id) return;
  }
  await dbUpdate(`projects?id=eq.${id}`, { status });
  revalidatePath("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const assets = await db<Pick<AssetRow, "object_path">[]>(
    `media_assets?select=object_path&project_id=eq.${id}`,
  );
  await dbUpdate(`projects?id=eq.${id}`, { cover_asset_id: null });
  await dbDelete(`project_media?project_id=eq.${id}`);
  // The database refuses to delete a file that is still some video's poster.
  await dbUpdate(`media_assets?project_id=eq.${id}`, { poster_asset_id: null });
  await dbDelete(`media_assets?project_id=eq.${id}`);
  await dbDelete(`projects?id=eq.${id}`);
  await removeStorageObjects(assets.map((asset) => asset.object_path)).catch(
    () => undefined,
  );
  revalidatePath("/admin/projects");
}
