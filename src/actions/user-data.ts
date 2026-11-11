"use server";

import { createClient } from "@/utils/supabase/server";

async function lessonAliases(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
) {
  const { data, error } = await supabase
    .from("lessons")
    .select("id,slug")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data && data.id !== slug ? [slug, data.id] : [slug];
}

// Favorites
export async function getUserFavorites() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_favorites")
    .select("lesson_slug")
    .eq("user_id", user.id);

  if (error) throw error;
  return (data || []).map((d) => d.lesson_slug);
}

export async function toggleUserFavorite(
  lessonSlug: string,
  expectedUserId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== expectedUserId)
    throw new Error("Account changed; reload your learning state.");

  const aliases = await lessonAliases(supabase, lessonSlug);
  const { data: existing, error: lookupError } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", user.id)
    .in("lesson_slug", aliases);
  if (lookupError) throw lookupError;
  if (existing?.length) {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", user.id)
      .in(
        "id",
        existing.map((row) => row.id),
      );
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_progress")
    .select("lesson_slug")
    .eq("user_id", user.id);

  if (error) throw error;
  return (data || []).map((d) => d.lesson_slug);
}

export async function toggleUserProgress(
  lessonSlug: string,
  expectedUserId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== expectedUserId)
    throw new Error("Account changed; reload your learning state.");

  const aliases = await lessonAliases(supabase, lessonSlug);
  const { data: existing, error: lookupError } = await supabase
    .from("user_progress")
    .select("id")
    .eq("user_id", user.id)
    .in("lesson_slug", aliases);
  if (lookupError) throw lookupError;
  if (existing?.length) {
    const { error } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id)
      .in(
        "id",
        existing.map((row) => row.id),
      );
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function updateUserSettings(
  settings: {
    fontSize?: "small" | "medium" | "large";
    reducedMotion?: boolean;
  },
  expectedUserId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== expectedUserId)
    throw new Error("Account changed; reload your learning state.");

  const { error } = await supabase.from("user_settings").upsert({
    user_id: user.id,
    font_size: settings.fontSize,
    reduced_motion: settings.reducedMotion,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

// Resolve the current account before loading browser-specific learning data.
// This keeps guest progress separate from each signed-in account on shared devices.
export async function getUserLearningSnapshot() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError && authError.name !== "AuthSessionMissingError")
    throw authError;
  if (!user)
    return { userId: null, favorites: [], progress: [], settings: null };
  const [favorites, progress, settings, catalog] = await Promise.all([
    supabase
      .from("user_favorites")
      .select("lesson_slug")
      .eq("user_id", user.id),
    supabase.from("user_progress").select("lesson_slug").eq("user_id", user.id),
    supabase
      .from("user_settings")
      .select("font_size,reduced_motion")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("lessons").select("id,slug"),
  ]);
  if (favorites.error) throw favorites.error;
  if (progress.error) throw progress.error;
  if (settings.error) throw settings.error;
  if (catalog.error) throw catalog.error;
  const byId = new Map(
    (catalog.data || []).map((lesson) => [lesson.id, lesson.slug]),
  );
  const canonical = (value: string) => byId.get(value) || value;
  return {
    userId: user.id,
    favorites: [
      ...new Set(
        (favorites.data || []).map((item) => canonical(item.lesson_slug)),
      ),
    ],
    progress: [
      ...new Set(
        (progress.data || []).map((item) => canonical(item.lesson_slug)),
      ),
    ],
    settings: settings.data,
  };
}

// Reset only the verified account. Settings already permit owner INSERT/UPDATE;
// keeping the row avoids depending on a separate DELETE policy for that table.
export async function resetUserLearningData(expectedUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.id !== expectedUserId)
    throw new Error("Account changed; reload your learning state.");

  const [favorites, progress, settings] = await Promise.all([
    supabase.from("user_favorites").delete().eq("user_id", user.id),
    supabase.from("user_progress").delete().eq("user_id", user.id),
    supabase
      .from("user_settings")
      .upsert(
        {
          user_id: user.id,
          font_size: "medium",
          reduced_motion: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select("user_id,font_size,reduced_motion")
      .single(),
  ]);
  if (favorites.error) throw favorites.error;
  if (progress.error) throw progress.error;
  if (settings.error) throw settings.error;
  if (
    settings.data?.user_id !== user.id ||
    settings.data.font_size !== "medium" ||
    settings.data.reduced_motion !== false
  )
    throw new Error("Settings reset could not be confirmed.");
}
