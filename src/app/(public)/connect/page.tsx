import type { Metadata } from "next";
import { connectCta, contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Connect",
  description: "Get in touch with TAAM Works.",
};

/**
 * Placeholder connect page for Stages 1–4.
 * Full consultation/booking flow arrives in Prompt 7.
 */
export default function ConnectPage() {
  return (
    <section className="site-shell py-[var(--space-section)]">
      <h1 className="text-3xl tracking-tight text-cream md:text-5xl">
        {connectCta}
      </h1>
      <p className="mt-6 max-w-xl text-[length:var(--type-lead)] text-cream/85">
        Consultation booking is not configured yet. Reach out by email while the
        contact flow is finalized.
      </p>
      <a
        href={`mailto:${contact.email}`}
        className="mt-10 inline-flex min-h-12 items-center bg-yellow px-8 py-3 text-sm font-semibold tracking-[0.12em] text-bg"
      >
        {contact.email}
      </a>
      <p className="mt-4 text-xs text-cream/40">{contact.emailNote}</p>
    </section>
  );
}
