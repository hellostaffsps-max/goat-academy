"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  courses: "الدورات التدريبية",
  blog: "المدونة",
  tools: "الأدوات",
  about: "من نحن",
  consultant: "استشارة",
  services: "الخدمات",
  downloads: "تحميلات",
  "success-stories": "قصص النجاح",
  explore: "استكشف",
  paths: "مسارات",
  lesson: "درس",
  settings: "الإعدادات",
  favorites: "المفضلة",
  admin: "لوحة التحكم",
};

export function BreadcrumbNav() {
  const pathname = usePathname();

  // Hide on home, admin, and auth pages
  if (!pathname || pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const label = breadcrumbMap[segment] || segment;
    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="مسار التنقل"
      className="px-5 py-2 border-b border-border/30 bg-background/50"
    >
      <ol className="flex items-center gap-1.5 text-[11px] flex-wrap">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
          >
            <Home className="w-3 h-3" />
            <span>الرئيسية</span>
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <ChevronLeft className="w-3 h-3 text-border" />
            {item.isLast ? (
              <span
                className="text-foreground font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
