import Link from "next/link";
import type { NextProjectResult } from "@/lib/projects/next-project";

type NextProjectLinkProps = {
  next: NextProjectResult;
};

export function NextProjectLink({ next }: NextProjectLinkProps) {
  const href = next.kind === "project" ? `/works/${next.project.slug}` : "/works";
  const label = next.kind === "project" ? next.project.title : "All work";

  return (
    <section className="site-shell border-t border-cream/15 py-12 md:py-16">
      <Link
        href={href}
        className="group flex items-center justify-between gap-6"
      >
        <div>
          <p className="text-sm tracking-[0.18em] text-cream/50 uppercase">
            Next Project
          </p>
          <p className="mt-2 text-2xl text-cream md:text-3xl">{label}</p>
        </div>
        <span
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-yellow text-2xl text-bg transition-transform group-hover:translate-x-1 md:h-16 md:w-16"
          aria-hidden
        >
          →
        </span>
      </Link>
    </section>
  );
}
