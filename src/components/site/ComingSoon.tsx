"use client";

import { useEffect, useRef, useState } from "react";

export function ComingSoon() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`coming-soon${visible ? " is-visible" : ""}`}
      aria-label="Coming soon"
    >
      <p className="coming-soon-kicker">TAAM WORKS</p>
      <h2 className="coming-soon-title">Coming soon</h2>
      <p className="coming-soon-lead">
        The full studio site is on its way. Stay close.
      </p>
    </section>
  );
}
