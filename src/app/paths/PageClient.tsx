"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  useSupabaseLessons,
  useSupabaseLearningPaths,
} from "@/hooks/useSupabaseData";
import {
  GraduationCap,
  ChevronLeft,
  Coffee,
  Award,
  BookOpen,
  CheckCircle2,
  Trophy,
  Star,
  Heart,
  Zap,
  Calculator,
  Store,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { PathQuiz } from "@/components/coffee/PathQuiz";
import { BadgeCollection } from "@/components/badges/BadgeDisplay";
import { cn } from "@/lib/utils";
import { useLearningSearchParams } from "@/hooks/useLearningSearchParams";

const pathIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee,
  Award,
  BookOpen,
  GraduationCap,
  Star,
  Heart,
  Zap,
  Calculator,
  Store,
  TrendingUp,
};
export default function PathsPage() {
  const { completedLessons, quizPassed, initialized } = useStore();
  const { lessons } = useSupabaseLessons();
  const { paths } = useSupabaseLearningPaths();
  const { params, update } = useLearningSearchParams();
  const [quizPathId, setQuizPathId] = useState<string | null>(null);
  const selected = paths.find((path) => path.slug === params.get("path"));
  const pathLessons =
    selected?.lessons
      .map((slug) =>
        lessons.find((lesson) => lesson.slug === slug || lesson.id === slug),
      )
      .filter((lesson) => !!lesson) || [];
  const completeCount = pathLessons.filter((lesson) =>
    completedLessons.includes(lesson.slug),
  ).length;
  const nextLesson =
    pathLessons.find((lesson) => !completedLessons.includes(lesson.slug)) ||
    pathLessons[0];
  const allComplete =
    pathLessons.length > 0 && completeCount === pathLessons.length;
  const progress = pathLessons.length
    ? Math.round((completeCount / pathLessons.length) * 100)
    : 0;
  const renderLesson = (
    lesson: (typeof pathLessons)[number],
    index: number,
  ) => {
    const complete = completedLessons.includes(lesson.slug);
    return (
      <li key={lesson.slug}>
        <Link
          href={`/lesson/${lesson.slug}?path=${selected!.slug}`}
          className="flex items-center gap-3 px-4 sm:px-6 py-4 hover:bg-secondary transition-colors"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold"
            aria-label={`الدرس ${index + 1}`}
          >
            {complete ? (
              <CheckCircle2 className="w-5 h-5" aria-label="مكتمل" />
            ) : (
              index + 1
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base">
              {lesson.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {lesson.description}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {lesson.read_time}
              {complete && " · مكتمل"}
            </p>
          </div>
          <ChevronLeft className="w-5 h-5 shrink-0 text-muted-foreground" />
        </Link>
      </li>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-muted-foreground mb-3">
          تعلّم بخطوات مرتبة
        </p>
        <h1 className="heading-xl">اختر مسار التعلم المناسب لك</h1>
        <p className="text-base text-muted-foreground mt-4 leading-relaxed">
          من أول كوب إلى إدارة المقهى: اختر هدفك، تابع الدروس بالترتيب، ثم اختبر
          فهمك. يمكنك الانتقال بين المسارات في أي وقت.
        </p>
      </header>
      <div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-label="مسارات التعلم المتاحة"
      >
        {paths.map((path) => {
          const Icon = pathIcons[path.icon || "Coffee"] || Coffee;
          const available = path.lessons.filter((slug) =>
            lessons.some(
              (lesson) => lesson.slug === slug || lesson.id === slug,
            ),
          );
          const count = available.filter((slug) =>
            completedLessons.includes(slug),
          ).length;
          const active = selected?.slug === path.slug;
          return (
            <a
              key={path.slug}
              href={`/paths?path=${path.slug}`}
              aria-current={active ? "true" : undefined}
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                update({ path: path.slug });
                requestAnimationFrame(() =>
                  document
                    .getElementById("selected-path")
                    ?.scrollIntoView({ block: "start" }),
                );
              }}
              className={cn(
                "rounded-2xl border p-5 flex flex-col gap-3 transition-colors",
                active
                  ? "bg-accent/15 border-foreground"
                  : "bg-card border-border hover:bg-secondary",
              )}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-6 h-6" />
                <span className="text-xs text-muted-foreground">
                  {available.length} درس{count > 0 ? ` · أنجزت ${count}` : ""}
                </span>
              </div>
              <h2 className="text-lg font-bold">{path.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {path.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                {active
                  ? "المسار المحدد"
                  : count
                    ? "متابعة هذا المسار"
                    : "استعرض المسار"}
                <ArrowLeft className="w-4 h-4" />
              </span>
            </a>
          );
        })}
      </div>

      {selected && (
        <section
          key={selected.slug}
          id="selected-path"
          className="scroll-mt-44 rounded-2xl border border-border bg-card overflow-hidden"
          aria-labelledby="path-title"
        >
          <header className="p-5 sm:p-7 bg-secondary/40 space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  مسارك الحالي
                </p>
                <h2 id="path-title" className="text-2xl font-bold">
                  {selected.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => update({ path: null })}
                className="min-h-11 text-sm px-3 rounded-lg border border-border hover:bg-secondary"
              >
                إغلاق التفاصيل
              </button>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {selected.description}
            </p>
            <div>
              <div className="flex flex-wrap justify-between gap-2 mb-2 text-sm">
                <span>
                  أنجزت {completeCount} من {pathLessons.length} درس
                </span>
                <span>{progress}% مكتمل</span>
              </div>
              <div
                role="progressbar"
                aria-label="تقدم المسار"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 rounded-full bg-border overflow-hidden"
              >
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {nextLesson && (
              <Link
                href={`/lesson/${nextLesson.slug}?path=${selected.slug}`}
                className="btn-premium inline-flex"
              >
                <BookOpen className="w-4 h-4" />
                {allComplete
                  ? "راجع الدروس"
                  : completeCount
                    ? "تابع من حيث وصلت"
                    : "ابدأ أول درس"}
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <p className="text-xs text-muted-foreground">
              عند الانتهاء من كل درس، اضغط «أكملت قراءة هذا الدرس» لحفظ تقدمك.
            </p>
          </header>
          <ol className="divide-y divide-border">
            {pathLessons.slice(0, 8).map(renderLesson)}
          </ol>
          {pathLessons.length > 8 && (
            <details className="border-t border-border">
              <summary className="cursor-pointer min-h-12 p-4 sm:px-6 text-sm font-semibold hover:bg-secondary">
                عرض بقية الدروس ({pathLessons.length - 8})
              </summary>
              <ol start={9} className="divide-y divide-border">
                {pathLessons
                  .slice(8)
                  .map((lesson, index) => renderLesson(lesson, index + 8))}
              </ol>
            </details>
          )}
          <div className="p-5 sm:p-6 border-t border-border bg-secondary/20 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <h3 className="text-lg font-bold">اختبار نهاية المسار</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {allComplete
                ? "أكملت الدروس. اختبر فهمك الآن؛ اجتياز 80% يتيح لك شهادة إكمال من الأكاديمية."
                : `بقي ${pathLessons.length - completeCount} درس لفتح الاختبار. تعلّم بالسرعة المناسبة لك.`}
            </p>
            {quizPassed.includes(selected.slug) && (
              <p className="inline-flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                اجتزت هذا الاختبار
              </p>
            )}
            <button
              type="button"
              disabled={!initialized || !allComplete}
              onClick={() => setQuizPathId(selected.slug)}
              className="min-h-12 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              {quizPassed.includes(selected.slug)
                ? "إعادة الاختبار وإصدار الشهادة"
                : "ابدأ اختبار المسار"}
            </button>
          </div>
        </section>
      )}

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">تبحث عن موضوع محدد؟</h2>
          <p className="text-sm text-muted-foreground mt-2">
            استكشف {lessons.length} درساً حسب الموضوع والمستوى.
          </p>
        </div>
        <Link href="/courses" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-secondary">
          مكتبة الدروس <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
      <details className="rounded-2xl border border-border bg-card p-5">
        <summary className="cursor-pointer min-h-11 font-semibold">
          إنجازاتي في الأكاديمية
        </summary>
        <BadgeCollection />
      </details>
      {quizPathId && (
        <PathQuiz pathId={quizPathId} onClose={() => setQuizPathId(null)} />
      )}
    </div>
  );
}
