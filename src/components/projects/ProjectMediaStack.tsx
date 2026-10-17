import { ProjectImage } from "@/components/projects/ProjectImage";
import type { ProjectMediaRow } from "@/lib/projects/types";

type ProjectMediaStackProps = {
  media: ProjectMediaRow[];
};

export function ProjectMediaStack({ media }: ProjectMediaStackProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {media.map((row) => {
        if (row.layout === "pair") {
          return (
            <figure key={row.id} className="grid grid-cols-2 gap-3 md:gap-4">
              <ProjectImage
                src={row.primary.src}
                alt={row.primary.alt}
                width={row.primary.width}
                height={row.primary.height}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 50vw, 29vw"
              />
              <ProjectImage
                src={row.secondary.src}
                alt={row.secondary.alt}
                width={row.secondary.width}
                height={row.secondary.height}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 50vw, 29vw"
              />
              {row.caption ? (
                <figcaption className="col-span-2 text-sm text-cream/50">
                  {row.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (row.primary.kind === "video") {
          return (
            <figure key={row.id}>
              <video
                className="h-auto w-full bg-cream/5"
                controls
                playsInline
                poster={row.primary.posterSrc ?? row.primary.src}
                width={row.primary.width}
                height={row.primary.height}
              >
                {/* Fixture uses poster SVG as src stand-in until real video exports exist */}
                <source src={row.primary.src} />
              </video>
              <p className="mt-2 text-xs text-cream/40">
                Temporary video placeholder — replace with original project video.
              </p>
              {row.caption ? (
                <figcaption className="mt-2 text-sm text-cream/50">
                  {row.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <figure key={row.id}>
            <ProjectImage
              src={row.primary.src}
              alt={row.primary.alt}
              width={row.primary.width}
              height={row.primary.height}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            {row.caption ? (
              <figcaption className="mt-2 text-sm text-cream/50">
                {row.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
