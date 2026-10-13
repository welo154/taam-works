import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

/**
 * TEMPORARY body font until licensed webfonts are exported from Figma.
 * Not presented as the final brand typeface.
 */
const bodyTemporary = Syne({
  variable: "--font-body-temporary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TAAM Works",
    template: "%s · TAAM Works",
  },
  description:
    "TAAM is a multidisciplinary studio working across design, technology, events, and spatial practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyTemporary.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-cream">{children}</body>
    </html>
  );
}
