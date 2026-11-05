"use client";

import { useEffect, useRef, useState } from "react";

export function ComingSoon() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => setVisible(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) reveal();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    el.addEventListener("coming-soon:reveal", reveal);
    return () => {
      observer.disconnect();
      el.removeEventListener("coming-soon:reveal", reveal);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="coming-soon"
      className={`coming-soon${visible ? " is-visible" : ""}`}
      aria-label="Coming soon"
      tabIndex={-1}
    >
      <p className="coming-soon-kicker">TAAM WORKS</p>
      <h2 className="coming-soon-title">Coming soon</h2>
      <p className="coming-soon-lead">
        The full studio site is on its way. Stay close.
      </p>
    </section>
  );
}
