import Link from "next/link";
import { connectCta } from "@/content/site";

type ConnectSectionProps = {
  className?: string;
};

export function ConnectSection({ className = "" }: ConnectSectionProps) {
  return (
    <section
      className={`site-shell flex justify-center py-10 md:py-14 ${className}`}
      aria-label="Connect"
    >
      <Link
        href="/connect"
        className="inline-flex h-[61px] w-[303px] items-center justify-center rounded-[var(--radius-cta)] bg-yellow text-[40px] leading-none tracking-[-0.08em] text-black transition-transform hover:scale-[1.02]"
      >
        {connectCta}
      </Link>
    </section>
  );
}
