"use client";

import { useState, useEffect, useCallback } from "react";
import { getLessons } from "@/actions/lessons";
import { getCafes } from "@/actions/cafes";
import { getArticles } from "@/actions/articles";
import { getSuccessStories } from "@/actions/success-stories";
import { getLearningPaths } from "@/actions/learning-paths";
import { useStore } from "@/store/useStore";
import { categories } from "@/data/coffeeData";
import {
  BookOpen,
  Store,
  LayoutGrid,
  Heart,
  Check,
  Users,
  Newspaper,
  Trophy,
  Route,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [cafes, setCafes] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, completedLessons } = useStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lessonsData, cafesData, articlesData, storiesData, pathsData] = await Promise.all([
        getLessons(),
        getCafes(),
        getArticles(),
        getSuccessStories(),
        getLearningPaths(),
      ]);
      setLessons(lessonsData);
      setCafes(cafesData);
      setArticles(articlesData);
      setStories(storiesData);
      setPaths(pathsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = [
    {
      label: "إجمالي الدروس",
      value: lessons.length,
      icon: BookOpen,
      color: "text-sky-600",
      bg: "bg-sky-500/10",
    },
    {
      label: "المقالات",
      value: articles.length,
      icon: Newspaper,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
    {
      label: "قصص النجاح",
      value: stories.length,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "مسارات التعلم",
      value: paths.length,
      icon: Route,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      label: "التصنيفات",
      value: categories.length,
      icon: LayoutGrid,
      color: "text-teal-600",
      bg: "bg-teal-500/10",
    },
    {
      label: "المقاهي",
      value: cafes.length,
      icon: Store,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "المفضلة",
      value: favorites.length,
      icon: Heart,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
    {
      label: "دروس مكتملة",
      value: completedLessons.length,
      icon: Check,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {loading && (
        <div className="text-center py-4 text-muted-foreground text-sm">جاري تحميل البيانات...</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-4 flex items-start gap-3"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent lessons */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">آخر الدروس</h2>
          </div>
          <div className="divide-y divide-border">
            {lessons.slice(0, 6).map((lesson: any) => (
              <div key={lesson.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {lesson.image ? (
                    <img src={lesson.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">لا توجد</div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-foreground">{lesson.title}</div>
                    <div className="text-xs text-muted-foreground">{lesson.subcategory}</div>
                  </div>
                </div>
                <div className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground">
                  {lesson.rating}
                </div>
              </div>
            ))}
            {lessons.length === 0 && !loading && (
              <div className="p-8 text-center text-sm text-muted-foreground">لا توجد دروس</div>
            )}
          </div>
        </div>

        {/* Recent articles */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">آخر المقالات</h2>
          </div>
          <div className="divide-y divide-border">
            {articles.slice(0, 6).map((article: any) => (
              <div key={article.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {article.image ? (
                    <img src={article.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">لا توجد</div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-foreground">{article.title}</div>
                    <div className="text-xs text-muted-foreground">{article.category_label}</div>
                  </div>
                </div>
                <div className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground">
                  {article.date}
                </div>
              </div>
            ))}
            {articles.length === 0 && !loading && (
              <div className="p-8 text-center text-sm text-muted-foreground">لا توجد مقالات</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
