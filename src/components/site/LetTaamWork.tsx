import { closingLine } from "@/content/site";

export function LetTaamWork() {
  return (
    <section
      className="site-shell py-[var(--space-section)]"
      aria-label="Closing"
    >
      <p className="text-center text-[length:var(--type-display)] leading-none tracking-[var(--tracking-display)] text-cream uppercase md:text-left">
        <span className="font-normal">{closingLine.lead}</span>
        <span className="font-bold">{closingLine.emphasis}</span>
      </p>
    </section>
  );
}
