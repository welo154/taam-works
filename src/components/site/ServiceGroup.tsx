import { serviceGroups } from "@/content/site";

export function ServiceGroups() {
  return (
    <section
      id="services"
      className="site-shell scroll-mt-[var(--header-offset)] py-[var(--space-section)]"
      aria-labelledby="services-heading"
    >
      <h2 id="services-heading" className="sr-only">
        Services
      </h2>
      <div className="flex flex-col gap-14 md:gap-20">
        {serviceGroups.map((group) => (
          <article
            key={group.number}
            className="grid gap-4 md:grid-cols-[minmax(8rem,14rem)_1fr] md:gap-10"
          >
            <div>
              <p className="text-sm tracking-[0.18em] text-pink md:text-base">
                {group.number}
              </p>
              <h3 className="mt-2 text-2xl text-pink md:text-3xl">
                {group.title}
              </h3>
            </div>
            <ul className="space-y-2 text-[length:var(--type-lead)] text-cream">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
