"use client";
import { usePublicContent } from "@/components/PublicContentProvider";
// Public pages receive their content on the server; no duplicate browser fetch or empty first render.
export function useSupabaseLessons() {
  return { lessons: usePublicContent().lessons ?? [], loading: false };
}
export function useSupabaseArticles() {
  return { articles: usePublicContent().articles ?? [], loading: false };
}
export function useSupabaseSuccessStories() {
  return { stories: usePublicContent().stories ?? [], loading: false };
}
export function useSupabaseLearningPaths() {
  return { paths: usePublicContent().paths ?? [], loading: false };
}
