"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import { LessonCard } from "@/components/cards/LessonCard";

export function CoursesSection() {
  const { lessons } = useSupabaseLessons();
  const featured = lessons.slice(0, 3);

  return (
    <section id="courses" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <GraduationCap className="w-3.5 h-3.5" />
            الدورات التدريبية
          </div>
          <h2 className="heading-lg mb-3">ابدأ بتعلم جديد</h2>
          <p className="body-base text-muted-foreground">
            دروس عملية مختارة لك
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {featured.map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              category={lesson.category}
              subcategory={lesson.subcategory}
              description={lesson.description}
              readTime={lesson.read_time}
              difficulty={lesson.difficulty}
              index={i}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href="/courses" className="btn-premium inline-flex">
            تصفح جميع الدورات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
