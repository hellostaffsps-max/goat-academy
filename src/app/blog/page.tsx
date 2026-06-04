"use client";

import { useMemo, useState } from "react";
import { BookOpen, Tag } from "lucide-react";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import { ArticleCard } from "@/components/cards/ArticleCard";

const blogCategories = [
  { id: "all", label: "الكل" },
  { id: "costing", label: "تأسيس" },
  { id: "cafe", label: "تشغيل" },
  { id: "equipment", label: "معدات" },
  { id: "drinks", label: "قهوة" },
  { id: "beans", label: "بن" },
  { id: "homebrew", label: "تحضير" },
];

export default function BlogPage() {
  const { lessons, loading } = useSupabaseLessons();
  const [activeCategory, setActiveCategory] = useState("all");

  const articles = useMemo(() => {
    if (activeCategory === "all") return lessons;
    return lessons.filter((lesson) => lesson.category === activeCategory);
  }, [lessons, activeCategory]);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
          <Tag className="w-3.5 h-3.5" />
          المدونة
        </div>
        <h1 className="heading-xl mb-3">نصائح وإرشادات من خبرتنا</h1>
        <p className="body-base text-muted-foreground max-w-xl mx-auto">
          مقالات تساعدك في اتخاذ قرارات أفضل في رحلتك
        </p>
      </section>

      {/* Category filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {blogCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                activeCategory === cat.id
                  ? "bg-accent text-white border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      )}

      {/* Articles */}
      {!loading && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد مقالات مطابقة للتصنيف المحدد</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article, i) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  category={article.category}
                  subcategory={article.subcategory}
                  description={article.description}
                  readTime={article.readTime}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
