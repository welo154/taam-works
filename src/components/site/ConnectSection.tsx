"use client";

import { useConsultation } from "@/components/consultation/ConsultationContext";
import { connectCta } from "@/content/site";

type ConnectSectionProps = {
  className?: string;
  /** Homepage placement: 565px from the 1440px page’s left, 174px above the page bottom. */
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
      className={`site-shell flex justify-center py-10 md:py-14 ${className}`}
      aria-label="Connect"
    >
      {button}
    </section>
  );
}
