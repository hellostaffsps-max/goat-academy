import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { privateMetadata } from "@/lib/seo";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
export const metadata = privateMetadata;
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/auth/login");
  }
  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 lg:mr-64">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
