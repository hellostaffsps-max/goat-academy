import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Rubik } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/theme-provider";

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoatJourney Academy | أكاديمية القهوة في فلسطين",
  description: "أكاديمية تفاعلية لتعلم القهوة والمقاهي في فلسطين — مشروبات، تحضير، معدات، بن، مصطلحات، وتأسيس مقاهي.",
  manifest: "/manifest.json",
  icons: {
    icon: "/brand-logo.png",
    apple: "/brand-logo.png",
  },
  openGraph: {
    title: "GoatJourney Academy | أكاديمية القهوة في فلسطين",
    description: "أكاديمية تفاعلية لتعلم القهوة والمقاهي في فلسطين — مشروبات، تحضير، معدات، بن، مصطلحات، وتأسيس مقاهي.",
    images: ["/brand-logo.png"],
    type: "website",
    locale: "ar_PS",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoatJourney Academy | أكاديمية القهوة في فلسطين",
    description: "أكاديمية تفاعلية لتعلم القهوة والمقاهي في فلسطين — مشروبات، تحضير، معدات، بن، مصطلحات، وتأسيس مقاهي.",
    images: ["/brand-logo.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={rubik.variable} suppressHydrationWarning>
      <body className={rubik.className}>
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
