import { ConsultationProvider } from "@/components/consultation/ConsultationContext";
import { ConsultationModal } from "@/components/consultation/ConsultationModal";
import { ConsultationNudge } from "@/components/consultation/ConsultationNudge";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { ConnectSection } from "@/components/site/ConnectSection";
import { LetTaamWork } from "@/components/site/LetTaamWork";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { contact, siteMeta, studioIntro } from "@/content/site";
import { isComingSoon } from "@/lib/coming-soon";
import { getSiteUrl } from "@/lib/site-url";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const comingSoon = isComingSoon();
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        name: "TaamWorks",
        alternateName: ["TAAM", "taamworks", "TAAM Works", siteMeta.name],
        url: siteUrl,
        logo: `${siteUrl}/brand/taam-wordmark.png`,
        description:
          "TAAM (TaamWorks) is a design studio in London for branding, technology, events, and spaces.",
        email: contact.email,
        telephone: contact.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "London",
          addressCountry: "GB",
        },
        areaServed: "GB",
        knowsAbout: [
          "design studio",
          "brand identity",
          "TAAM",
          "taamworks",
        ],
      },
      {
        "@type": "WebSite",
        name: "TaamWorks",
        alternateName: ["TAAM", "taamworks", "TAAM Works"],
        url: siteUrl,
        description: "TaamWorks - Design Studio",
      },
    ],
  };

  return (
    <ConsultationProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        {comingSoon ? null : (
          <>
            <div className="page-close">
              <LetTaamWork />
              <ConnectSection />
            </div>
            <SiteFooter />
          </>
        )}
      </div>
      {comingSoon ? null : (
        <>
          <ConsultationModal />
          <ConsultationNudge />
          <ScrollMotion />
        </>
      )}
    </ConsultationProvider>
  );
}
