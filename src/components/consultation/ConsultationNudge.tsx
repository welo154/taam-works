"use client";

import { useEffect, useState } from "react";
import { useConsultation } from "@/components/consultation/ConsultationContext";
import { consultationNudge, type NudgeVariant } from "@/content/site";

const SEEN_KEY = "taam-consultation-nudge";
const DELAY_MS = 2500;
const VARIANTS: NudgeVariant[] = ["pill", "line", "tab"];

/**
 * Small "free consultation" notice shown once per visit, shortly after the
 * site first opens. One line of text that opens the booking dialog.
 *
 * The look is chosen by `consultationNudge.variant` in content/site.ts:
 *   pill – yellow pill, bottom right
 *   line – dark outlined sentence, bottom right
 *   tab  – yellow tab on the right edge of the screen
 * Adding ?nudge=pill|line|tab to any page address previews that look.
 */
export function ConsultationNudge() {
  const { isOpen, open } = useConsultation();
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<NudgeVariant>(
    consultationNudge.variant,
  );

  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("nudge");
    const preview = VARIANTS.find((name) => name === asked);
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen && !preview) return;
    const timer = window.setTimeout(
      () => {
        if (preview) setVariant(preview);
        setVisible(true);
      },
      preview ? 400 : DELAY_MS,
    );
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
    <aside
      className={`consult-nudge consult-nudge-${variant}`}
      aria-label="Free consultation"
    >
      <button
        type="button"
        className="consult-nudge-open"
        onClick={() => {
          dismiss();
          open();
        }}
      >
        {variant === "tab" ? (
          <span>Free consultation</span>
        ) : (
          <>
            <span>
              Book your <span className="consult-nudge-mark">free</span>{" "}
              consultation
            </span>
            <span className="consult-nudge-arrow" aria-hidden="true">
              →
            </span>
          </>
        )}
      </button>
      <button
        type="button"
        className="consult-nudge-close"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    </aside>
  );
}
