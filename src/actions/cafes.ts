"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { revalidateTag } from "next/cache";

export interface CafeInput {
  name: string;
  city: string;
  description: string;
  image?: string | null;
  date?: string;
}

export async function getCafes() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("cafes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCafe(cafe: CafeInput) {
  const { supabase } = await requireAdmin();
  const payload = {
    ...cafe,
    city: cafe.city || "",
  };
  const { data, error } = await supabase
    .from("cafes")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[createCafe] error:", error);
    throw new Error(error.message || "فشل إنشاء المقهى");
  }
  revalidateTag("public-content", { expire: 0 });
  return data;
}

export async function updateCafe(id: string, cafe: Partial<CafeInput>) {
  const { supabase } = await requireAdmin();
  const payload: Partial<CafeInput> = { ...cafe };
  if (cafe.city !== undefined) payload.city = cafe.city || "";

  const { data, error } = await supabase
    .from("cafes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateCafe] error:", error);
    throw new Error(error.message || "فشل تحديث المقهى");
  }
  revalidateTag("public-content", { expire: 0 });
  return data;
}

export async function deleteCafe(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("cafes").delete().eq("id", id);

  if (error) throw error;
  revalidateTag("public-content", { expire: 0 });
}
