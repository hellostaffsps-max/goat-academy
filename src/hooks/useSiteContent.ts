"use client";
import { usePublicContent } from "@/components/PublicContentProvider";
export function useSiteContent<T extends Record<string, unknown>>(
  section: string,
  fallback: T,
) {
  const { siteContent } = usePublicContent();
  return {
    content: { ...fallback, ...siteContent?.[section] } as T,
    loading: false,
  };
}
