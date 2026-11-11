"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin": "الرئيسية",
  "/admin/lessons": "إدارة الدروس",
  "/admin/blog": "إدارة المقالات",
  "/admin/paths": "إدارة مسارات التعلم",
  "/admin/curriculum": "إدارة المنهج",
  "/admin/success-stories": "إدارة الأعمال",
  "/admin/cafes": "إدارة المقاهي",
  "/admin/site-content": "إدارة محتوى الموقع",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = titles[pathname] || "لوحة التحكم";

  return (
    <header className="h-16 border-b border-border bg-card flex items-center pl-6 pr-20 lg:pr-6 sticky top-0 z-30">
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
    </header>
  );
}
