import { closingLine } from "@/content/site";

export function LetTaamWork() {
  return (
    <section className="let-taam-section" aria-label="Closing">
      <p className="let-taam-line">
        <span className="font-normal">{closingLine.lead}</span>
        <span className="font-bold">{closingLine.emphasis}</span>
      </p>
    </section>
  );
}
