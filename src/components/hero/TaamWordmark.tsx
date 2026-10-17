import Image from "next/image";

export function TaamWordmark() {
  return (
    <div className="taam-wordmark">
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
