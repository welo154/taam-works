import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const acuminPro = localFont({
  src: [
    { path: "../fonts/Acumin-RPro.otf", weight: "400", style: "normal" },
    { path: "../fonts/Acumin-ItPro.otf", weight: "400", style: "italic" },
    { path: "../fonts/Acumin-BdPro.otf", weight: "700", style: "normal" },
    { path: "../fonts/Acumin-BdItPro.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-acumin",
  display: "swap",
  fallback: ["Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "TAAM Works",
    template: "%s · TAAM Works",
  },
  description:
    "An interdisciplinary studio based in London, working across design, technology, experiences, and spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${acuminPro.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-cream">{children}</body>
    </html>
  );
}
