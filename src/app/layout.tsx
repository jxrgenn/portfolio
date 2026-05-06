import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";
import { AmbientBackground } from "@/components/system/AmbientBackground";
import { CustomCursor } from "@/components/system/CustomCursor";
import { PersistentCanvas } from "@/components/system/PersistentCanvas";
import { SmoothScroll } from "@/components/system/SmoothScroll";
import { SiteNav } from "@/components/system/SiteNav";
import { SiteFooter } from "@/components/system/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jurgenhalili.dev";

export const metadata: Metadata = {
  title: {
    default: "Jurgen Halili — full-stack engineer with AI focus",
    template: "%s — Jurgen Halili",
  },
  description:
    "Full-stack engineer building AI-driven products end-to-end — agent runtimes, multi-LLM pipelines, native apps. Kiel, Germany.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jurgen Halili",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  authors: [{ name: "Jurgen Halili" }],
  creator: "Jurgen Halili",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <AmbientBackground />
        <PersistentCanvas />
        <CustomCursor />
        <SiteNav />
        <SkipLink />
        <main id="main" className="relative flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
