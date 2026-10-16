import { contact, siteMeta } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-shell pb-16 pt-6 md:pb-20">
      <div className="grid gap-8 text-[24px] leading-normal text-cream md:grid-cols-[1fr_auto_1fr] md:items-start">
        <div>
          <a
            href={`mailto:${contact.email}`}
            className="block uppercase transition-opacity hover:opacity-80"
          >
            {contact.email}
          </a>
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
            className="block transition-opacity hover:opacity-80"
          >
            {contact.phone}
          </a>
        </div>
        <div className="uppercase md:justify-self-center">
          <a
            href={contact.behance}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-opacity hover:opacity-80"
          >
            Behance
          </a>
          <a
            href={contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-opacity hover:opacity-80"
          >
            Instagram
          </a>
        </div>
        <p className="uppercase md:justify-self-end">
          ©{siteMeta.copyrightYear} TAAMWORKS
        </p>
      </div>
    </footer>
  );
}
