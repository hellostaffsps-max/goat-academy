import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Rubik } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/StructuredData";
import { Analytics } from "@/components/Analytics";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getPublicSiteContent } from "@/lib/public-content";
import { PublicContentProvider } from "@/components/PublicContentProvider";

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
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
    google: process.env.GOOGLE_SITE_VERIFICATION || "u97VcP99mGZIfrU6Iq_qNQgWI1YNGR8ir4IUnHl2tJg",
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || "BEC298E9F259E7065BF4851AFD492032",
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
      className={rubik.variable}
      suppressHydrationWarning
    >
      <body className={rubik.className}>
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
