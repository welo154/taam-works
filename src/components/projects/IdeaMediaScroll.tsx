"use client";

import { useEffect, useRef, type ReactNode } from "react";

type IdeaMediaScrollProps = {
  children: ReactNode;
};

export function IdeaMediaScroll({ children }: IdeaMediaScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const videos = [...el.querySelectorAll("video")];
    const visible = new WeakSet<HTMLVideoElement>();
    const play = (video: HTMLVideoElement) => {
      visible.add(video);
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.preload = "auto";
      let tries = 0;
      const attempt = () => {
        if (!visible.has(video) || tries > 4) return;
        tries += 1;
        void video.play().catch(() => {
          window.setTimeout(attempt, 400);
        });
      };
      attempt();
    };

    const playback = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) play(video);
          else {
            visible.delete(video);
            video.pause();
          }
        }
      },
      { root: null, rootMargin: "240px 0px", threshold: 0.15 },
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
      el.removeEventListener("error", retryImage, true);
      playback.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="idea-media">
      {children}
    </div>
  );
}
