import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/StructuredData";
import { Analytics } from "@/components/Analytics";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getPublicSiteContent } from "@/lib/public-content";
import { PublicContentProvider } from "@/components/PublicContentProvider";

const arabic = localFont({
  src: [
    { path: "./fonts/IBMPlexSansArabic-Regular.ttf", weight: "400" },
    { path: "./fonts/IBMPlexSansArabic-Medium.ttf", weight: "500" },
    { path: "./fonts/IBMPlexSansArabic-SemiBold.ttf", weight: "600" },
    { path: "./fonts/IBMPlexSansArabic-Bold.ttf", weight: "700" },
  ],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});
const latin = localFont({
  src: [{ path: "./fonts/Manrope-Variable.ttf", weight: "400 800" }],
  variable: "--font-latin",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  ...pageMetadata(
    "Wael Irzeqat | وائل أرزيقات — تدريب الباريستا واستشارات القهوة في فلسطين",
    site.description,
    "/",
  ),
  metadataBase: new URL(site.url),
  title: {
    default: "Wael Irzeqat | وائل أرزيقات — Goat Journey",
    template: "%s | Goat Journey",
  },
  manifest: "/manifest.json",
  icons: { icon: "/brand-logo.png", apple: "/brand-logo.png" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      "u97VcP99mGZIfrU6Iq_qNQgWI1YNGR8ir4IUnHl2tJg",
    other: {
      "msvalidate.01":
        process.env.BING_SITE_VERIFICATION ||
        "BEC298E9F259E7065BF4851AFD492032",
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteContent = await getPublicSiteContent();
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabic.variable} ${latin.variable}`}
      suppressHydrationWarning
    >
      <body>
        <StructuredData />
        <Analytics />
        <PublicContentProvider data={{ siteContent }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </PublicContentProvider>
      </body>
    </html>
  );
}
