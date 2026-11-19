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
  "TAAM (TaamWorks) is a design studio in London for branding, technology, events, experiences, and spaces.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "TaamWorks - Design Studio",
    template: "%s · TaamWorks",
  },
  description,
  applicationName: "TaamWorks",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/brand/tab-icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/brand/tab-icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/brand/tab-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "TaamWorks",
    locale: "en_GB",
    title: "TaamWorks - Design Studio",
    description,
    images: [{ url: "/brand/taam-wordmark.png", width: 641, height: 280 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaamWorks - Design Studio",
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
      // The inline script below adds the `motion` class before hydration.
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <body>. */}
      <body className="min-h-full bg-bg text-cream" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('motion');setTimeout(function(){if(!window.__motionReady)document.documentElement.classList.add('motion-failed')},4000)",
          }}
        />
        <div className="site-frame">{children}</div>
      </body>
    </html>
  );
}
