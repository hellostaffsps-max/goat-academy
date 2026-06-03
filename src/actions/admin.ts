"use server";

import { createClient } from "@/utils/supabase/server";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", "admin_password")
    .single();

  if (error || !data) return false;
  return data.value === password;
}

export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const supabase = await createClient();

  // Verify current password
  const { data, error } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", "admin_password")
    .single();

  if (error || !data || data.value !== currentPassword) return false;

  // Update password
  const { error: updateError } = await supabase
    .from("admin_settings")
    .update({ value: newPassword, updated_at: new Date().toISOString() })
    .eq("key", "admin_password");

  return !updateError;
}
