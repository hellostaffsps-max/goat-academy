"use client";

import { useState, useEffect, useCallback } from "react";
import { getLessons } from "@/actions/lessons";
import { getCafes } from "@/actions/cafes";
import { lessons as fallbackLessons, type Lesson } from "@/data/coffeeData";
import type { LessonRow, CafeRow } from "@/types/supabase";

function mapLessonRow(l: LessonRow): Lesson {
  return {
    id: l.slug,
    title: l.title,
    category: l.category,
    subcategory: l.subcategory,
    description: l.description,
    rating: l.rating,
    tags: l.tags || [],
    readTime: l.read_time,
    difficulty: l.difficulty,
    content: l.content,
  };
}

export function useSupabaseLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(fallbackLessons);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    try {
      const data = await getLessons();
      if (data && data.length > 0) {
        setLessons(data.map(mapLessonRow));
      }
    } catch (err) {
      console.warn("Failed to fetch lessons from Supabase, using fallback", err);
      setError("فشل الاتصال بالخادم، يتم استخدام البيانات المحلية");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return { lessons, loading, error, refetch: fetchLessons };
}

export function useSupabaseCafes() {
  const [cafes, setCafes] = useState<CafeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCafes = useCallback(async () => {
    try {
      const data = await getCafes();
      setCafes(data);
    } catch (err) {
      console.warn("Failed to fetch cafes from Supabase", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  return { cafes, loading, refetch: fetchCafes };
}
