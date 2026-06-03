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
  content: string;
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
