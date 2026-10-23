import { ConsultationProvider } from "@/components/consultation/ConsultationContext";
import { ConsultationModal } from "@/components/consultation/ConsultationModal";
import { ConnectSection } from "@/components/site/ConnectSection";
import { LetTaamWork } from "@/components/site/LetTaamWork";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { contact, siteMeta, studioIntro } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteMeta.name,
        alternateName: ["TAAM", "taamworks", "TAAM Works"],
        url: siteUrl,
        logo: `${siteUrl}/brand/taam-wordmark.png`,
        description: `${siteMeta.name} is ${studioIntro.paragraph}`,
        email: contact.email,
        telephone: contact.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "London",
          addressCountry: "GB",
        },
      },
      {
        "@type": "WebSite",
        name: siteMeta.name,
        alternateName: ["TAAM", "taamworks"],
        url: siteUrl,
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
        <SiteFooter />
        <div className="page-close">
          <LetTaamWork />
          <ConnectSection />
        </div>
      </div>
      <ConsultationModal />
    </ConsultationProvider>
  );
}
