"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        router.replace("/auth/login");
        return;
      }

      // Check if user has admin role (workaround: profiles RLS has infinite recursion)
      // TODO: Fix RLS policy on profiles table and restore role-based check
      const isAdminUser = session.user.email === "admin@goatjourney.com";

      if (isAdminUser) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        await supabase.auth.signOut();
        router.replace("/auth/login");
      }
    };
    checkAdmin();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setIsAdmin(false);
        router.replace("/auth/login");
        return;
      }
      const isAdminUser = session.user.email === "admin@goatjourney.com";

      if (isAdminUser) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        await supabase.auth.signOut();
        router.replace("/auth/login");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-muted-foreground">جاري التحقق...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col mr-0 lg:mr-64 transition-all">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
