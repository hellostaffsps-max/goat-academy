"use server";

import { createClient } from "@/utils/supabase/server";

export interface SuccessStoryInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  location: string;
  image?: string | null;
  featured?: boolean;
}

function sanitizeSlug(title: string, existingSlug?: string): string {
  if (existingSlug) return existingSlug;
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9\-]/gi, "");
  if (!slug) {
    slug = `story-${Date.now()}`;
  }
  return slug;
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

  const payload = {
    ...story,
    slug: sanitizeSlug(story.title, story.slug),
    location: story.location || "",
  };

  const { data, error } = await supabase
    .from("success_stories")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[createSuccessStory] error:", error);
    throw new Error(error.message || "فشل إنشاء القصة");
  }
  return data;
}

export async function updateSuccessStory(id: string, story: Partial<SuccessStoryInput>) {
  const supabase = await createClient();

  const payload: any = { ...story };
  if (story.slug !== undefined) {
    payload.slug = sanitizeSlug(story.title || "", story.slug);
  }

  const { data, error } = await supabase
    .from("success_stories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateSuccessStory] error:", error);
    throw new Error(error.message || "فشل تحديث القصة");
  }
  return data;
}

export async function deleteSuccessStory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("success_stories").delete().eq("id", id);

  if (error) throw error;
}
