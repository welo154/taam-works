import Link from "next/link";
import { connectCta } from "@/content/site";

type ConnectSectionProps = {
  className?: string;
};

export function ConnectSection({ className = "" }: ConnectSectionProps) {
  return (
    <section
      className={`site-shell flex justify-center py-16 md:py-24 ${className}`}
      aria-label="Connect"
    >
      <Link
        href="/connect"
        className="inline-flex min-h-12 items-center justify-center bg-yellow px-8 py-3 text-sm font-semibold tracking-[0.12em] text-bg transition-transform hover:scale-[1.02] md:min-h-14 md:px-12 md:text-base"
      >
        {connectCta}
      </Link>
    </section>
  );
}
