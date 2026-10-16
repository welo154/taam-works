import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

/**
 * Figma specifies Acumin Pro. Source Sans 3 is the licensed stand-in
 * until Acumin files are supplied.
 */
const acuminStandIn = Source_Sans_3({
  variable: "--font-acumin",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
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
    <html lang="en" className={`${acuminStandIn.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-cream">{children}</body>
    </html>
  );
}
