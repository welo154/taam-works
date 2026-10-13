import Link from "next/link";
import type { CSSProperties } from "react";
import type { NavItem } from "@/content/site";

const colorClass: Record<NavItem["color"], string> = {
  blue: "text-blue",
  red: "text-red",
  pink: "text-pink",
  yellow: "text-yellow",
  gray: "text-gray",
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
  const className = `absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[length:var(--type-nav)] font-medium tracking-wide transition-[left,top] will-change-[left,top] ${colorClass[item.color]}`;

  const interaction = {
    onFocus: onInteractStart,
    onBlur: onInteractEnd,
    onPointerEnter: onInteractStart,
    onPointerLeave: onInteractEnd,
  };

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
