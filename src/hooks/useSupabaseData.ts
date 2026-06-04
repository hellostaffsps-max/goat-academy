"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { LessonRow, ArticleRow, SuccessStoryRow, LearningPathRow } from "@/types/supabase";

// Lessons
export function useSupabaseLessons() {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setLessons(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { lessons, loading };
}

// Articles (Blog)
export function useSupabaseArticles() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setArticles(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { articles, loading };
}

// Success Stories
export function useSupabaseSuccessStories() {
  const [stories, setStories] = useState<SuccessStoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setStories(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { stories, loading };
}

// Learning Paths
export function useSupabaseLearningPaths() {
  const [paths, setPaths] = useState<LearningPathRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("learning_paths")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error) setPaths(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { paths, loading };
}
