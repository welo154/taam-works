"use server";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import {
  fixtureSlugs,
  nextOrders,
  readStudioProjects,
  writeStudioProjects,
  type StudioAsset,
  type StudioProject,
  type StudioRow,
} from "@/lib/projects/studio-store";

export type CreateProjectState = { error?: string } | null;

const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const VIDEO_TYPES = new Map([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
  ["video/quicktime", "mov"],
]);

const MAX_FILE_BYTES = 80 * 1024 * 1024;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function displaySize(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  if (!Number.isFinite(value) || value <= 0 || value > 8000) return null;
  return Math.round(value * 1000) / 1000;
}

function slugify(title: string) {
  const base = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "project";
}

function fileOf(formData: FormData, key: string) {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

async function saveAsset(
  file: File,
  directory: string,
  publicDirectory: string,
  kind: "image" | "video",
  alt: string,
  width: number,
  height: number,
): Promise<StudioAsset> {
  const types = kind === "image" ? IMAGE_TYPES : VIDEO_TYPES;
  const extension = types.get(file.type);
  if (!extension) {
    throw new Error(
      kind === "image"
        ? "Photos must be JPG, PNG, WEBP, or GIF."
        : "Videos must be MP4, WEBM, or MOV.",
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Each file must be 80MB or smaller.");
  }
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(
    path.join(/*turbopackIgnore: true*/ directory, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  return {
    kind,
    src: `${publicDirectory}/${filename}`,
    alt,
    width,
    height,
  };
}

function kindOf(value: string): "image" | "video" | null {
  if (value === "image" || value === "video") return value;
  return null;
}

export async function createStudioProject(
  _previous: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const titleEn = text(formData, "titleEn");
  const titleAr = text(formData, "titleAr");
  const descriptionEn = text(formData, "descriptionEn");
  const descriptionAr = text(formData, "descriptionAr");
  const year = Number(text(formData, "year"));
  const tags = text(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const showOnHome = formData.get("showOnHome") === "on";
  const rowIds = text(formData, "rowOrder")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!titleEn) return { error: "Enter the English title." };
  if (!titleAr) return { error: "Enter the Arabic title." };
  if (!Number.isInteger(year) || year < 1990 || year > 2100) {
    return { error: "Enter a project year between 1990 and 2100." };
  }
  if (!descriptionEn) return { error: "Enter the English paragraph." };
  if (!descriptionAr) return { error: "Enter the Arabic paragraph." };
  if (tags.length === 0) return { error: "Enter at least one tag." };
  if (rowIds.length === 0) return { error: "Add at least one photo or video row." };

  const coverFile = fileOf(formData, "cover-file");
  const coverWidth = displaySize(formData, "cover-width");
  const coverHeight = displaySize(formData, "cover-height");
  if (!coverFile || !coverWidth || !coverHeight) {
    return { error: "Add a Works card image with its display width and height." };
  }
  if (!IMAGE_TYPES.has(coverFile.type)) {
    return { error: "The Works card must be a JPG, PNG, WEBP, or GIF." };
  }

  const existing = await readStudioProjects();
  const taken = new Set([
    ...fixtureSlugs(),
    ...existing.map((project) => project.slug),
  ]);
  let slug = slugify(titleEn);
  if (slug === "idea") slug = "idea-project";
  let suffix = 2;
  const base = slug;
  while (taken.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  type Planned =
    | {
        id: string;
        layout: "single";
        kind: "image" | "video";
        file: File;
        alt: string;
        width: number;
        height: number;
      }
    | {
        id: string;
        layout: "pair";
        left: {
          kind: "image" | "video";
          file: File;
          alt: string;
          width: number;
          height: number;
        };
        right: {
          kind: "image" | "video";
          file: File;
          alt: string;
          width: number;
          height: number;
        };
      };

  const planned: Planned[] = [];
  for (const id of rowIds) {
    const layout = text(formData, `row-${id}-layout`);
    if (layout === "single") {
      const kind = kindOf(text(formData, `row-${id}-kind`));
      const width = displaySize(formData, `row-${id}-width`);
      const height = displaySize(formData, `row-${id}-height`);
      const file = fileOf(formData, `row-${id}-file`);
      if (!kind || !width || !height || !file) {
        return { error: "Each media row needs a file, a width, and a height." };
      }
      planned.push({
        id,
        layout: "single",
        kind,
        file,
        alt: text(formData, `row-${id}-alt`) || titleEn,
        width,
        height,
      });
      continue;
    }
    if (layout !== "pair") return { error: "A media row is missing its layout." };
    const leftKind = kindOf(text(formData, `row-${id}-left-kind`));
    const rightKind = kindOf(text(formData, `row-${id}-right-kind`));
    const leftWidth = displaySize(formData, `row-${id}-left-width`);
    const leftHeight = displaySize(formData, `row-${id}-left-height`);
    const rightWidth = displaySize(formData, `row-${id}-right-width`);
    const rightHeight = displaySize(formData, `row-${id}-right-height`);
    const leftFile = fileOf(formData, `row-${id}-left-file`);
    const rightFile = fileOf(formData, `row-${id}-right-file`);
    if (
      !leftKind ||
      !rightKind ||
      !leftWidth ||
      !leftHeight ||
      !rightWidth ||
      !rightHeight ||
      !leftFile ||
      !rightFile
    ) {
      return { error: "A side-by-side row needs both files and both sizes." };
    }
    planned.push({
      id,
      layout: "pair",
      left: {
        kind: leftKind,
        file: leftFile,
        alt: text(formData, `row-${id}-left-alt`) || titleEn,
        width: leftWidth,
        height: leftHeight,
      },
      right: {
        kind: rightKind,
        file: rightFile,
        alt: text(formData, `row-${id}-right-alt`) || titleEn,
        width: rightWidth,
        height: rightHeight,
      },
    });
  }

  const directory = path.join(process.cwd(), "public", "uploads", "projects", slug);
  const publicDirectory = `/uploads/projects/${slug}`;
  await mkdir(directory, { recursive: true });

  try {
    const cover = await saveAsset(
      coverFile,
      directory,
      publicDirectory,
      "image",
      `${titleEn} cover`,
      coverWidth,
      coverHeight,
    );
    const rows: StudioRow[] = [];
    for (const item of planned) {
      if (item.layout === "single") {
        rows.push({
          id: item.id,
          layout: "single",
          asset: await saveAsset(
            item.file,
            directory,
            publicDirectory,
            item.kind,
            item.alt,
            item.width,
            item.height,
          ),
        });
        continue;
      }
      rows.push({
        id: item.id,
        layout: "pair",
        left: await saveAsset(
          item.left.file,
          directory,
          publicDirectory,
          item.left.kind,
          item.left.alt,
          item.left.width,
          item.left.height,
        ),
        right: await saveAsset(
          item.right.file,
          directory,
          publicDirectory,
          item.right.kind,
          item.right.alt,
          item.right.width,
          item.right.height,
        ),
      });
    }

    const orders = await nextOrders();
    const project: StudioProject = {
      id: randomUUID(),
      slug,
      titleEn,
      titleAr,
      year,
      descriptionEn,
      descriptionAr,
      tags,
      cover,
      rows,
      showOnHome,
      worksOrder: orders.worksOrder,
      homeOrder: showOnHome ? orders.homeOrder : 0,
      createdAt: new Date().toISOString(),
    };
    await writeStudioProjects([...existing, project]);
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    return {
      error:
        error instanceof Error
          ? error.message
          : "The project could not be saved.",
    };
  }

  redirect(`/works/${slug}`);
}
