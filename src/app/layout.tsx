import type { Metadata } from "next";
import localFont from "next/font/local";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const koSans = localFont({
  src: [
    { path: "../fonts/KOSans-Regular.otf", weight: "300", style: "normal" },
    { path: "../fonts/KOSans-Regular.otf", weight: "400", style: "normal" },
  ],
  variable: "--font-ko",
  display: "swap",
  fallback: ["Segoe UI", "sans-serif"],
});

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

const description =
  "TAAM Works is an interdisciplinary studio based in London, working across design, technology, experiences, and spaces.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "TAAM Works",
    template: "%s · TAAM Works",
  },
  description,
  applicationName: "TAAM Works",
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "TAAM Works",
    locale: "en_GB",
    title: "TAAM Works",
    description,
    images: [{ url: "/brand/taam-wordmark.png", width: 641, height: 280 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TAAM Works",
    description,
    images: ["/brand/taam-wordmark.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${acuminPro.variable} ${koSans.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <body>. */}
      <body className="min-h-full bg-bg text-cream" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
