"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createUpload, saveProject } from "@/app/admin/(panel)/projects/actions";
import {
  IMAGE_TYPES,
  LAYOUT_LABELS,
  MAX_UPLOAD_BYTES,
  VIDEO_TYPES,
  type EditorMedia,
  type EditorProject,
} from "@/lib/projects/editor-types";
import {
  btnGhost,
  btnPrimary,
  btnSmall as smallButton,
  cardPad,
  input,
  label,
} from "@/app/admin/ui";
import type { ProjectLayout } from "@/lib/projects/types";

type Slot = {
  key: string;
  name: string;
  preview: string;
  kind: "image" | "video";
  state: "uploading" | "ready" | "error";
  progress: number;
  error?: string;
  media?: EditorMedia;
};

type Row = { key: string; slots: Slot[] };

const ACCEPT = [...Object.keys(IMAGE_TYPES), ...Object.keys(VIDEO_TYPES)].join(",");

function newKey() {
  return crypto.randomUUID();
}

function slotFromMedia(media: EditorMedia): Slot {
  return {
    key: newKey(),
    name: media.path.split("/").pop() ?? "file",
    preview: media.url ?? "",
    kind: media.kind,
    state: "ready",
    progress: 1,
    media,
  };
}

async function imageSize(file: Blob) {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

/** Read a video's pixel size and grab its first frame as a JPEG poster. */
async function videoDetails(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("Could not read this video."));
      video.src = url;
    });
    const size = { width: video.videoWidth, height: video.videoHeight };
    let poster: Blob | null = null;
    try {
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
        video.currentTime = Math.min(0.1, (video.duration || 1) / 2);
        setTimeout(resolve, 2000);
      });
      const canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;
      canvas.getContext("2d")?.drawImage(video, 0, 0, size.width, size.height);
      poster = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.82),
      );
    } catch {
      poster = null;
    }
    return { ...size, poster };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function put(url: string, body: Blob, type: string, onProgress: (n: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", type);
    xhr.setRequestHeader("Cache-Control", "max-age=31536000");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error("The upload was rejected. Try again."));
    xhr.onerror = () => reject(new Error("The upload failed. Check your connection."));
    xhr.send(body);
  });
}

async function sendToStorage(
  projectId: string,
  body: Blob,
  mime: string,
  onProgress: (n: number) => void,
) {
  const ticket = await createUpload({ projectId, mime, size: body.size });
  if (!ticket.ok) throw new Error(ticket.error);
  await put(ticket.uploadUrl, body, mime, onProgress);
  return ticket.path;
}

async function uploadFile(
  projectId: string,
  file: File,
  alt: string,
  onProgress: (n: number) => void,
): Promise<EditorMedia> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("This file is larger than 50 MB.");
  }
  if (IMAGE_TYPES[file.type]) {
    const size = await imageSize(file);
    const path = await sendToStorage(projectId, file, file.type, onProgress);
    return { path, kind: "image", mime: file.type, size: file.size, alt, ...size };
  }
  if (VIDEO_TYPES[file.type]) {
    const { poster: frame, ...size } = await videoDetails(file);
    const path = await sendToStorage(projectId, file, file.type, onProgress);
    let poster: EditorMedia | null = null;
    if (frame) {
      try {
        const posterPath = await sendToStorage(projectId, frame, "image/jpeg", () => {});
        poster = {
          path: posterPath,
          kind: "image",
          mime: "image/jpeg",
          size: frame.size,
          alt,
          ...size,
        };
      } catch {
        poster = null;
      }
    }
    return { path, kind: "video", mime: file.type, size: file.size, alt, poster, ...size };
  }
  throw new Error("Use JPG, PNG, WEBP or GIF photos, and MP4, WEBM or MOV videos.");
}

const sectionTitle = "text-lg font-bold text-cream";

