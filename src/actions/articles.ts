"use server";

import { createClient } from "@/utils/supabase/server";

export interface ArticleInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  category_label: string;
  tags: string[];
  read_time: string;
  date: string;
  author: string;
  image?: string | null;
}

function sanitizeSlug(title: string, existingSlug?: string): string {
  if (existingSlug) return existingSlug;
  let slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\u0600-\u06FFa-z0-9\-]/gi, "");
  if (!slug) slug = `article-${Date.now()}`;
  return slug;
}

export async function getArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createArticle(article: ArticleInput) {
  const supabase = await createClient();
  const payload = {
    ...article,
    slug: sanitizeSlug(article.title, article.slug),
    tags: article.tags?.length ? article.tags : [],
  };
  const { data, error } = await supabase
    .from("articles")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[createArticle] error:", error);
    throw new Error(error.message || "فشل إنشاء المقال");
  }
  return data;
}

export async function updateArticle(id: string, article: Partial<ArticleInput>) {
  const supabase = await createClient();
  const payload: any = { ...article };
  if (article.slug !== undefined) payload.slug = sanitizeSlug(article.title || "", article.slug);
  if (article.tags !== undefined) payload.tags = article.tags?.length ? article.tags : [];

  const { data, error } = await supabase
    .from("articles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateArticle] error:", error);
    throw new Error(error.message || "فشل تحديث المقال");
  }
  return data;
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) throw error;
}
