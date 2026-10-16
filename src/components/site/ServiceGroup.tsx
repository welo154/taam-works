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
      <div className="flex flex-col gap-16 md:gap-24">
        {serviceGroups.map((group) => (
          <article
            key={group.number}
            className="grid items-start gap-8 md:grid-cols-[minmax(12rem,15rem)_minmax(0,44.875rem)] md:justify-center md:gap-10"
          >
            <div className="w-[min(100%,14.75rem)] bg-pink px-3 py-2 text-[length:var(--type-service-num)] leading-[0.9] tracking-[-0.08em] text-black">
              {group.titleLines ? (
                <>
                  <p>
                    {group.number}
                    {"    "}
                    {group.titleLines[0]}
                  </p>
                  <p>{group.titleLines[1]}</p>
                </>
              ) : (
                <p>
                  {group.number}
                  {"   "}
                  {group.title}
                </p>
              )}
            </div>
            <div className="max-h-[26.25rem] overflow-y-auto overscroll-contain pr-1 md:max-h-[30.5rem]">
              <p className="text-[length:var(--type-lead)] leading-normal text-cream">
                {group.intro}
              </p>
              <ul className="mt-8 space-y-8">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <h3 className="text-[length:var(--type-service-title)] leading-[0.99] text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[length:var(--type-lead)] leading-normal text-cream">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
