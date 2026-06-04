"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useSupabaseLessons, useSupabaseLearningPaths } from "@/hooks/useSupabaseData";
import { learningPaths as fallbackPaths } from "@/data/coffeeData";
import {
  GraduationCap,
  ChevronLeft,
  Coffee,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Trophy,
  Lock,
  Star,
  Heart,
  Zap,
} from "lucide-react";
import { PathQuiz } from "@/components/coffee/PathQuiz";
import { BadgeCollection } from "@/components/badges/BadgeDisplay";
import { cn } from "@/lib/utils";

const pathIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee, Award, BookOpen, GraduationCap, Star, Heart, Zap,
};

export default function PathsPage() {
  const { isCompleted } = useStore();
  const { lessons } = useSupabaseLessons();
  const { paths: dbPaths, loading } = useSupabaseLearningPaths();
  const [quizPathId, setQuizPathId] = useState<string | null>(null);

  const learningPaths = dbPaths.length > 0
    ? dbPaths.map((p) => ({
        id: p.slug,
        title: p.title,
        lessonCount: p.lesson_count,
        description: p.description,
        lessons: p.lessons,
        icon: p.icon,
        color: p.color,
      }))
    : fallbackPaths;

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="text-right">
        <h2 className="text-xl font-bold text-foreground">
          مسارات التعلم
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          اختر مسارك وابدأ رحلتك في عالم القهوة
        </p>
      </div>

      {loading && dbPaths.length === 0 && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      )}

      <div className="space-y-6">
        {learningPaths.map((path, pathIdx) => {
          const Icon = pathIcons[path.icon || "Coffee"] || Coffee;
          const pathLessons = path.lessons
            .map((lid) => lessons.find((l) => l.slug === lid))
            .filter(Boolean);
          const completedInPath = pathLessons.filter((l) =>
            isCompleted(l!.slug)
          ).length;
          const progress =
            pathLessons.length > 0
              ? (completedInPath / pathLessons.length) * 100
              : 0;
          const isPathFullyCompleted = completedInPath === pathLessons.length && pathLessons.length > 0;

          return (
            <div
              key={path.id}
              className="rounded-2xl border border-border overflow-hidden bg-card"
            >
              {/* Path Header */}
              <div className={cn("p-5 text-right bg-gradient-to-br", path.color || "from-secondary via-background to-secondary/30")}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-foreground/80" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] bg-accent/20 text-accent-foreground border border-accent/10 font-semibold px-2.5 py-0.5 rounded-full">
                      {completedInPath}/{path.lessonCount} درس
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {path.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                  {path.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {Math.round(progress)}% مكتمل
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {completedInPath} من أصل {pathLessons.length}
                    </span>
                  </div>
                </div>

                {/* Path Quiz Action Button */}
                <div className="mt-4 pt-3 border-t border-border/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <button
                    disabled={!isPathFullyCompleted}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isPathFullyCompleted) return;
                      setQuizPathId(path.id);
                    }}
                    className={cn(
                      "w-full sm:w-auto text-[10px] font-bold py-2 px-3.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs",
                      isPathFullyCompleted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        : "bg-secondary text-muted-foreground/60 opacity-60 cursor-not-allowed border border-border/40"
                    )}
                  >
                    {isPathFullyCompleted ? (
                      <>
                        <Trophy className="w-3.5 h-3.5 text-accent animate-pulse" />
                        <span>بدء اختبار المسار وإصدار الشهادة</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-muted-foreground/80" />
                        <span>الاختبار مغلق (أكمل جميع الدروس لفتح الاختبار)</span>
                      </>
                    )}
                  </button>
                  <span className="text-[9px] text-muted-foreground leading-relaxed">
                    اجتز الاختبار بنسبة 80% للحصول على شهادة إكمال معتمدة
                  </span>
                </div>
              </div>

              {/* Lessons List */}
              <div className="bg-card divide-y divide-border/60 max-h-[400px] overflow-y-auto">
                {pathLessons.map((lesson) => {
                  if (!lesson) return null;
                  const completed = isCompleted(lesson.slug);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.slug}`}
                      className="block w-full p-4 text-right flex items-center gap-3 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/60" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={cn(
                            "text-xs font-semibold",
                            completed
                              ? "text-emerald-600 font-bold"
                              : "text-foreground"
                          )}
                        >
                          {lesson.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                          {lesson.description}
                        </p>
                      </div>
                      <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div className="bg-card border border-border rounded-xl p-5">
        <BadgeCollection />
      </div>

      {/* Summary */}
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <BookOpen className="w-6 h-6 text-foreground/75 mx-auto mb-2" />
        <p className="text-xs text-foreground font-semibold">
          {lessons.length}+ درس تعليمي
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          اختر مسارك أو تصفح حسب اهتمامك
        </p>
      </div>

      {quizPathId && (
        <PathQuiz
          pathId={quizPathId}
          onClose={() => setQuizPathId(null)}
        />
      )}

      <div className="h-4" />
    </div>
  );
}
