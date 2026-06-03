"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MapPin, Heart, Settings, HeadphonesIcon, Calculator } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import BrandLogo from "@/components/BrandLogo";

const navItems = [
  { id: "/", label: "الرئيسية", icon: Home },
  { id: "/explore", label: "استكشف", icon: Search },
  { id: "/tools", label: "الأدوات", icon: Calculator },
  { id: "/paths", label: "مسارات", icon: MapPin },
  { id: "/favorites", label: "المفضلة", icon: Heart },
  { id: "/settings", label: "الإعدادات", icon: Settings },
];

// Wrapper that conditionally skips the full layout for admin/auth pages
// This avoids any hook-order issues by keeping the conditional return
// in a component that doesn't call any stateful hooks.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No hooks are called before this return
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return <>{children}</>;
  }

  return <AppLayoutContent>{children}</AppLayoutContent>;
}

// Inner component holds all hooks and layout UI
function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { favorites, settings, syncFromServer } = useStore();

  useEffect(() => {
    // Sync user data from Supabase
    syncFromServer();

    // Register PWA Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("PWA Service Worker registered:", reg.scope))
          .catch((err) => console.warn("PWA Service Worker registration failed:", err));
      });
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("text-small", "text-medium", "text-large");
    html.classList.add(`text-${settings.fontSize}`);
  }, [settings.fontSize]);

  useEffect(() => {
    const html = document.documentElement;
    if (settings.reducedMotion) {
      html.classList.add("reduce-motion");
    } else {
      html.classList.remove("reduce-motion");
    }
  }, [settings.reducedMotion]);

  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-5xl mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/60">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-80">
              <div className="relative w-[200px] h-[80px] overflow-hidden">
                <BrandLogo className="object-contain object-right w-full h-full" />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/consultant"
              className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg border border-accent/20 transition-all duration-300 hover:opacity-90"
            >
              <HeadphonesIcon className="w-3.5 h-3.5" />
              <span>طلب استشارة</span>
            </Link>
            <div className="hidden sm:block">
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                أكاديمية تفاعلية
              </span>
            </div>
          </div>
        </div>

        {/* Top Navigation — hidden on mobile */}
        <nav className="border-t border-border/40 hidden sm:block" aria-label="التنقل الرئيسي">
          <div className="max-w-5xl mx-auto px-3">
            <div className="flex items-center gap-0.5 py-1 overflow-x-auto no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.id;
                const favCount = item.id === "/favorites" ? favorites.length : 0;

                return (
                  <Link
                    key={item.id}
                    href={item.id}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "nav-item flex items-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex-shrink-0",
                      isActive
                        ? "active text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <div className="relative">
                      <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 1.5} />
                      {favCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-accent text-[7px] font-bold text-accent-foreground flex items-center justify-center">
                          {favCount}
                        </span>
                      )}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-5 pt-6 pb-24 sm:pb-6">
        {children}
      </main>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/60"
        aria-label="التنقل السفلي"
      >
        <div className="flex items-center justify-around px-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;
            const favCount = item.id === "/favorites" ? favorites.length : 0;

            return (
              <Link
                key={item.id}
                href={item.id}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl transition-all duration-200 relative",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-200",
                      isActive ? "scale-110" : "scale-100"
                    )}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  {favCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-accent text-[7px] font-bold text-accent-foreground flex items-center justify-center">
                      {favCount}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[9px] font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
