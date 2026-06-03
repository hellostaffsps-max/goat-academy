"use server";

import { createClient } from "@/utils/supabase/server";

// Favorites
export async function getUserFavorites() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_favorites")
    .select("lesson_slug")
    .eq("user_id", user.id);

  if (error) throw error;
  return (data || []).map((d) => d.lesson_slug);
}

export async function toggleUserFavorite(lessonSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_slug", lessonSlug)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("user_favorites")
      .insert({ user_id: user.id, lesson_slug: lessonSlug });
    if (error) throw error;
    return true;
  }
}

// Progress
export async function getUserProgress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_progress")
    .select("lesson_slug")
    .eq("user_id", user.id);

  if (error) throw error;
  return (data || []).map((d) => d.lesson_slug);
}

export async function toggleUserProgress(lessonSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("user_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_slug", lessonSlug)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("user_progress")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("user_progress")
      .insert({ user_id: user.id, lesson_slug: lessonSlug });
    if (error) throw error;
    return true;
  }
}

// Settings
export async function getUserSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function updateUserSettings(settings: {
  fontSize?: "small" | "medium" | "large";
  reducedMotion?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: user.id,
      font_size: settings.fontSize,
      reduced_motion: settings.reducedMotion,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}
