import "server-only";
import { localStories } from "@/data/successStories";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { lessons, learningPaths } from "@/data/coffeeData";
import { articles } from "@/data/blogData";
import type {
  PublicLesson,
  PublicArticle,
  PublicPath,
  SiteContent,
} from "./public-types";
import type { SuccessStoryRow } from "@/types/supabase";

// This client never reads cookies or a service-role key. Only public, RLS-filtered content is cached.
async function readTable<T>(table: string): Promise<T[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(12000) }),
    },
  });
  const rows: T[] = [];
  for (let offset = 0; ; offset += 500) {
    const query = client
      .from(table)
      .select("*")
      .order("id")
      .range(offset, offset + 499);
    // Never expose settings unrelated to public page copy (e.g. the legacy admin_password).
    const { data, error } =
      table === "admin_settings"
        ? await query.in("key", [
            "hero_section",
            "founder_section",
            "paths_section",
            "success_stories",
            "tools_section",
            "resources_section",
          ])
        : await query;
    if (error)
      throw new Error(`Public content unavailable: ${table} (${error.code})`);
    rows.push(...(data as T[]));
    if (data.length < 500) return rows;
  }
}
export const getPublicLessons = cache(
  unstable_cache(
    async (): Promise<PublicLesson[]> => {
      const data = await readTable<PublicLesson>("lessons");
      return (
        data ??
        lessons.map((l) => ({
          ...l,
          slug: l.id,
          read_time: l.readTime || "",
          difficulty: l.difficulty || "",
          path: null,
          image: l.image || null,
        }))
      );
    },
    ["public-lessons-v2"],
    { revalidate: 300, tags: ["public-content"] },
  ),
);
export const getPublicArticles = cache(
  unstable_cache(
    async (): Promise<PublicArticle[]> => {
      return (
        (await readTable<PublicArticle>("articles")) ??
        articles.map((a) => ({ ...a, slug: a.slug || a.id, image: null }))
      );
    },
    ["public-articles-v2"],
    { revalidate: 300, tags: ["public-content"] },
  ),
);
export const getPublicPaths = cache(
  unstable_cache(
    async (): Promise<PublicPath[]> => {
      return (
        (await readTable<PublicPath>("learning_paths")) ??
        learningPaths.map((p) => ({
          ...p,
          slug: p.id,
          lesson_count: p.lessonCount,
          icon: p.icon || "Coffee",
          color: p.color || "",
          featured: false,
        }))
      );
    },
    ["public-paths-v2"],
    { revalidate: 300, tags: ["public-content"] },
  ),
);
export const getPublicStories = cache(
  unstable_cache(
    async () =>
      (await readTable<SuccessStoryRow>("success_stories")) ??
      localStories.map((s) => ({ ...s, created_at: "", updated_at: "" })),
    ["public-stories-v2"],
    { revalidate: 300, tags: ["public-content"] },
  ),
);
export const getPublicSiteContent = cache(
  unstable_cache(
    async (): Promise<SiteContent> => {
      const data = await readTable<{ key: string; value: string }>(
        "admin_settings",
      );
      const result: SiteContent = {};
      for (const row of data ?? []) {
        try {
          const v = JSON.parse(row.value);
          if (v && typeof v === "object" && !Array.isArray(v))
            result[row.key] = v;
        } catch {
          /* malformed copy uses component defaults */
        }
      }
      return result;
    },
    ["public-site-copy-v2"],
    { revalidate: 300, tags: ["public-content"] },
  ),
);
export const getPublicLesson = cache(async (id: string) =>
  (await getPublicLessons()).find((l) => l.slug === id || l.id === id),
);
export const getPublicArticle = cache(async (id: string) =>
  (await getPublicArticles()).find((a) => a.slug === id || a.id === id),
);
