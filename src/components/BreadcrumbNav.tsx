"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import { services } from "@/data/services";

const breadcrumbMap: Record<string, string> = {
  courses: "الدروس",
  blog: "المدونة",
  tools: "الأدوات",
  about: "من نحن",
  consultant: "استشارة",
  services: "الخدمات",
  downloads: "الموارد المجانية",
  "success-stories": "أعمال وائل أرزيقات",
  explore: "البحث في الأكاديمية",
  paths: "مسارات التعلم",
  lesson: "درس",
  settings: "الإعدادات",
  favorites: "المفضلة",
  admin: "لوحة التحكم",
};

export function BreadcrumbNav() {
  const pathname = usePathname();

  // Hide on home, admin, and auth pages
  if (
    !pathname ||
    pathname === "/" ||
    pathname === "/services" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.split("/").filter(Boolean).length > 1
  ) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => {
    const href =
      segment === "lesson"
        ? "/courses"
        : "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const label =
      breadcrumbMap[segment] ||
      services.find((s) => s.slug === segment)?.name ||
      (isLast ? "التفاصيل" : segment);
    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="مسار التنقل"
      className="px-5 sm:px-8 py-1 border-b border-border/30 bg-background/50"
    >
      <ol className="flex items-center gap-1.5 text-sm flex-wrap">
        <li>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
          >
            <Home className="w-3 h-3" />
            <span>الرئيسية</span>
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <ChevronLeft className="w-3 h-3 text-border" />
            {item.isLast ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center text-muted-foreground hover:text-accent transition-colors"
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
