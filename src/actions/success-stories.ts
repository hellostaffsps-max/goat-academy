"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface SuccessStoryInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  location: string;
  image?: string | null;
  featured?: boolean;
}

export async function getSuccessStories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("success_stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getFeaturedStories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("success_stories")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createSuccessStory(story: SuccessStoryInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("success_stories")
    .insert(story)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/success-stories");
  revalidatePath("/admin/success-stories");
  return data;
}

export async function updateSuccessStory(id: string, story: Partial<SuccessStoryInput>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("success_stories")
    .update({ ...story, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/success-stories");
  revalidatePath("/admin/success-stories");
  return data;
}

export async function deleteSuccessStory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("success_stories").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/success-stories");
  revalidatePath("/admin/success-stories");
}
