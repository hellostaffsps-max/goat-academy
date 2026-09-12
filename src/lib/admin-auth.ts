import "server-only";
import { createClient } from "@/utils/supabase/server";
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user || user.app_metadata?.role !== "admin")
    throw new Error("غير مصرح: يتطلب حساب إدارة معتمداً");
  return { supabase, user };
}
