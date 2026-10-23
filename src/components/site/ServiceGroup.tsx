import { serviceGroups } from "@/content/site";
import { ServiceCopy } from "@/components/site/ServiceCopy";

export function ServiceGroups() {
  return (
    <section
      id="services"
      className="services-section scroll-mt-[var(--header-offset)]"
      aria-labelledby="services-heading"
    >
      <h2 id="services-heading" className="sr-only">
        Services
      </h2>
      <div className="flex flex-col">
        {serviceGroups.map((group) => (
          <article key={group.number} className="service-group">
            <h3
              className={
                group.badgeLines.length > 1
                  ? "service-badge service-badge-stack"
                  : "service-badge"
              }
            >
              {group.badgeLines.map((line) => (
                <span key={line} className="service-badge-label">
                  {line}
                </span>
              ))}
            </h3>
            <ServiceCopy intro={group.intro} items={group.items} />
          </article>
        ))}
      </div>
    </section>
  );
}
