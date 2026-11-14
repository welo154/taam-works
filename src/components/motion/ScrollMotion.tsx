"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide scroll motion, with no animation library:
 * - reveals every [data-reveal] element as it scrolls into view, staggering
 *   elements that arrive together;
 * - lights up [data-scroll-words] text word by word as it is scrolled through;
 * - drives the yellow reading-progress bar;
 * - makes .connect-button lean toward the pointer.
 * The hidden starting states live in globals.css under `html.motion`, a class
 * set before first paint by the inline script in the root layout.
 */

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

function splitWords(element: HTMLElement) {
  if (element.dataset.wordsReady) return;
  element.dataset.wordsReady = "1";
  const text = element.textContent ?? "";
  element.setAttribute("aria-label", text.replace(/\s+/g, " ").trim());
  element.textContent = "";
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      element.append(document.createTextNode(part));
      continue;
    }
    const word = document.createElement("span");
    word.className = "scroll-word";
    word.setAttribute("aria-hidden", "true");
    word.textContent = part;
    element.append(word);
  }
}

export function ScrollMotion() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (window as unknown as { __motionReady?: boolean }).__motionReady = true;

    // Reveal on enter.
    const watched = new Map<Element, HTMLElement[]>();
    const observer = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
        arriving.forEach((entry, index) => {
          for (const element of watched.get(entry.target) ?? []) {
            element.style.setProperty("--reveal-i", String(Math.min(index, 6)));
            element.classList.add("is-in");
          }
          watched.delete(entry.target);
          observer.unobserve(entry.target);
        });
      },
      // No bottom inset: the footer sits at the very end of the page.
      { threshold: 0.08 },
    );
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not(.is-in)",
    );
    targets.forEach((element) => {
      if (reduced) {
        element.classList.add("is-in");
        return;
      }
      // A fully clipped element never counts as "intersecting", so curtain
      // and wipe reveals are triggered by their (unclipped) parent instead.
      const clipped = ["clip", "wipe"].includes(element.dataset.reveal ?? "");
      const trigger = (clipped && element.parentElement) || element;
      watched.set(trigger, [...(watched.get(trigger) ?? []), element]);
      observer.observe(trigger);
    });

    // Word-by-word text, linked to scroll position.
    const wordBlocks = reduced
      ? []
      : [...document.querySelectorAll<HTMLElement>("[data-scroll-words]")];
    wordBlocks.forEach(splitWords);

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const scrollable = root.scrollHeight - viewport;
      if (bar.current) {
        bar.current.style.scale = `${scrollable > 0 ? clamp(window.scrollY / scrollable) : 0} 1`;
      }
      for (const block of wordBlocks) {
        const rect = block.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewport + 200) continue;
        // 0 when the block's top reaches 85% of the viewport, 1 once its
        // bottom has climbed to 45%.
        const progress = clamp(
          (viewport * 0.85 - rect.top) / (rect.height + viewport * 0.4),
        );
        const words = block.querySelectorAll<HTMLElement>(".scroll-word");
        const lit = progress * (words.length + 4);
        words.forEach((word, index) => {
          word.style.opacity = String(0.16 + 0.84 * clamp(lit - index));
        });
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Magnetic call-to-action.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (event: PointerEvent) => {
      const button = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        ".connect-button",
      );
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      button.style.translate = `${(x * 18).toFixed(1)}px ${(y * 12).toFixed(1)}px`;
    };
    const onOut = (event: PointerEvent) => {
      const button = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        ".connect-button",
      );
      if (button && !button.contains(event.relatedTarget as Node | null)) {
        button.style.translate = "";
      }
    };
    if (fine && !reduced) {
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onOut, { passive: true });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
