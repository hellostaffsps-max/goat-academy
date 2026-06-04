"use client";

import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import { ArticleCard } from "@/components/cards/ArticleCard";

export function BlogSection() {
  const { lessons } = useSupabaseLessons();
  const articles = lessons.slice(3, 6);

  return (
    <section id="blog" className="section-padding gradient-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <Tag className="w-3.5 h-3.5" />
            المدونة
          </div>
          <h2 className="heading-lg mb-3">نصائح من خبرتنا</h2>
          <p className="body-base text-muted-foreground">
            مقالات تساعدك في اتخاذ قرارات أفضل
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {articles.map((article, i) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              category={article.category}
              subcategory={article.subcategory}
              description={article.description}
              readTime={article.read_time}
              index={i}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog" className="btn-accent inline-flex">
            اقرأ جميع المقالات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
