import Image from "next/image";
import { studioIntro } from "@/content/site";

export function StudioIntro() {
  return (
    <section
      id={studioIntro.id}
      className="site-shell scroll-mt-[var(--header-offset)] grid items-start gap-8 py-[var(--space-section)] md:grid-cols-[minmax(14rem,16rem)_minmax(0,34.5rem)] md:justify-center md:gap-12"
      aria-labelledby="studio-intro-label"
    >
      <div className="relative h-[55px] w-[236px]">
        <Image
          src="/brand/about-label-bg.svg"
          alt=""
          width={236}
          height={55}
          className="absolute left-0 top-0"
        />
        <Image
          src="/brand/taamworks-about.svg"
          alt=""
          width={226}
          height={43}
          className="absolute left-[5px] top-[5px]"
        />
        <h2 id="studio-intro-label" className="sr-only">
          {studioIntro.label}
        </h2>
      </div>
      <p className="text-[length:var(--type-lead)] leading-normal text-cream">
        {studioIntro.paragraph}
      </p>
    </section>
  );
}
