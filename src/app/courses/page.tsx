"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, GraduationCap, BookOpen } from "lucide-react";
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

function CoursesPageContent() {
  const { lessons, loading } = useSupabaseLessons();
  const searchParams = useSearchParams();
  const urlTrack = searchParams.get("track") as LearningTrack | null;

  const [activeTrack, setActiveTrack] = useState<LearningTrack>(urlTrack || "all");
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel>("all");

  const tracks: LearningTrack[] = ["all", "barista", "startup", "growth"];
  const levels: DifficultyLevel[] = ["all", "beginner", "intermediate", "advanced"];

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const track = getTrackForCategory(lesson.category);
      const trackMatch = activeTrack === "all" || track === activeTrack;
      const levelMatch = activeLevel === "all" || lesson.difficulty === levelLabels[activeLevel];
      return trackMatch && levelMatch;
    });
  }, [lessons, activeTrack, activeLevel]);

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

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">الفلتر حسب المسار:</h3>
          <div className="flex flex-wrap gap-2">
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => setActiveTrack(track)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeTrack === track
                    ? "bg-accent text-white border-accent"
                    : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                }`}
                title={trackDescriptions[track]}
              >
                {trackLabels[track]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">حسب المستوى:</h3>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
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
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد دورات مطابقة للفلتر المحدد</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLessons.map((lesson, i) => (
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
                />
              ))}
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
