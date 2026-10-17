"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useConsultation } from "@/components/consultation/ConsultationContext";
import type { NavItem } from "@/content/site";

const colorClass: Record<NavItem["color"], string> = {
  blue: "bg-blue",
  red: "bg-red",
  pink: "bg-pink",
  yellow: "bg-yellow",
  gray: "bg-gray",
};

type HeroBadgeProps = {
  item: NavItem;
  style?: CSSProperties;
  onInteractStart?: () => void;
  onInteractEnd?: () => void;
};

export function HeroBadge({
  item,
  style,
  onInteractStart,
  onInteractEnd,
}: HeroBadgeProps) {
  const className = `absolute flex h-[clamp(2.25rem,4.2vw,3.6875rem)] items-center justify-center rounded-[var(--radius-cta)] px-[clamp(0.9rem,2vw,1.5rem)] text-[length:var(--type-nav)] leading-none tracking-[var(--tracking-nav)] text-black whitespace-nowrap transition-[left,top] will-change-[left,top] ${colorClass[item.color]}`;

  const interaction = {
    onFocus: onInteractStart,
    onBlur: onInteractEnd,
    onPointerEnter: onInteractStart,
    onPointerLeave: onInteractEnd,
  };

  const consultation = useConsultation();

  if (item.opensConsultation) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={consultation.open}
        {...interaction}
      >
        {item.label}
      </button>
    );
  }

  if (!item.href) {
    return (
      <span
        className={`${className} cursor-default`}
        style={style}
        aria-label={`${item.label} (destination forthcoming)`}
        {...interaction}
      >
        {item.label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      style={style}
      {...interaction}
    >
      {item.label}
    </Link>
  );
}
