import { serviceGroups } from "@/content/site";
import { ServicesCarousel } from "@/components/site/ServicesCarousel";

/** Card titles break onto two lines exactly as in the Figma cards. */
function titleLines(number: string, title: string): [string, string] {
  const words = title.split(" ");
  if (words.length === 1) return [number, title];
  return [`${number} ${words[0]}`, words.slice(1).join(" ")];
}

export function ServiceGroups() {
  return (
    <section
      id="services"
      className="services-section scroll-mt-[var(--header-offset)]"
      aria-labelledby="services-heading"
    >
      <div className="services-sticky">
      <h2 id="services-heading" className="services-heading">
        <span className="services-heading-label" data-reveal="wipe">SERVICES</span>
      </h2>
      <ServicesCarousel>
        {serviceGroups.map((group) => {
          const [first, second] = titleLines(group.number, group.title);
          return (
            <article
              key={group.number}
              className="service-card"
              role="listitem"
              data-reveal="card"
            >
              <h3 className="service-card-title">
                <span>{first}</span>
                <span>{second}</span>
              </h3>
              <ol className="service-card-list">
                {group.items.map((item, index) => (
                  <li key={item.title}>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </ServicesCarousel>
      </div>
    </section>
  );
}
