"use client";

import { useEffect, useState } from "react";
import { useConsultation } from "@/components/consultation/ConsultationContext";
import { heroNav, type NavItem } from "@/content/site";

const placement: Record<NavItem["id"], string> = {
  services: "hero-label-services",
  works: "hero-label-works",
  contact: "hero-label-contact",
  initiatives: "hero-label-initiatives",
  about: "hero-label-about",
};

type HeroLabelsProps = {
  /** Coming-soon gate: keep the pills visual, remove destinations. */
  locked?: boolean;
};

const SOON_MS = 2200;

/** A pill with no destination yet: pressing it answers "COMING SOON". */
function SoonLabel({ label, className }: { label: string; className: string }) {
  const [soon, setSoon] = useState(false);

  useEffect(() => {
    if (!soon) return;
    const timer = window.setTimeout(() => setSoon(false), SOON_MS);
    return () => window.clearTimeout(timer);
  }, [soon]);

  return (
    <button
      type="button"
      className={`${className}${soon ? " is-soon" : ""}`}
      aria-label={`${label} — coming soon`}
      onClick={(event) => {
        // Hold the pill at its current width while the text changes.
        event.currentTarget.style.width = `${event.currentTarget.offsetWidth}px`;
        setSoon(true);
      }}
    >
      <span key={soon ? "soon" : "label"} className="hero-label-text">
        {soon ? "COMING SOON" : label}
      </span>
      <span className="sr-only" role="status">
        {soon ? "Coming soon" : ""}
      </span>
    </button>
  );
}

function showComingSoon() {
  const target = document.getElementById("coming-soon");
  if (!target) return;
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "center",
  });
  target.dispatchEvent(new Event("coming-soon:reveal"));
}

export function HeroLabels({ locked = false }: HeroLabelsProps) {
  const { open } = useConsultation();

  return (
    <>
      {heroNav.map((item) => {
        const className = `hero-label ${placement[item.id]}`;

        if (locked) {
          return (
            <button
              key={item.id}
              type="button"
              className={className}
              onClick={showComingSoon}
              aria-label={`${item.label} — Coming soon`}
            >
              {item.label}
            </button>
          );
        }

        if (!item.href) {
          return (
            <SoonLabel key={item.id} label={item.label} className={className} />
          );
        }

        if (item.opensConsultation) {
          return (
            <button
              key={item.id}
              type="button"
              className={className}
              onClick={open}
            >
              {item.label}
            </button>
          );
        }

        return (
          <a key={item.id} href={item.href} className={className}>
            {item.label}
          </a>
        );
      })}
    </>
  );
}
