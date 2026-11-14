"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Overview", icon: "M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z" },
  { href: "/admin/projects", label: "Projects", icon: "M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" },
  { href: "/admin/requests", label: "Requests", icon: "M4 6h16v10H8l-4 4V6Z" },
];

export function AdminNav({ newRequests }: { newRequests: number }) {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Dashboard">
      {items.map((item) => {
        const on = active(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={on ? "page" : undefined}
            className={`group flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
              on
                ? "bg-yellow font-bold text-black"
                : "text-neutral-300 hover:bg-white/5 hover:text-cream"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d={item.icon} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span>{item.label}</span>
            {item.href === "/admin/requests" && newRequests > 0 ? (
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  on ? "bg-black text-yellow" : "bg-yellow text-black"
                }`}
              >
                {newRequests}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
