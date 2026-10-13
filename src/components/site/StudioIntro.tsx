import { studioIntro } from "@/content/site";

export function StudioIntro() {
  return (
    <section
      id={studioIntro.id}
      className="site-shell scroll-mt-[var(--header-offset)] py-[var(--space-section)]"
      aria-labelledby="studio-intro-label"
    >
      <p
        id="studio-intro-label"
        className="mb-6 text-lg font-medium tracking-wide text-blue md:text-xl"
      >
        {studioIntro.label}
      </p>
      <div className="max-w-3xl space-y-5 text-[length:var(--type-lead)] text-cream md:max-w-4xl">
        {studioIntro.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
