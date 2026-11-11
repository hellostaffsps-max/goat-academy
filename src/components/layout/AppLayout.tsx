"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClientPathname } from "@/hooks/useClientPathname";
import {
  Home,
  Newspaper,
  Settings,
  Headphones,
  Calculator,
  GraduationCap,
  Info,
  FlaskConical,
  Menu,
  Route,
  Heart,
  Download,
  Trophy,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { SkipToContent } from "@/components/SkipToContent";

import { SearchBar } from "@/components/SearchBar";
import BrandLogo from "@/components/BrandLogo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { logVisit } from "@/actions/analytics";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { id: "/", label: "الرئيسية", icon: Home },
  { id: "/courses", label: "الدروس", icon: GraduationCap },
  { id: "/paths", label: "مسارات التعلم", icon: Route },
  {
    id: "https://staffps.online/lab/practice",
    label: "المختبر",
    icon: FlaskConical,
  },
  { id: "/tools", label: "الأدوات", icon: Calculator },
  { id: "/success-stories", label: "أعمال وائل", icon: Trophy },
  { id: "/services", label: "الخدمات", icon: Headphones },
];
const extraNavItems = [
  { id: "/favorites", label: "دروسي المفضلة", icon: Heart },
  { id: "/downloads", label: "الموارد المجانية", icon: Download },
  { id: "/blog", label: "المدونة", icon: Newspaper },
  { id: "/about", label: "عن الأكاديمية", icon: Info },
  { id: "/settings", label: "الإعدادات", icon: Settings },
];
const navGroups = [
  {
    label: "تعلم وطبّق",
    items: [
      navItems[1],
      navItems[2],
      extraNavItems[0],
      navItems[3],
      navItems[4],
      extraNavItems[1],
    ],
  },
  {
    label: "اكتشف Goat Journey",
    items: [
      navItems[0],
      navItems[5],
      navItems[6],
      extraNavItems[2],
      extraNavItems[3],
      extraNavItems[4],
    ],
  },
];

// Wrapper that conditionally skips the full layout for admin/auth pages
// This avoids any hook-order issues by keeping the conditional return
// in a component that doesn't call any stateful hooks.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Log visit asynchronously
      logVisit(pathname).catch(console.error);
    }
  }, [pathname]);

  // No hooks are called before this return
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return <>{children}</>;
  }

  return <AppLayoutContent>{children}</AppLayoutContent>;
}

