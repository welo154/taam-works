import type { Metadata } from "next";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { connectCta, consultation } from "@/content/site";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Book a free consultation with TAAM Works. Submitting this form is a request, not a confirmed appointment.",
};

export default function ConnectPage() {
  return (
    <section className="site-shell py-[var(--space-section)]">
      <h1 className="text-3xl tracking-tight text-cream md:text-5xl">
        {connectCta}
      </h1>
      <h2 className="mt-6 text-2xl tracking-tight text-cream md:text-3xl">
        {consultation.title}
      </h2>
      <p className="mt-4 max-w-xl text-[length:var(--type-lead)] text-cream/80">
        {consultation.lead}
      </p>
      <div className="mt-10 max-w-xl">
        <ConsultationForm sourcePage="/connect" idPrefix="page-consult" />
      </div>
    </section>
  );
}
