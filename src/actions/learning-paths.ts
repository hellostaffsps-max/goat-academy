"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface LearningPathInput {
  slug: string;
  title: string;
  description: string;
  lessons: string[];
  lesson_count: number;
  icon: string;
  color: string;
  featured?: boolean;
}

export async function getLearningPaths() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getLearningPathBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createLearningPath(path: LearningPathInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learning_paths")
    .insert(path)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/paths");
  revalidatePath("/admin/paths");
  return data;
}

export async function updateLearningPath(id: string, path: Partial<LearningPathInput>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learning_paths")
    .update({ ...path, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/paths");
  revalidatePath("/admin/paths");
  return data;
}

export async function deleteLearningPath(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("learning_paths").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/paths");
  revalidatePath("/admin/paths");
}
