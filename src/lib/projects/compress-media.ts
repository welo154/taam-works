/** Browser-side resize/re-encode so Storage never keeps full-size originals. */

const MAX_IMAGE_EDGE = 2400;
const IMAGE_QUALITY = 0.82;
const MAX_VIDEO_EDGE = 1280;
const VIDEO_BITS_PER_SECOND = 2_500_000;
const VIDEO_FPS = 30;

export type CompressedImage = {
  blob: Blob;
  mime: "image/webp" | "image/jpeg";
  width: number;
  height: number;
};

export type CompressedVideo = {
  blob: Blob;
  mime: "video/mp4" | "video/webm";
  width: number;
  height: number;
  poster: Blob | null;
};

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
}

function scaleToMax(width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height, 1));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function pickRecorderMime(): "video/mp4" | "video/webm" | null {
  const candidates: Array<"video/mp4" | "video/webm"> = [
    "video/mp4",
    "video/webm",
  ];
  for (const mime of candidates) {
    if (
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(mime)
    ) {
      return mime;
    }
  }
  return null;
}

/** Resize and encode photos as WebP (or JPEG) — originals are not uploaded. */
export async function compressImage(file: File): Promise<CompressedImage> {
  const bitmap = await createImageBitmap(file);
  try {
    const size = scaleToMax(bitmap.width, bitmap.height, MAX_IMAGE_EDGE);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not compress this photo.");
    ctx.drawImage(bitmap, 0, 0, size.width, size.height);

    const webp = await canvasToBlob(canvas, "image/webp", IMAGE_QUALITY);
    if (webp && webp.size > 0) {
      return { blob: webp, mime: "image/webp", ...size };
    }
    const jpeg = await canvasToBlob(canvas, "image/jpeg", IMAGE_QUALITY);
    if (!jpeg || jpeg.size <= 0) {
      throw new Error("Could not compress this photo.");
    }
    return { blob: jpeg, mime: "image/jpeg", ...size };
  } finally {
    bitmap.close();
  }
}

function grabPoster(
  video: HTMLVideoElement,
  width: number,
  height: number,
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(video, 0, 0, width, height);
  return canvasToBlob(canvas, "image/jpeg", IMAGE_QUALITY);
}

/**
 * Re-encode MP4/MOV/WEBM to a capped resolution and bitrate.
 * Silent output (no audio) so cover autoplay stays reliable.
 */
export async function compressVideo(
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<CompressedVideo> {
  const mime = pickRecorderMime();
  if (!mime) {
    throw new Error("This browser cannot compress video. Try Chrome or Edge.");
  }

  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("Could not read this video."));
    });

    const size = scaleToMax(
      video.videoWidth || 1280,
      video.videoHeight || 720,
      MAX_VIDEO_EDGE,
    );

    try {
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
        video.currentTime = Math.min(0.1, (video.duration || 1) / 2);
        setTimeout(resolve, 2000);
      });
    } catch {
      /* poster frame optional */
    }
    const poster = await grabPoster(video, size.width, size.height);

    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not compress this video.");
    if (typeof canvas.captureStream !== "function") {
      throw new Error("This browser cannot compress video. Try Chrome or Edge.");
    }

    const stream = canvas.captureStream(VIDEO_FPS);
    const recorder = new MediaRecorder(stream, {
      mimeType: mime,
      videoBitsPerSecond: VIDEO_BITS_PER_SECOND,
    });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    const done = new Promise<Blob>((resolve, reject) => {
      recorder.onerror = () => reject(new Error("Video compression failed."));
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mime });
        if (blob.size <= 0) {
          reject(new Error("Video compression produced an empty file."));
          return;
        }
        resolve(blob);
      };
    });

    video.currentTime = 0;
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      setTimeout(resolve, 500);
    });

    ctx.drawImage(video, 0, 0, size.width, size.height);
    recorder.start(250);
    try {
      await video.play();
    } catch {
      throw new Error("Could not play this video for compression.");
    }

    await new Promise<void>((resolve, reject) => {
      const started = performance.now();
      const tick = () => {
        ctx.drawImage(video, 0, 0, size.width, size.height);
        const duration = video.duration || 1;
        onProgress?.(Math.min(0.99, video.currentTime / duration));
        if (video.ended) {
          resolve();
          return;
        }
        if (performance.now() - started > Math.max(60_000, duration * 4000)) {
          reject(new Error("Video compression timed out."));
          return;
        }
        requestAnimationFrame(tick);
      };
      video.onended = () => {
        ctx.drawImage(video, 0, 0, size.width, size.height);
        resolve();
      };
      video.onerror = () =>
        reject(new Error("Video playback failed while compressing."));
      requestAnimationFrame(tick);
    });

    video.pause();
    // Let the recorder flush the last canvas frames before stopping.
    await new Promise((resolve) => setTimeout(resolve, 120));
    if (recorder.state !== "inactive") recorder.stop();
    for (const track of stream.getTracks()) track.stop();

    const blob = await done;
    onProgress?.(1);
    return { blob, mime, width: size.width, height: size.height, poster };
  } finally {
    URL.revokeObjectURL(url);
  }
}
