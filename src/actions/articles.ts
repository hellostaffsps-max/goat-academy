"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
  const { data, error } = await supabase
    .from("articles")
    .insert(article)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return data;
}

export async function updateArticle(id: string, article: Partial<ArticleInput>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .update({ ...article, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return data;
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
