"use client";

import { useEffect, useState } from "react";
import { useConsultation } from "@/components/consultation/ConsultationContext";

const SEEN_KEY = "taam-consultation-nudge";
const DELAY_MS = 2500;

/**
 * Small "book your free consultation" notice shown once per visit, shortly
 * after the site first opens. It returns the next time the site is opened.
 */
export function ConsultationNudge() {
  const { isOpen, open } = useConsultation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const timer = window.setTimeout(() => setVisible(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode: the notice simply shows again on the next page.
    }
  }

  if (!visible || isOpen) return null;

  return (
    <aside className="consult-nudge" aria-label="Free consultation">
      <button
        type="button"
        className="consult-nudge-close"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
      <p className="consult-nudge-title">
        Book your <span className="consult-nudge-mark">free</span> consultation
      </p>
      <p className="consult-nudge-text">
        Tell us when suits you and we will call to confirm.
      </p>
      <button
        type="button"
        className="consult-nudge-button"
        onClick={() => {
          dismiss();
          open();
        }}
      >
        <span>BOOK NOW</span>
      </button>
    </aside>
  );
}
