import Image from "next/image";
import { heroWordmarkBox } from "@/content/hero-states";

export function TaamWordmark() {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${heroWordmarkBox.left}%`,
        top: `${heroWordmarkBox.top}%`,
        width: `${heroWordmarkBox.width}%`,
      }}
    >
      <Image
        src="/brand/taam-wordmark.png"
        alt="TAAM"
        width={641}
        height={280}
        priority
        className="h-auto w-full select-none"
      />
    </div>
  );
}
