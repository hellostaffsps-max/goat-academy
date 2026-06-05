"use server";

import { createClient } from "@/utils/supabase/server";

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

function sanitizeSlug(title: string, existingSlug?: string): string {
  if (existingSlug) return existingSlug;
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9\-]/gi, "");
  if (!slug) {
    slug = `lesson-${Date.now()}`;
  }
  return slug;
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

  const { data: byId } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", idOrSlug)
    .maybeSingle();

  if (byId) return byId;

  const { data: bySlug } = await supabase
    .from("lessons")
    .select("*")
    .eq("slug", idOrSlug)
    .maybeSingle();

  if (bySlug) return bySlug;

  const { data: bySlugLike } = await supabase
    .from("lessons")
    .select("*")
    .ilike("slug", idOrSlug)
    .maybeSingle();

  return bySlugLike || null;
}

export async function createLesson(lesson: LessonInput) {
  const supabase = await createClient();

  const payload = {
    ...lesson,
    slug: sanitizeSlug(lesson.title, lesson.slug),
    subcategory: lesson.subcategory || "عام",
    tags: lesson.tags?.length ? lesson.tags : [],
    path: lesson.path || null,
  };

  console.log("[createLesson] payload:", JSON.stringify(payload, null, 2));

  const { data, error } = await supabase
    .from("lessons")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[createLesson] Supabase error:", error);
    throw new Error(error.message || "فشل إنشاء الدرس");
  }
  return data;
}

export async function updateLesson(id: string, lesson: Partial<LessonInput>) {
  const supabase = await createClient();

  const payload: any = { ...lesson };
  if (lesson.slug !== undefined) {
    payload.slug = sanitizeSlug(lesson.title || "", lesson.slug);
  }
  if (lesson.tags !== undefined) {
    payload.tags = lesson.tags?.length ? lesson.tags : [];
  }
  if (lesson.path !== undefined) {
    payload.path = lesson.path || null;
  }

  console.log("[updateLesson] payload:", JSON.stringify(payload, null, 2));

  const { data, error } = await supabase
    .from("lessons")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateLesson] Supabase error:", error);
    throw new Error(error.message || "فشل تحديث الدرس");
  }
  return data;
}

export async function deleteLesson(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);

  if (error) throw error;
}
