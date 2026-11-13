"use client";

import { useEffect, useRef, useState } from "react";

function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M11 4l7 7-7 7M18 11H4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Horizontal strip of service cards that runs off the right edge. */
export function ServicesCarousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  function step(direction: 1 | -1) {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".service-card");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }

  return (
    <div className="services-carousel">
      <div
        ref={track}
        className="services-track"
        role="list"
        aria-label="Services"
        tabIndex={0}
      >
        {children}
      </div>
      <div className="services-controls">
        <button
          type="button"
          className="services-arrow"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Previous service"
        >
          <Arrow flip />
        </button>
        <button
          type="button"
          className="services-arrow"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Next service"
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
}
