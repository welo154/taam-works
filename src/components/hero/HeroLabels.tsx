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

export function HeroLabels() {
  const { open } = useConsultation();

  return (
    <>
      {heroNav.map((item) => {
        const className = `hero-label ${placement[item.id]}`;

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

        return (
          <a key={item.id} href={item.href} className={className}>
            {item.label}
          </a>
        );
      })}
    </>
  );
}
