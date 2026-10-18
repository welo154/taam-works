"use client";

import { useActionState, useState } from "react";
import {
  createStudioProject,
  type CreateProjectState,
} from "@/app/admin/projects/actions";

type MediaKind = "image" | "video";

type Row =
  | { id: string; layout: "single"; kind: MediaKind }
  | { id: string; layout: "pair"; left: MediaKind; right: MediaKind };

const initialState: CreateProjectState = null;

function newId() {
  return crypto.randomUUID();
}

async function readPixelSize(file: File) {
  if (file.type.startsWith("video/")) {
    const url = URL.createObjectURL(file);
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      const size = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          video.onloadedmetadata = () =>
            resolve({ width: video.videoWidth, height: video.videoHeight });
          video.onerror = () => reject(new Error("Could not read the video size."));
          video.src = url;
        },
      );
      return size;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

function fitColumn(width: number, height: number, slot: number) {
  if (width <= slot) return { width, height };
  return {
    width: slot,
    height: Math.max(1, Math.round((height * slot) / width)),
  };
}

function SizeFields({
  name,
  onFile,
  accept,
  label,
}: {
  name: string;
  onFile: (file: File) => void;
  accept: string;
  label: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_7rem_7rem]">
      <label className="grid gap-1 text-sm">
        {label}
        <input
          className="block w-full text-sm file:mr-3 file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-neutral-100"
          type="file"
          name={`${name}-file`}
          accept={accept}
          required
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Width
        <input
          className="border border-neutral-700 bg-neutral-900 px-2 py-2"
          name={`${name}-width`}
          inputMode="decimal"
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        Height
        <input
          className="border border-neutral-700 bg-neutral-900 px-2 py-2"
          name={`${name}-height`}
          inputMode="decimal"
          required
        />
      </label>
    </div>
  );
}

