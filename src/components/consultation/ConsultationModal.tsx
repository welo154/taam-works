"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { useConsultation } from "@/components/consultation/ConsultationContext";
import { consultation } from "@/content/site";

export function ConsultationModal() {
  const { isOpen, close } = useConsultation();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    const root = dialogRef.current;
    const firstField = root?.querySelector<HTMLElement>(
      "input, select, textarea, button",
    );
    firstField?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !root) return;
      const focusable = [
        ...root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Dismiss consultation form"
        onClick={close}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-title"
        className="relative z-10 max-h-[min(40rem,calc(100vh-4rem))] w-full max-w-[32rem] overflow-y-auto rounded-[var(--radius-cta)] border border-cream/15 bg-bg px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:px-8 md:py-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className="absolute right-4 top-4 text-sm text-cream/55 transition-opacity hover:text-cream"
        >
          {consultation.close}
        </button>
        <h2
          id="consultation-title"
          className="pr-16 text-2xl tracking-tight text-cream md:text-3xl"
        >
          {consultation.title}
        </h2>
        <p className="mt-3 text-[length:var(--type-body)] text-cream/70">
          {consultation.lead}
        </p>
        <div className="mt-7">
          <ConsultationForm
            sourcePage={pathname || "/"}
            idPrefix="modal-consult"
          />
        </div>
      </div>
    </div>
  );
}
