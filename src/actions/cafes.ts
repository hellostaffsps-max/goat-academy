"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface CafeInput {
  name: string;
  city: string;
  description: string;
  image?: string;
  date: string;
}

export async function getCafes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cafes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCafe(cafe: CafeInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cafes")
    .insert(cafe)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/cafes");
  return data;
}

export async function updateCafe(id: string, cafe: Partial<CafeInput>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cafes")
    .update({ ...cafe, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/cafes");
  return data;
}

export async function deleteCafe(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("cafes").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/cafes");
}
