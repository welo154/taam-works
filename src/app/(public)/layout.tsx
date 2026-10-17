import { ConsultationProvider } from "@/components/consultation/ConsultationContext";
import { ConsultationModal } from "@/components/consultation/ConsultationModal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConsultationProvider>
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <ConsultationModal />
    </ConsultationProvider>
  );
}
