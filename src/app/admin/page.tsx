"use client";

import { useState, useEffect, useCallback } from "react";
import { getLessons } from "@/actions/lessons";
import { getCafes } from "@/actions/cafes";
import { useStore } from "@/store/useStore";
import { categories } from "@/data/coffeeData";
import {
  BookOpen,
  Store,
  LayoutGrid,
  Heart,
  CheckCircle,
  Users,
} from "lucide-react";
import type { LessonRow, CafeRow } from "@/types/supabase";

export default function AdminDashboardPage() {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [cafes, setCafes] = useState<CafeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, completedLessons } = useStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lessonsData, cafesData] = await Promise.all([
        getLessons(),
        getCafes(),
      ]);
      setLessons(lessonsData);
      setCafes(cafesData);
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
      label: "التصنيفات",
      value: categories.length,
      icon: LayoutGrid,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
    {
      label: "المقاهي",
      value: cafes.length,
      icon: Store,
      color: "text-teal-600",
      bg: "bg-teal-500/10",
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
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "نسبة التقدم",
      value: lessons.length > 0 ? `${Math.round((completedLessons.length / lessons.length) * 100)}%` : "0%",
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {loading && (
        <div className="text-center py-4 text-muted-foreground text-sm">جاري تحميل البيانات...</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            {lessons.slice(0, 6).map((lesson) => (
              <div key={lesson.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">{lesson.title}</div>
                  <div className="text-xs text-muted-foreground">{lesson.subcategory}</div>
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

        {/* Recent cafes */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">المقاهي المضافة</h2>
          </div>
          <div className="divide-y divide-border">
            {cafes.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                لا توجد مقاهي مضافة بعد
              </div>
            ) : (
              cafes.slice(0, 6).map((cafe) => (
                <div key={cafe.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">{cafe.name}</div>
                    <div className="text-xs text-muted-foreground">{cafe.city}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground">
                    {cafe.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
