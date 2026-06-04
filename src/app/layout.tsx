import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Rubik } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/StructuredData";

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GoatJourney Academy | أكاديمية القهوة المختصة الأولى بالعربية",
    template: "%s | GoatJourney Academy",
  },
  description:
    "أول أكاديمية تفاعلية لتعلم القهوة المختصة وتأسيس المقاهي بالعربية — دورات الباريستا، استشارات تشغيلية، وأدوات تفاعلية مجانية.",
  keywords: [
    "أكاديمية قهوة",
    "تعلم القهوة المختصة",
    "دورات باريستا",
    "تأسيس مقهى",
    "استشارات مقاهي",
    "GoatJourney",
  ],
  metadataBase: new URL("https://www.goatjourney.online"),
  manifest: "/manifest.json",
  icons: {
    icon: "/brand-logo.png",
    apple: "/brand-logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_PS",
    url: "https://www.goatjourney.online",
    siteName: "GoatJourney Academy",
    title: "GoatJourney Academy | أكاديمية القهوة المختصة الأولى بالعربية",
    description:
      "أول أكاديمية تفاعلية لتعلم القهوة المختصة وتأسيس المقاهي بالعربية — دورات الباريستا، استشارات تشغيلية، وأدوات تفاعلية مجانية.",
    images: [
      {
        url: "https://www.goatjourney.online/brand-logo.png",
        width: 1200,
        height: 630,
        alt: "GoatJourney Academy — أكاديمية القهوة المختصة الأولى بالعربية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoatJourney Academy | أكاديمية القهوة المختصة الأولى بالعربية",
    description:
      "أول أكاديمية تفاعلية لتعلم القهوة المختصة وتأسيس المقاهي بالعربية.",
    images: ["https://www.goatjourney.online/brand-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={rubik.variable} suppressHydrationWarning>
      <body className={rubik.className}>
        <StructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
