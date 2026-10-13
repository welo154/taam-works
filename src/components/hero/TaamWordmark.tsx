import Image from "next/image";

export function TaamWordmark() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(88%,42rem)] -translate-x-1/2 -translate-y-1/2 md:w-[min(78%,52rem)]">
      <Image
        src="/brand/taam-wordmark-temporary.svg"
        alt="TAAM"
        width={800}
        height={220}
        priority
        className="h-auto w-full select-none"
      />
    </div>
  );
}
