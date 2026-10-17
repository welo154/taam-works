import { contact, siteMeta } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-cluster">
        <div className="site-footer-contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
            {contact.phone}
          </a>
        </div>
        <div className="site-footer-social">
          <a href={contact.behance} target="_blank" rel="noopener noreferrer">
            Behance
          </a>
          <a
            href={contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
      <p className="site-footer-copy">©{siteMeta.copyrightYear} TAAMWORKS</p>
    </footer>
  );
}
