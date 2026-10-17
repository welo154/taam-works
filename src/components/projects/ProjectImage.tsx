"use client";

import Image from "next/image";
import { useState } from "react";

const localCovers: Record<string, { src: string; width: number; height: number }> = {
  "tech-valley": { src: "/work/tech-valley.jpg", width: 1740, height: 1052 },
  idea: { src: "/work/idea-card.png", width: 434, height: 455 },
};

type ProjectImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  slug?: string;
};

export function ProjectImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  slug,
}: ProjectImageProps) {
  const [failed, setFailed] = useState(false);
  const local = slug ? localCovers[slug] : undefined;
  const seedMissing = Boolean(local && src.includes("/seed/"));
  const useLocal = Boolean(local && (failed || seedMissing));
  const showPlaceholder = failed && !local;

  if (showPlaceholder) {
    return (
      <div
        className={`w-full bg-cream/5 ${className ?? ""}`}
        style={{ aspectRatio: `${width} / ${height}` }}
        role="img"
        aria-label={alt}
      />
    );
  }

  const image = useLocal && local ? local : { src, width, height };

  return (
    <Image
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      className={className}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
