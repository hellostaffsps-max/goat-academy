"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, GraduationCap, ChevronLeft } from "lucide-react";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";

export default function CoursesPage() {
  const { lessons, loading } = useSupabaseLessons();

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
          <GraduationCap className="w-3.5 h-3.5" />
          الدورات التدريبية
        </div>
        <h1 className="heading-xl mb-3">تعلم القهوة المختصة</h1>
        <p className="body-base text-muted-foreground max-w-xl mx-auto">
          دورات احترافية من المبتدئين إلى المتقدمين في عالم القهوة المختصة.
        </p>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson: typeof lessons[0], i: number) => (
              <Link
                key={lesson.id}
                href={`/lesson/${lesson.id}`}
                className="card-premium group hover:scale-[1.02] transition-all duration-300 flex flex-col"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-accent/60" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {lesson.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ١٥ دقيقة
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2 line-clamp-2 leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-semibold text-accent group-hover:underline">
                    ابدأ التعلم
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 text-accent transition-transform group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
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
