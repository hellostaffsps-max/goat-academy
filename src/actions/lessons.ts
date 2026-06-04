"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface LessonInput {
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  rating: number;
  tags: string[];
  read_time: string;
  difficulty: string;
  path?: string | null;
  content: string;
  image?: string | null;
}

export async function getLessons() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getLessonBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getLessonByIdOrSlug(idOrSlug: string) {
  const supabase = await createClient();

  // Try by id first (UUID)
  const { data: byId, error: idError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", idOrSlug)
    .maybeSingle();

  if (byId) return byId;

  // Try by slug
  const { data: bySlug, error: slugError } = await supabase
    .from("lessons")
    .select("*")
    .eq("slug", idOrSlug)
    .maybeSingle();

  if (bySlug) return bySlug;

  // Try ilike for slug
  const { data: bySlugLike, error: slugLikeError } = await supabase
    .from("lessons")
    .select("*")
    .ilike("slug", idOrSlug)
    .maybeSingle();

  return bySlugLike || null;
}

export async function createLesson(lesson: LessonInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .insert(lesson)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/admin/lessons");
  return data;
}

export async function updateLesson(id: string, lesson: Partial<LessonInput>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .update({ ...lesson, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/admin/lessons");
  return data;
}

export async function deleteLesson(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/admin/lessons");
}
