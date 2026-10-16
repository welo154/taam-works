import Image from "next/image";
import Link from "next/link";
import { siteMeta } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-shell flex items-center justify-between pt-8 pb-2 md:pt-9">
      <Link href="/" className="inline-flex items-center gap-[7px]">
        <Image
          src="/brand/taamworks-logo.svg"
          alt={`${siteMeta.name} home`}
          width={126}
          height={22}
          priority
        />
        <Image
          src="/brand/logo-dot.svg"
          alt=""
          width={7}
          height={7}
          priority
        />
        <span className="sr-only">{siteMeta.name}</span>
      </Link>
      <p className="text-[20px] font-light tracking-[-0.05em] text-cream">
        ©{siteMeta.copyrightYear}
      </p>
    </header>
  );
}
