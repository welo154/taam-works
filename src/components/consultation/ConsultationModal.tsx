"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { BookingForm } from "@/components/consultation/BookingForm";
import { useConsultation } from "@/components/consultation/ConsultationContext";

export function ConsultationModal() {
  const { isOpen, close } = useConsultation();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    const root = dialogRef.current;
    closeRef.current?.focus();
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
    <div className="booking-overlay">
      <button
        type="button"
        className="booking-backdrop"
        aria-label="Dismiss consultation form"
        onClick={close}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-title"
        className="booking-panel"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className="booking-close"
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="consultation-title" className="booking-title">
          LET’S <span className="booking-title-mark">TAAM IT</span>
        </h2>
        <p className="booking-subtitle">Book your consultation</p>
        <BookingForm sourcePage={pathname || "/"} />
      </div>
    </div>
  );
}
