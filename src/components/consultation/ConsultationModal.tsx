"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BookingForm } from "@/components/consultation/BookingForm";
import { useConsultation } from "@/components/consultation/ConsultationContext";

/** Matches the closing animation in globals.css (.booking-overlay.is-closing). */
const CLOSE_MS = 280;

export function ConsultationModal() {
  const { isOpen, close } = useConsultation();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);

  // Play the exit animation, then unmount.
  const requestClose = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      close();
      return;
    }
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      close();
    }, CLOSE_MS);
  }, [close]);

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
        requestClose();
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
  }, [isOpen, requestClose]);

  if (!isOpen) return null;

  return (
    <div className={`booking-overlay${closing ? " is-closing" : ""}`}>
      <button
        type="button"
        className="booking-backdrop"
        aria-label="Dismiss consultation form"
        onClick={requestClose}
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
          onClick={requestClose}
          className="booking-close"
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="consultation-title" className="booking-title">
          <span className="booking-title-lead">LET’S </span>
          <span className="booking-title-mark">
            <span>TAAM IT</span>
          </span>
        </h2>
        <p className="booking-subtitle">Book your consultation</p>
        <BookingForm sourcePage={pathname || "/"} />
      </div>
    </div>
  );
}