function Preview({ slot, className }: { slot: Slot; className: string }) {
  if (!slot.preview) return <div className={`${className} bg-neutral-800`} />;
  if (slot.kind === "video") {
    return (
      <video
        className={className}
        src={slot.preview}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={(event) => void event.currentTarget.play().catch(() => {})}
        onMouseLeave={(event) => event.currentTarget.pause()}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={slot.preview} alt="" />;
}

function SlotStatus({ slot }: { slot: Slot }) {
  if (slot.state === "uploading") {
    return (
      <div className="mt-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-yellow transition-[width] duration-200"
            style={{ width: `${Math.round(slot.progress * 100)}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Uploading {Math.round(slot.progress * 100)}%
        </p>
      </div>
    );
  }
  if (slot.state === "error") {
    return <p className="mt-1 text-xs text-red-400">{slot.error}</p>;
  }
  return (
    <p className="mt-1 text-xs text-neutral-500">
      {slot.kind === "video" ? "Video" : "Photo"}
      {slot.media ? ` · ${slot.media.width}×${slot.media.height}` : ""}
    </p>
  );
}

export function ProjectEditor({
  initial,
  migrated,
}: {
  initial: EditorProject;
  migrated: boolean;
}) {
  const router = useRouter();
  const coverInput = useRef<HTMLInputElement>(null);
  const stackInput = useRef<HTMLInputElement>(null);

  const [titleEn, setTitleEn] = useState(initial.titleEn);
  const [titleAr, setTitleAr] = useState(initial.titleAr);
  const [year, setYear] = useState(initial.year ? String(initial.year) : "");
  const [descriptionEn, setDescriptionEn] = useState(initial.descriptionEn);
  const [descriptionAr, setDescriptionAr] = useState(initial.descriptionAr);
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [cardMeta, setCardMeta] = useState(initial.cardMeta);
  const [showOnHome, setShowOnHome] = useState(initial.showOnHome);
  const [homeLayout, setHomeLayout] = useState<ProjectLayout>(initial.homeLayout);
  const [worksLayout, setWorksLayout] = useState<ProjectLayout>(initial.worksLayout);
  const [cover, setCover] = useState<Slot | null>(
    initial.cover ? slotFromMedia(initial.cover) : null,
  );
  const [rows, setRows] = useState<Row[]>(
    initial.rows.map((row) => ({ key: newKey(), slots: row.items.map(slotFromMedia) })),
  );
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const altBase = titleEn.trim() || "Project";

  function patchSlot(key: string, patch: Partial<Slot>) {
    setCover((current) => (current?.key === key ? { ...current, ...patch } : current));
    setRows((current) =>
      current.map((row) => ({
        ...row,
        slots: row.slots.map((slot) => (slot.key === key ? { ...slot, ...patch } : slot)),
      })),
    );
  }

  function startUpload(file: File): Slot {
    const slot: Slot = {
      key: newKey(),
      name: file.name,
      preview: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? "video" : "image",
      state: "uploading",
      progress: 0,
    };
    uploadFile(initial.id, file, altBase, (progress) => patchSlot(slot.key, { progress }))
      .then((media) => patchSlot(slot.key, { state: "ready", progress: 1, media }))
      .catch((reason: unknown) =>
        patchSlot(slot.key, {
          state: "error",
          error: reason instanceof Error ? reason.message : "The upload failed.",
        }),
      );
    return slot;
  }

  // Every dropped file becomes its own full-width row, in the order given.
  function addToStack(files: FileList | File[]) {
    const added = [...files].map((file) => ({ key: newKey(), slots: [startUpload(file)] }));
    if (added.length > 0) setRows((current) => [...current, ...added]);
  }

  function move(index: number, step: number) {
    setRows((current) => {
      const target = index + step;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function pairWithNext(index: number) {
    setRows((current) => {
      const a = current[index];
      const b = current[index + 1];
      if (!a || !b || a.slots.length !== 1 || b.slots.length !== 1) return current;
      const next = [...current];
      next.splice(index, 2, { key: a.key, slots: [a.slots[0], b.slots[0]] });
      return next;
    });
  }

  function split(index: number) {
    setRows((current) => {
      const row = current[index];
      if (!row || row.slots.length !== 2) return current;
      const next = [...current];
      next.splice(
        index,
        1,
        { key: row.key, slots: [row.slots[0]] },
        { key: newKey(), slots: [row.slots[1]] },
      );
      return next;
    });
  }

  function swap(index: number) {
    setRows((current) =>
      current.map((row, i) =>
        i === index && row.slots.length === 2
          ? { ...row, slots: [row.slots[1], row.slots[0]] }
          : row,
      ),
    );
  }

  function removeSlot(rowIndex: number, slotKey: string) {
    setRows((current) =>
      current.flatMap((row, i) => {
        if (i !== rowIndex) return [row];
        const slots = row.slots.filter((slot) => slot.key !== slotKey);
        return slots.length > 0 ? [{ ...row, slots }] : [];
      }),
    );
  }

  const allSlots = [...(cover ? [cover] : []), ...rows.flatMap((row) => row.slots)];
  const uploading = allSlots.some((slot) => slot.state === "uploading");
  const failed = allSlots.some((slot) => slot.state === "error");

  async function save(status: EditorProject["status"]) {
    setError("");
    if (uploading) return setError("Wait for the uploads to finish.");
    if (failed) return setError("Remove the files that failed to upload first.");
    const yearNumber = year.trim() ? Number(year) : null;
    const withAlt = (media: EditorMedia): EditorMedia => ({
      ...media,
      alt: media.alt || altBase,
    });
    setSaving(true);
    const result = await saveProject({
      id: initial.id,
      isNew: initial.isNew,
      slug: initial.slug,
      titleEn,
      titleAr,
      year: yearNumber,
      descriptionEn,
      descriptionAr,
      tags: tags.split(","),
      cardMeta,
      status,
      cover: cover?.media ? withAlt({ ...cover.media, alt: `${altBase} cover` }) : null,
      rows: rows.map((row) => ({
        items: row.slots.flatMap((slot) => (slot.media ? [withAlt(slot.media)] : [])),
      })),
      showOnHome,
      homeLayout,
      worksLayout,
    }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setSaving(false);
    if (!result.ok) return setError(result.error);
    router.push("/admin/projects");
    router.refresh();
  }

  const layouts = (Object.keys(LAYOUT_LABELS) as ProjectLayout[]).filter(
    (value) => migrated || value !== "wide",
  );

  return (
    <div className="space-y-6">
      {!migrated ? (
        <p className="rounded-2xl border border-yellow/40 bg-yellow/10 px-5 py-4 text-sm text-yellow">
          Arabic text and the Wide card size are switched off until the database
          update in <code>supabase/migrations/20261113000001_bilingual_wide.sql</code>{" "}
          is run in the Supabase SQL Editor.
        </p>
      ) : null}

      <section className={cardPad}>
        <h2 className={sectionTitle}>Details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Title (English)
          <input className={input} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </label>
        <label className={label}>
          Title (Arabic)
          <input
            className={input}
            dir="rtl"
            lang="ar"
            disabled={!migrated}
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
          />
        </label>
        <label className={label}>
          Year
          <input
            className={input}
            inputMode="numeric"
            placeholder="2026"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
        <label className={label}>
          Tags (comma separated)
          <input
            className={input}
            placeholder="Branding, Exhibition"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </label>
        <label className={label}>
          Paragraph (English)
          <textarea
            className={`${input} resize-y`}
            rows={6}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
          />
        </label>
        <label className={label}>
          Paragraph (Arabic)
          <textarea
            className={`${input} resize-y`}
            rows={6}
            dir="rtl"
            lang="ar"
            disabled={!migrated}
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
          />
        </label>
        </div>
      </section>

      <section className={cardPad}>
        <h2 className={sectionTitle}>Card</h2>
        <p className="mt-1 text-sm text-neutral-400">
          The photo or video shown for this project on the homepage and the Works page.
        </p>
        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div className="w-48">
            {cover ? (
              <>
                <Preview slot={cover} className="aspect-[4/5] w-48 rounded-xl object-cover" />
                <SlotStatus slot={cover} />
              </>
            ) : (
              <div className="flex aspect-[4/5] w-48 items-center justify-center rounded-xl border border-dashed border-white/20 text-xs text-neutral-500">
                No cover yet
              </div>
            )}
            <button
              type="button"
              className={`${smallButton} mt-2`}
              onClick={() => coverInput.current?.click()}
            >
              {cover ? "Replace cover" : "Choose cover"}
            </button>
            <input
              ref={coverInput}
              type="file"
              accept={ACCEPT}
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setCover(startUpload(file));
                event.target.value = "";
              }}
            />
          </div>
          <div className="grid flex-1 gap-5 sm:grid-cols-2">
            <label className={label}>
              Card label (optional)
              <input
                className={input}
                placeholder="Shown next to the title; the year is used if empty"
                value={cardMeta}
                onChange={(e) => setCardMeta(e.target.value)}
              />
            </label>
            <label className={label}>
              Size on the Works page
              <select
                className={input}
                value={worksLayout}
                onChange={(e) => setWorksLayout(e.target.value as ProjectLayout)}
              >
                {layouts.map((value) => (
                  <option key={value} value={value}>
                    {LAYOUT_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-200">
              <input
                type="checkbox"
                className="accent-[#f5e600]"
                checked={showOnHome}
                onChange={(e) => setShowOnHome(e.target.checked)}
              />
              Show on the homepage
            </label>
            <label className={label}>
              Size on the homepage
              <select
                className={input}
                value={homeLayout}
                disabled={!showOnHome}
                onChange={(e) => setHomeLayout(e.target.value as ProjectLayout)}
              >
                {layouts.map((value) => (
                  <option key={value} value={value}>
                    {LAYOUT_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className={cardPad}>
        <h2 className={sectionTitle}>Project page</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Drop photos and MP4s here. Each file becomes a row, stacked top to
          bottom in this order. Sizes are read from the files automatically.
        </p>

        <ol className="mt-4 space-y-3">
          {rows.map((row, index) => (
            <li
              key={row.key}
              className="flex gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-neutral-200">
                {index + 1}
              </span>
              <div className="flex flex-1 gap-3">
                {row.slots.map((slot) => (
                  <div key={slot.key} className="min-w-0 flex-1">
                    <Preview slot={slot} className="max-h-56 w-full rounded-lg object-contain" />
                    <SlotStatus slot={slot} />
                    <p className="truncate text-xs text-neutral-600">{slot.name}</p>
                    <button
                      type="button"
                      className={`${smallButton} mt-1`}
                      onClick={() => removeSlot(index, slot.key)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex w-40 flex-col gap-1.5">
                <button
                  type="button"
                  className={smallButton}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  Move up
                </button>
                <button
                  type="button"
                  className={smallButton}
                  disabled={index === rows.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Move down
                </button>
                {row.slots.length === 2 ? (
                  <>
                    <button type="button" className={smallButton} onClick={() => swap(index)}>
                      Swap sides
                    </button>
                    <button type="button" className={smallButton} onClick={() => split(index)}>
                      Split in two rows
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={smallButton}
                    disabled={rows[index + 1]?.slots.length !== 1}
                    onClick={() => pairWithNext(index)}
                  >
                    Side by side with next
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div
          className={`mt-4 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-sm transition ${
            dragging
              ? "border-yellow bg-yellow/10 text-yellow"
              : "border-white/15 text-neutral-400 hover:border-white/30"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addToStack(event.dataTransfer.files);
          }}
        >
          <p className="text-base font-bold text-cream">Drop photos and videos here</p>
          <button
            type="button"
            className={btnGhost}
            onClick={() => stackInput.current?.click()}
          >
            Choose files
          </button>
          <p className="text-xs text-neutral-600">
            JPG, PNG, WEBP, GIF, MP4, WEBM or MOV · up to 50 MB each
          </p>
          <input
            ref={stackInput}
            type="file"
            accept={ACCEPT}
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) addToStack(event.target.files);
              event.target.value = "";
            }}
          />
        </div>
      </section>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#141414]/95 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.6)] backdrop-blur">
        <button
          type="button"
          disabled={saving || uploading}
          className={btnPrimary}
          onClick={() => save("published")}
        >
          {saving ? "Saving…" : initial.status === "published" ? "Save changes" : "Publish"}
        </button>
        <button
          type="button"
          disabled={saving || uploading}
          className={btnGhost}
          onClick={() => save("draft")}
        >
          {initial.status === "published" ? "Unpublish and save as draft" : "Save draft"}
        </button>
        {uploading ? <span className="text-sm text-neutral-400">Uploading files…</span> : null}
      </div>
    </div>
  );
}
