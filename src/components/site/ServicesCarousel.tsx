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

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Horizontal strip of service cards that runs off the right edge.
 *
 * On phones, with motion on, the whole services section pins to the screen
 * while the page is scrolled: scrolling down slides the cards sideways, and the page
 * moves on only after the last card. The section is made taller by exactly
 * the distance the cards travel, so one pixel of scroll moves them one pixel.
 * Wider screens and reduced-motion visitors keep the plain swipeable strip.
 */
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

  useEffect(() => {
    const el = track.current;
    const section = el?.closest<HTMLElement>(".services-section");
    if (!el || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Phones only: on wider screens the strip stays a normal carousel.
    const phone = window.matchMedia("(max-width: 767px)");
    let travel = 0;
    let frame = 0;
    const place = () => {
      frame = 0;
      if (travel <= 0) return;
      const rect = section.getBoundingClientRect();
      el.scrollLeft = clamp(-rect.top / travel) * travel;
    };
    const measure = () => {
      section.classList.toggle("is-pinned", phone.matches);
      travel = phone.matches ? Math.max(0, el.scrollWidth - el.clientWidth) : 0;
      if (travel <= 0) {
        section.classList.remove("is-pinned");
        section.style.height = "";
        return;
      }
      section.style.height = `calc(100svh + ${travel}px)`;
      place();
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(place);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (frame) window.cancelAnimationFrame(frame);
      section.classList.remove("is-pinned");
      section.style.height = "";
    };
  }, []);

  function step(direction: 1 | -1) {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".service-card");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const distance = direction * (card.offsetWidth + gap);
    if (el.closest(".services-section.is-pinned")) {
      // Pinned: the page scroll drives the cards, so move the page.
      window.scrollBy({ top: distance, behavior: "smooth" });
    } else {
      el.scrollBy({ left: distance, behavior: "smooth" });
    }
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
