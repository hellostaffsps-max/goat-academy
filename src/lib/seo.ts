import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  type: "website" | "article" = "website",
): Metadata {
  const summary = description.replace(/\s+/g, " ").trim().slice(0, 165);
  const image = {
    url: absoluteUrl("/og/default.png"),
    width: 1200,
    height: 630,
    alt: "Goat Journey — Wael Irzeqat",
  };
  return {
    title,
    description: summary,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description: summary,
      url: absoluteUrl(path),
      type,
      siteName: site.name,
      locale: "ar_PS",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: [image.url],
    },
  };
}
export const privateMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};
