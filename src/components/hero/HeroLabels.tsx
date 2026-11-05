"use client";

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
            <span
              key={item.id}
              className={className}
              aria-label={`${item.label} (destination forthcoming)`}
            >
              {item.label}
            </span>
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
