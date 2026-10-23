"use client";

import { useConsultation } from "@/components/consultation/ConsultationContext";
import { connectCta } from "@/content/site";

type ConnectSectionProps = {
  className?: string;
  /** Homepage placement: centered on the page, 174px above the page bottom. */
  pinToPage?: boolean;
};

export function ConnectSection({
  className = "",
  pinToPage = false,
}: ConnectSectionProps) {
  const { open } = useConsultation();

  const button = (
    <button type="button" onClick={open} className="connect-button">
      <span className="connect-button-label">{connectCta}</span>
    </button>
  );

  if (pinToPage) {
    return (
      <div className={`connect-pin ${className}`} aria-label="Connect">
        {button}
      </div>
    );
  }

  return (
    <section
      className={`works-connect site-shell flex justify-center ${className}`}
      aria-label="Connect"
    >
      {button}
    </section>
  );
}
