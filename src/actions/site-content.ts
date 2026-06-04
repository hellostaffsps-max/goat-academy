"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ContentSection =
  | "hero_section"
  | "founder_section"
  | "paths_section"
  | "success_stories"
  | "tools_section"
  | "resources_section";

export async function getSiteContent(section: ContentSection): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", section)
    .single();

  if (error || !data) return null;
  try {
    return JSON.parse(data.value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function updateSiteContent(
  section: ContentSection,
  content: Record<string, unknown>
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("admin_settings")
    .upsert(
      {
        key: section,
        value: JSON.stringify(content),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/site-content");
  return true;
}

export async function getAllSiteContent(): Promise<Record<ContentSection, Record<string, unknown> | null>> {
  const sections: ContentSection[] = [
    "hero_section",
    "founder_section",
    "paths_section",
    "success_stories",
    "tools_section",
    "resources_section",
  ];

  const result = {} as Record<ContentSection, Record<string, unknown> | null>;

  for (const section of sections) {
    result[section] = await getSiteContent(section);
  }

  return result;
}
