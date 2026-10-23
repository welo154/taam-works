"use client";

import { useLayoutEffect, useRef } from "react";
import type { ServiceItem } from "@/content/site";

type ServiceCopyProps = {
  intro: string;
  items: readonly ServiceItem[];
};

const visibleFeatures = 2;

export function ServiceCopy({ intro, items }: ServiceCopyProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const features = el.querySelectorAll<HTMLElement>(".service-feature");
      const last = features[Math.min(visibleFeatures, features.length) - 1];
      if (!last) {
        el.style.height = "auto";
        return;
      }
      const height = `${last.offsetTop + last.offsetHeight}px`;
      if (el.style.height !== height) el.style.height = height;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    document.fonts.ready.then(fit).catch(() => {});
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [intro, items]);

  return (
    <div ref={ref} className="service-copy service-scroll">
      <p className="service-intro">{intro}</p>
      <ul className="service-features">
        {items.map((item) => (
          <li key={item.title} className="service-feature">
            <h4 className="service-feature-title">{item.title}</h4>
            <p className="service-feature-body">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