// Inner component holds all hooks and layout UI
function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { settings, syncFromServer } = useStore();

  useEffect(() => {
    // The learning-store hook initializes every consumer, including direct lessons.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    let previousId: string | null | undefined;
    let syncTimer: ReturnType<typeof setTimeout> | undefined;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextId = session?.user.id ?? null;
      const current = useStore.getState();
      if (event === "INITIAL_SESSION") {
        previousId = nextId;
        if (current.accountId === nextId) return;
      } else if (nextId === previousId && event !== "USER_UPDATED") return;
      previousId = nextId;
      if (current.accountId !== nextId) current.invalidateAccountScope(nextId);
      if (syncTimer) clearTimeout(syncTimer);
      // Do not await Supabase operations inside its auth callback lock.
      syncTimer = setTimeout(() => {
        void syncFromServer();
      }, 0);
    });
    return () => {
      subscription.unsubscribe();
      if (syncTimer) clearTimeout(syncTimer);
    };
  }, [syncFromServer]);

  useEffect(() => {
    // Register PWA Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const register = () => {
        void navigator.serviceWorker.register("/sw.js").catch(() => {});
      };
      if (document.readyState === "complete") register();
      else {
        window.addEventListener("load", register, { once: true });
        return () => window.removeEventListener("load", register);
      }
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

  const pathname = useClientPathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLearningPage = [
    "/courses",
    "/explore",
    "/paths",
    "/favorites",
    "/settings",
    "/tools",
    "/lesson/",
    "/blog/",
    "/downloads/",
  ].some((route) => pathname.startsWith(route));
  const isCurrent = (href: string) =>
    pathname === href ||
    (href !== "/" && pathname.startsWith(`${href}/`)) ||
    (href === "/courses" && pathname.startsWith("/lesson/"));

  return (
    <div className="academy-shell min-h-screen bg-background flex flex-col max-w-7xl mx-auto relative">
      <SkipToContent />
      {/* Header */}
      <header className="sm:sticky top-0 z-50 bg-background border-b border-border/60">
        <div className="px-5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Goat Journey Academy — الرئيسية"
              className="group flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="relative w-[132px] sm:w-[160px] h-[48px] sm:h-[56px] overflow-hidden">
                <BrandLogo className="object-contain object-right w-full h-full" />
              </div>
              <span
                lang="en"
                dir="ltr"
                className="font-latin font-bold border-s border-border ps-3"
              >
                Academy
              </span>
            </Link>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-3">
            <SearchBar />
            <Link
              href="/consultant"
              aria-label="طلب استشارة"
              className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-sm font-semibold min-h-11 min-w-11 justify-center px-3 py-2 rounded-lg border border-accent/20 transition-all duration-300 hover:opacity-90"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>استشارة</span>
            </Link>
            <div className="hidden md:block">
              <span className="text-xs text-muted-foreground">
                أكاديمية تفاعلية
              </span>
            </div>
          </div>
        </div>

        {/* Top Navigation — hidden on mobile */}
        <nav
          className="border-t border-border/40 hidden sm:block"
          aria-label="التنقل الرئيسي"
        >
          <div className="max-w-7xl mx-auto px-3">
            <div className="flex flex-wrap items-center gap-0.5 py-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isCurrent(item.id);

                return (
                  <Link
                    key={item.id}
                    href={item.id}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "nav-item flex items-center gap-1.5 min-h-11 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0",
                      isActive
                        ? "active text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                    )}
                  >
                    <div className="relative">
                      <Icon
                        className="w-4 h-4"
                        strokeWidth={isActive ? 2.5 : 1.5}
                      />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "min-h-11 inline-flex items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-secondary",
                      extraNavItems.some((item) => isCurrent(item.id))
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    المزيد <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  {extraNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        asChild
                        className="min-h-11 rounded-lg"
                      >
                        <Link
                          href={item.id}
                          aria-current={isCurrent(item.id) ? "page" : undefined}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </header>

      {/* Breadcrumb */}
      <BreadcrumbNav />

      {/* Main Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 min-w-0 px-5 sm:px-8 pt-6 pb-10"
      >
        {children}
      </main>

      <Footer />
      {pathname && !isLearningPage && pathname !== "/consultant" && (
        <WhatsAppButton />
      )}

      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]"
        aria-label="التنقل السفلي"
      >
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.id);
            return (
              <Link
                key={item.id}
                href={item.id}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium",
                  active
                    ? "bg-accent/40 text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.id === "/paths" ? "المسارات" : item.label}</span>
              </Link>
            );
          })}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium text-muted-foreground"
                aria-label="المزيد من الصفحات"
              >
                <Menu className="h-5 w-5" />
                <span>المزيد</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="overflow-y-auto w-[min(92vw,380px)]"
            >
              <SheetHeader className="pt-12 text-right">
                <SheetTitle>اكتشف Goat Journey</SheetTitle>
                <SheetDescription>
                  تعلّم في الأكاديمية، وطبّق في المختبر.
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-2 px-4 pb-8" aria-label="جميع الصفحات">
                {navGroups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <p className="px-4 pt-4 pb-1 text-xs font-semibold text-muted-foreground">
                      {group.label}
                    </p>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SheetClose asChild key={item.id}>
                          <Link
                            href={item.id}
                            aria-current={
                              isCurrent(item.id) ? "page" : undefined
                            }
                            className={cn(
                              "flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm",
                              isCurrent(item.id)
                                ? "bg-accent/40 font-semibold"
                                : "hover:bg-muted",
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                ))}
                <SheetClose asChild>
                  <Link href="/consultant" className="btn-premium mt-4">
                    احجز استشارة
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
