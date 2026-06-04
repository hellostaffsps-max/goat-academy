"use client";

import { useState, useEffect, useCallback } from "react";
import { getSiteContent, type ContentSection } from "@/actions/site-content";

export function useSiteContent<T extends Record<string, unknown>>(
  section: ContentSection,
  fallback: T
) {
  const [content, setContent] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const data = await getSiteContent(section);
      if (data) {
        setContent({ ...fallback, ...data } as T);
      }
    } catch (err) {
      console.warn(`Failed to fetch site content for ${section}, using fallback`, err);
    } finally {
      setLoading(false);
    }
  }, [section, fallback]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, refetch: fetchContent };
}
