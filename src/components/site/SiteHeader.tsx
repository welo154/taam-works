import Image from "next/image";
import Link from "next/link";
import { siteMeta } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-shell flex items-center justify-between py-5 md:py-6">
      <Link href="/" className="inline-flex items-center gap-2">
        <Image
          src="/brand/taamworks-mark-temporary.svg"
          alt={`${siteMeta.name} home`}
          width={140}
          height={24}
          priority
          className="h-5 w-auto md:h-6"
        />
        <span className="sr-only">{siteMeta.name}</span>
      </Link>
      <p className="text-sm tracking-wide text-cream/70 md:text-base">
        © {siteMeta.copyrightYear}
      </p>
    </header>
  );
}
