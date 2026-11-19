import type { MediaKind, ProjectLayout } from "@/lib/projects/types";

/** One uploaded file as the dashboard editor tracks it. */
export type EditorMedia = {
  /** Set once the file is recorded in the database. */
  assetId?: string;
  path: string;
  kind: MediaKind;
  mime: string;
  size: number;
  width: number;
  height: number;
  alt: string;
  /** First frame of a video, shown while it loads. */
  poster?: EditorMedia | null;
  /** Public URL, for previews of saved files. */
  url?: string;
};

/** One band of the project page: a full-width item or two side by side. */
export type EditorRow = { items: EditorMedia[] };

export type EditorProject = {
  id: string;
  isNew: boolean;
  slug: string;
  titleEn: string;
  titleAr: string;
  year: number | null;
  descriptionEn: string;
  descriptionAr: string;
  tags: string[];
  cardMeta: string;
  status: "draft" | "published" | "archived";
  cover: EditorMedia | null;
  rows: EditorRow[];
  /** Cover-only project page until the media stack is ready. */
  comingSoon: boolean;
  showOnHome: boolean;
  homeLayout: ProjectLayout;
  worksLayout: ProjectLayout;
};

export type SaveResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

export type UploadTicket =
  | { ok: true; uploadUrl: string; path: string }
  | { ok: false; error: string };

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

/** Supabase Storage limit for this bucket. */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export const LAYOUT_LABELS: Record<ProjectLayout, string> = {
  third: "Small (one third)",
  half: "Medium (half)",
  wide: "Wide (two thirds)",
  full: "Full width",
};
