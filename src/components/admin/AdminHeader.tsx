"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin": "الرئيسية",
  "/admin/lessons": "إدارة الدروس",
  "/admin/cafes": "إدارة المقاهي",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = titles[pathname] || "لوحة التحكم";

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6 sticky top-0 z-30">
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
    </header>
  );
}
