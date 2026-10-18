"use client";

import { useEffect, useRef, type ReactNode } from "react";

type IdeaMediaScrollProps = {
  children: ReactNode;
};

function wheelDelta(event: WheelEvent, viewport: number) {
  if (event.deltaMode === 1) return event.deltaY * 32;
  if (event.deltaMode === 2) return event.deltaY * viewport;
  return event.deltaY;
}

export function IdeaMediaScroll({ children }: IdeaMediaScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = el.scrollTop;
    let frame = 0;

    const maxScroll = () => Math.max(0, el.scrollHeight - el.clientHeight);

    const settle = () => {
      target = Math.min(maxScroll(), Math.max(0, target));
      const delta = target - el.scrollTop;
      if (Math.abs(delta) < 0.5) {
        el.scrollTop = target;
        return;
      }
      el.scrollTop += delta * 0.16;
      frame = requestAnimationFrame(settle);
    };

    const onWheel = (event: WheelEvent) => {
      const max = maxScroll();
      const next = Math.min(
        max,
        Math.max(0, target + wheelDelta(event, el.clientHeight)),
      );
      const atEdge =
        (event.deltaY < 0 && target <= 0) ||
        (event.deltaY > 0 && target >= max - 0.5);
      if (atEdge && next === target) return;

      event.preventDefault();
      target = next;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(settle);
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    const videos = [...el.querySelectorAll("video")];
    const playback = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (!entry.isIntersecting) continue;
          video.preload = "auto";
          void video.play().catch(() => {});
        }
      },
      { root: el, rootMargin: "240px 0px", threshold: 0.01 },
    );
    for (const video of videos) playback.observe(video);

    const retryImage = (event: Event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.retried) return;
      img.dataset.retried = "1";
      const src = img.currentSrc || img.src;
      img.src = src;
    };
    el.addEventListener("error", retryImage, true);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("error", retryImage, true);
      playback.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="idea-media">
      {children}
    </div>
  );
}