export function NewProjectForm() {
  const [state, action, pending] = useActionState(createStudioProject, initialState);
  const [rows, setRows] = useState<Row[]>([]);

  function addSingle(kind: MediaKind) {
    setRows((current) => [...current, { id: newId(), layout: "single", kind }]);
  }

  function addPair() {
    setRows((current) => [
      ...current,
      { id: newId(), layout: "pair", left: "image", right: "image" },
    ]);
  }

  function fillSize(prefix: string, file: File, slot: number) {
    void readPixelSize(file)
      .then((size) => {
        const fitted = fitColumn(size.width, size.height, slot);
        const form = document.getElementById("new-project") as HTMLFormElement | null;
        const width = form?.elements.namedItem(`${prefix}-width`);
        const height = form?.elements.namedItem(`${prefix}-height`);
        if (width instanceof HTMLInputElement) width.value = String(fitted.width);
        if (height instanceof HTMLInputElement) height.value = String(fitted.height);
      })
      .catch(() => {});
  }

  return (
    <form id="new-project" action={action} className="mt-8 grid gap-8">
      {state?.error ? (
        <p className="border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <fieldset className="grid gap-4">
        <legend className="text-lg">Title</legend>
        <label className="grid gap-1 text-sm">
          English title
          <input
            className="border border-neutral-700 bg-neutral-900 px-3 py-2"
            name="titleEn"
            required
            autoComplete="off"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Arabic title
          <input
            className="border border-neutral-700 bg-neutral-900 px-3 py-2"
            name="titleAr"
            lang="ar"
            dir="rtl"
            required
            autoComplete="off"
          />
        </label>
        <label className="grid max-w-40 gap-1 text-sm">
          Year
          <input
            className="border border-neutral-700 bg-neutral-900 px-3 py-2"
            name="year"
            inputMode="numeric"
            required
            placeholder="2024"
          />
        </label>
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="text-lg">Text</legend>
        <label className="grid gap-1 text-sm">
          English paragraph
          <textarea
            className="min-h-32 border border-neutral-700 bg-neutral-900 px-3 py-2"
            name="descriptionEn"
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          Arabic paragraph
          <textarea
            className="min-h-32 border border-neutral-700 bg-neutral-900 px-3 py-2"
            name="descriptionAr"
            lang="ar"
            dir="rtl"
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          Tags
          <input
            className="border border-neutral-700 bg-neutral-900 px-3 py-2"
            name="tags"
            required
            placeholder="Branding, Exhibition"
          />
          <span className="text-neutral-500">Separate tags with commas.</span>
        </label>
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="text-lg">Works card</legend>
        <p className="text-sm text-neutral-400">
          This image is the project card on Works. The page itself uses the
          rows below.
        </p>
        <SizeFields
          name="cover"
          label="Card image"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onFile={(file) => fillSize("cover", file, 719)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="showOnHome" />
          Also show this project on the homepage
        </label>
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="text-lg">Photos and videos</legend>
        <p className="text-sm text-neutral-400">
          Rows stack in the same scrolling column as IDEA. The column is 719px
          wide. A full-width row is usually 719px wide, and a side-by-side pair
          should add up to 719. The first row sits 42px below the header line.
          Videos loop with no controls.
        </p>
        <input type="hidden" name="rowOrder" value={rows.map((row) => row.id).join(",")} />
        {rows.map((row, index) => (
          <div key={row.id} className="grid gap-3 border border-neutral-800 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-neutral-300">Row {index + 1}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="border border-neutral-700 px-2 py-1 text-xs"
                  disabled={index === 0}
                  onClick={() =>
                    setRows((current) => {
                      const next = [...current];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      return next;
                    })
                  }
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="border border-neutral-700 px-2 py-1 text-xs"
                  disabled={index === rows.length - 1}
                  onClick={() =>
                    setRows((current) => {
                      const next = [...current];
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      return next;
                    })
                  }
                >
                  Move down
                </button>
                <button
                  type="button"
                  className="border border-neutral-700 px-2 py-1 text-xs"
                  onClick={() =>
                    setRows((current) => current.filter((item) => item.id !== row.id))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
            {row.layout === "single" ? (
              <>
                <input type="hidden" name={`row-${row.id}-layout`} value="single" />
                <label className="grid max-w-48 gap-1 text-sm">
                  Type
                  <select
                    className="border border-neutral-700 bg-neutral-900 px-2 py-2"
                    name={`row-${row.id}-kind`}
                    value={row.kind}
                    onChange={(event) => {
                      const kind = event.target.value === "video" ? "video" : "image";
                      setRows((current) =>
                        current.map((item) =>
                          item.id === row.id && item.layout === "single"
                            ? { ...item, kind }
                            : item,
                        ),
                      );
                    }}
                  >
                    <option value="image">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </label>
                <SizeFields
                  name={`row-${row.id}`}
                  label={row.kind === "video" ? "Video" : "Photo"}
                  accept={
                    row.kind === "video"
                      ? "video/mp4,video/webm,video/quicktime"
                      : "image/jpeg,image/png,image/webp,image/gif"
                  }
                  onFile={(file) => fillSize(`row-${row.id}`, file, 719)}
                />
                <label className="grid gap-1 text-sm">
                  Alt text
                  <input
                    className="border border-neutral-700 bg-neutral-900 px-3 py-2"
                    name={`row-${row.id}-alt`}
                  />
                </label>
              </>
            ) : (
              <>
                <input type="hidden" name={`row-${row.id}-layout`} value="pair" />
                <PairSide
                  rowId={row.id}
                  side="left"
                  kind={row.left}
                  onKind={(kind) =>
                    setRows((current) =>
                      current.map((item) =>
                        item.id === row.id && item.layout === "pair"
                          ? { ...item, left: kind }
                          : item,
                      ),
                    )
                  }
                  onFile={(file) => fillSize(`row-${row.id}-left`, file, 360)}
                />
                <PairSide
                  rowId={row.id}
                  side="right"
                  kind={row.right}
                  onKind={(kind) =>
                    setRows((current) =>
                      current.map((item) =>
                        item.id === row.id && item.layout === "pair"
                          ? { ...item, right: kind }
                          : item,
                      ),
                    )
                  }
                  onFile={(file) => fillSize(`row-${row.id}-right`, file, 359)}
                />
              </>
            )}
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="border border-neutral-600 px-3 py-2 text-sm"
            onClick={() => addSingle("image")}
          >
            Add photo
          </button>
          <button
            type="button"
            className="border border-neutral-600 px-3 py-2 text-sm"
            onClick={() => addSingle("video")}
          >
            Add video
          </button>
          <button
            type="button"
            className="border border-neutral-600 px-3 py-2 text-sm"
            onClick={addPair}
          >
            Add side-by-side row
          </button>
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-fit bg-yellow px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "Saving…" : "Publish project"}
      </button>
    </form>
  );
}

function PairSide({
  rowId,
  side,
  kind,
  onKind,
  onFile,
}: {
  rowId: string;
  side: "left" | "right";
  kind: MediaKind;
  onKind: (kind: MediaKind) => void;
  onFile: (file: File) => void;
}) {
  const name = `row-${rowId}-${side}`;
  return (
    <div className="grid gap-3">
      <label className="grid max-w-48 gap-1 text-sm">
        {side === "left" ? "Left" : "Right"}
        <select
          className="border border-neutral-700 bg-neutral-900 px-2 py-2"
          name={`${name}-kind`}
          value={kind}
          onChange={(event) =>
            onKind(event.target.value === "video" ? "video" : "image")
          }
        >
          <option value="image">Photo</option>
          <option value="video">Video</option>
        </select>
      </label>
      <SizeFields
        name={name}
        label={kind === "video" ? "Video" : "Photo"}
        accept={
          kind === "video"
            ? "video/mp4,video/webm,video/quicktime"
            : "image/jpeg,image/png,image/webp,image/gif"
        }
        onFile={onFile}
      />
      <label className="grid gap-1 text-sm">
        Alt text
        <input
          className="border border-neutral-700 bg-neutral-900 px-3 py-2"
          name={`${name}-alt`}
        />
      </label>
    </div>
  );
}
