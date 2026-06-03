"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Tag } from "lucide-react";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";

export function BlogSection() {
  const { lessons } = useSupabaseLessons();
  const articles = lessons.slice(4, 8);

  return (
    <section id="blog" className="section-padding gradient-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <Tag className="w-3.5 h-3.5" />
            المدونة
          </div>
          <h2 className="heading-lg mb-3">آخر المقالات</h2>
          <p className="body-base text-muted-foreground">
            محتوى تعليمي متعمق في عالم القهوة المختصة.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {articles.map((article: typeof articles[0], i: number) => (
            <Link
              key={article.id}
              href={`/lesson/${article.id}`}
              className="card-premium group hover:scale-[1.02] transition-all duration-300 flex flex-col"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-accent/60" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ١٠ دقيقة
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2 line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-accent group-hover:underline">
                  اقرأ المزيد
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-accent transition-transform group-hover:-translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog" className="btn-accent inline-flex">
            جميع المقالات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
