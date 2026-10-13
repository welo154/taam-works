import { contact, siteMeta } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-shell border-t border-cream/15 py-10 md:py-14">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2 text-sm md:text-base">
          <a
            href={`mailto:${contact.email}`}
            className="block text-cream transition-opacity hover:opacity-80"
          >
            {contact.email}
          </a>
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="block text-cream/80 transition-opacity hover:opacity-80"
          >
            {contact.phone}
          </a>
          <p className="pt-2 text-xs text-cream/40">
            {contact.emailNote} {contact.phoneNote}
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex gap-6 text-sm uppercase tracking-[0.14em]">
            <a
              href={contact.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream transition-opacity hover:opacity-80"
            >
              Behance
            </a>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream transition-opacity hover:opacity-80"
            >
              Instagram
            </a>
          </div>
          <p className="text-xs text-cream/40">{contact.socialNote}</p>
          <p className="text-sm text-cream/60">
            © {siteMeta.copyrightYear} {siteMeta.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
