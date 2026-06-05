"use server";

import { createClient } from "@/utils/supabase/server";

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

function sanitizeSlug(title: string, existingSlug?: string): string {
  if (existingSlug) return existingSlug;
  let slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\u0600-\u06FFa-z0-9\-]/gi, "");
  if (!slug) slug = `path-${Date.now()}`;
  return slug;
}

export async function createLearningPath(path: LearningPathInput) {
  const supabase = await createClient();
  const payload = { ...path, slug: sanitizeSlug(path.title, path.slug) };
  const { data, error } = await supabase
    .from("learning_paths")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[createLearningPath] error:", error);
    throw new Error(error.message || "فشل إنشاء المسار");
  }
  return data;
}

export async function updateLearningPath(id: string, path: Partial<LearningPathInput>) {
  const supabase = await createClient();
  const payload: any = { ...path };
  if (path.slug !== undefined) payload.slug = sanitizeSlug(path.title || "", path.slug);
  const { data, error } = await supabase
    .from("learning_paths")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateLearningPath] error:", error);
    throw new Error(error.message || "فشل تحديث المسار");
  }
  return data;
}

export async function deleteLearningPath(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("learning_paths").delete().eq("id", id);

  if (error) throw error;
}
