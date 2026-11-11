"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  Store,
  Settings,
  LogOut,
  Menu,
  Newspaper,
  Trophy,
  Route,
} from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import BrandLogo from "@/components/BrandLogo";

const navItems = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/lessons", label: "الدروس", icon: BookOpen },
  { href: "/admin/paths", label: "مسارات التعلم", icon: Route },
  { href: "/admin/blog", label: "المدونة", icon: Newspaper },
  { href: "/admin/success-stories", label: "قصص النجاح", icon: Trophy },
  { href: "/admin/cafes", label: "المقاهي", icon: Store },
  { href: "/admin/site-content", label: "محتوى الموقع", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="block">
          <div className="w-[160px] h-[64px]">
            <BrandLogo className="w-full h-full object-contain" />
          </div>
        </Link>
        <p className="text-sm text-muted-foreground mt-2">
          لوحة التحكم — سوبر أدمن
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all mb-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>العودة للموقع</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  );
  return (
    <>
      <aside className="hidden lg:flex fixed top-0 right-0 h-full w-64 bg-card border-l border-border flex-col overflow-y-auto">
        {sidebarContent}
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="فتح قائمة الإدارة"
            className="lg:hidden fixed top-3 right-4 z-40 min-w-11 min-h-11 bg-card border border-border rounded-lg flex items-center justify-center"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 overflow-y-auto pt-10 gap-0">
          <SheetTitle className="sr-only">قائمة الإدارة</SheetTitle>
          <SheetDescription className="sr-only">
            التنقل بين أقسام إدارة الأكاديمية
          </SheetDescription>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
