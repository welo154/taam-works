import Image from "next/image";
import Link from "next/link";
import { siteMeta } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        <Image
          src="/brand/taamworks-logo.svg"
          alt={`${siteMeta.name} home`}
          width={126}
          height={22}
          priority
          className="site-logo-mark"
        />
        <Image
          src="/brand/logo-dot.svg"
          alt=""
          width={7}
          height={7}
          priority
          className="site-logo-dot"
        />
        <span className="sr-only">{siteMeta.name}</span>
      </Link>
      <p className="site-header-year">©{siteMeta.copyrightYear}</p>
    </header>
  );
}
