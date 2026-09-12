"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const recordPage = useCallback((path: string) => {
    if (/^\/(admin|auth|settings|favorites)(\/|$)/.test(path)) return;
    const target = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    };
    if (!target.gtag || lastPath.current === path) return;
    target.gtag("event", "page_view", {
      page_location: window.location.origin + path,
      page_path: path,
      page_title: document.title,
    });
    lastPath.current = path;
  }, []);
  useEffect(() => {
    if (pathname) recordPage(pathname);
  }, [pathname, recordPage]);
  if (
    !id ||
    !/^G-[A-Z0-9]+$/.test(id) ||
    /^\/(admin|auth|settings|favorites)(\/|$)/.test(pathname)
  )
    return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script
        id="goatjourney-analytics"
        strategy="afterInteractive"
        onReady={() => recordPage(pathname)}
      >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)},{send_page_view:false});`}</Script>
    </>
  );
}
