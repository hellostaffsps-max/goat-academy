"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, GraduationCap, BookOpen, Sparkles, Star, Coffee, Store, TrendingUp } from "lucide-react";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import { LessonCard } from "@/components/cards/LessonCard";
import {
  trackLabels,
  trackDescriptions,
  getTrackForCategory,
  levelLabels,
  type LearningTrack,
  type DifficultyLevel,
} from "@/lib/trackMapping";
import { getLessonNavigation } from "@/lib/lessonNavigation";

type DurationFilter = "all" | "short" | "medium" | "long" | "theory";
type TypeFilter = "all" | "theory" | "practical" | "admin";

const durationLabels: Record<DurationFilter, string> = {
  all: "الكل",
  short: "أقل من دقيقة",
  medium: "1-3 دقائق",
  long: "3-5 دقائق",
  theory: "دروس نظرية",
};

const typeLabels: Record<TypeFilter, string> = {
  all: "الكل",
  theory: "نظري",
  practical: "عملي",
  admin: "إداري",
};

// Categorize lesson type based on category
function getLessonType(category: string): TypeFilter {
  if (["drinks", "homebrew"].includes(category)) return "practical";
  if (["cafe", "costing", "equipment"].includes(category)) return "admin";
  return "theory";
}

function getDurationCategory(readTime?: string): DurationFilter {
  if (!readTime) return "theory";
  const t = readTime.toLowerCase();
  if (t.includes("ساع") || t.includes("h")) return "long";
  if (t.includes("دق") || t.includes("m")) {
    const num = parseInt(t);
    if (isNaN(num)) return "medium";
    if (num <= 1) return "short";
    if (num <= 3) return "medium";
    return "long";
  }
  if (t.includes("ث") || t.includes("s")) return "short";
  return "theory";
}

