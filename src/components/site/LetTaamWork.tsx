import { closingLine } from "@/content/site";

export function LetTaamWork() {
  return (
    <section
      className="site-shell py-[var(--space-section)]"
      aria-label="Closing"
    >
      <p className="max-w-5xl text-[length:var(--type-display)] font-semibold leading-[0.95] tracking-tight text-cream uppercase">
        {closingLine}
      </p>
    </section>
  );
}