function CoursesPageContent() {
  const { lessons, loading } = useSupabaseLessons();
  const searchParams = useSearchParams();
  const urlTrack = searchParams.get("track") as LearningTrack | null;

  const [activeTrack, setActiveTrack] = useState<LearningTrack>(urlTrack || "all");
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel>("all");
  const [activeDuration, setActiveDuration] = useState<DurationFilter>("all");
  const [activeType, setActiveType] = useState<TypeFilter>("all");

  const tracks: LearningTrack[] = ["all", "barista", "startup", "growth"];
  const levels: DifficultyLevel[] = ["all", "beginner", "intermediate", "advanced"];
  const durations: DurationFilter[] = ["all", "short", "medium", "long", "theory"];
  const types: TypeFilter[] = ["all", "theory", "practical", "admin"];

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const track = getTrackForCategory(lesson.category);
      const trackMatch = activeTrack === "all" || track === activeTrack;
      const levelMatch = activeLevel === "all" || lesson.difficulty === levelLabels[activeLevel];
      const durationMatch = activeDuration === "all" || getDurationCategory(lesson.readTime) === activeDuration;
      const typeMatch = activeType === "all" || getLessonType(lesson.category) === activeType;
      return trackMatch && levelMatch && durationMatch && typeMatch;
    });
  }, [lessons, activeTrack, activeLevel, activeDuration, activeType]);

  // Beginner lessons for "Start Here" section
  const beginnerLessons = useMemo(() => {
    return lessons
      .filter((l) => {
        const level = l.difficulty;
        return level === "أساسي" || level === "سهل" || level === "مبتدئ" || level === "نظيفة" || level === "بارد";
      })
      .slice(0, 4);
  }, [lessons]);

  // Popular lessons (highest rating)
  const popularLessons = useMemo(() => {
    return [...lessons].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [lessons]);

  const trackIcons: Record<LearningTrack, React.ReactNode> = {
    all: <Sparkles className="w-3.5 h-3.5" />,
    barista: <Coffee className="w-3.5 h-3.5" />,
    startup: <Store className="w-3.5 h-3.5" />,
    growth: <TrendingUp className="w-3.5 h-3.5" />,
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
          <GraduationCap className="w-3.5 h-3.5" />
          الدورات التدريبية
        </div>
        <h1 className="heading-xl mb-3">دورات القهوة المختصة</h1>
        <p className="body-base text-muted-foreground max-w-xl mx-auto">
          دورات عملية من المبتدئين إلى المتقدمين
        </p>
      </section>

      {/* Start Here Section */}
      {!loading && beginnerLessons.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-premium p-5 border-l-4 border-l-accent">
            <div className="flex items-center gap-2 mb-4 text-right">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <h2 className="text-sm font-bold text-foreground">⭐ ابدأ من هنا (للمبتدئين)</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {beginnerLessons.map((lesson, i) => {
                const nav = getLessonNavigation(lesson.id);
                return (
                  <LessonCard
                    key={lesson.id}
                    id={lesson.id}
                    title={lesson.title}
                    category={lesson.category}
                    subcategory={lesson.subcategory}
                    description={lesson.description}
                    readTime={lesson.readTime}
                    difficulty={lesson.difficulty}
                    index={i}
                    lessonIndex={nav.lessonIndex || undefined}
                    totalLessons={nav.totalLessons || undefined}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Popular Section */}
      {!loading && popularLessons.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4 text-right">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-foreground">📊 الأكثر زيارة هذا الشهر</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularLessons.map((lesson, i) => {
              const nav = getLessonNavigation(lesson.id);
              return (
                <LessonCard
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  category={lesson.category}
                  subcategory={lesson.subcategory}
                  description={lesson.description}
                  readTime={lesson.readTime}
                  difficulty={lesson.difficulty}
                  index={i}
                  lessonIndex={nav.lessonIndex || undefined}
                  totalLessons={nav.totalLessons || undefined}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 text-right">الفلتر حسب المسار:</h3>
            <div className="flex flex-wrap gap-2">
              {tracks.map((track) => (
                <button
                  key={track}
                  onClick={() => setActiveTrack(track)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                    activeTrack === track
                      ? "bg-accent text-white border-accent"
                      : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                  }`}
                  title={trackDescriptions[track]}
                >
                  {trackIcons[track]}
                  {trackLabels[track]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 text-right">حسب المستوى:</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    activeLevel === level
                      ? "bg-accent text-white border-accent"
                      : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {levelLabels[level]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 text-right">حسب المدة:</h3>
              <div className="flex flex-wrap gap-2">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDuration(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      activeDuration === d
                        ? "bg-accent text-white border-accent"
                        : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                    }`}
                  >
                    {durationLabels[d]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 text-right">حسب النوع:</h3>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      activeType === t
                        ? "bg-accent text-white border-accent"
                        : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                    }`}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground">
              {filteredLessons.length} درس
            </span>
            <h2 className="text-sm font-bold text-foreground">جميع الدورات</h2>
          </div>

          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد دورات مطابقة للفلتر المحدد</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLessons.map((lesson, i) => {
                const nav = getLessonNavigation(lesson.id);
                return (
                  <LessonCard
                    key={lesson.id}
                    id={lesson.id}
                    title={lesson.title}
                    category={lesson.category}
                    subcategory={lesson.subcategory}
                    description={lesson.description}
                    readTime={lesson.readTime}
                    difficulty={lesson.difficulty}
                    index={i}
                    lessonIndex={nav.lessonIndex || undefined}
                    totalLessons={nav.totalLessons || undefined}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="card-premium p-6 text-center">
          <h2 className="text-base font-bold text-foreground mb-2">تبحث عن تدريب عملي؟</h2>
          <p className="text-sm text-muted-foreground mb-4">
            نقدم دورات حضورية وتدريب عملي على المعدات.
          </p>
          <Link href="/consultant" className="btn-premium inline-flex">
            احجز تدريب عملي
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      }
    >
      <CoursesPageContent />
    </Suspense>
  );
}
