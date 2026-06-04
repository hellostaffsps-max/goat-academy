"use client";

import { useMemo, useState } from "react";
import { BookOpen, Tag, Newspaper, Trophy, Lightbulb, BarChart3, Globe } from "lucide-react";
import { useSupabaseArticles } from "@/hooks/useSupabaseData";
import { articles as fallbackArticles } from "@/data/blogData";
import { ArticleCard } from "@/components/cards/ArticleCard";

const categoryOptions = [
  { id: "all", label: "الكل", icon: <Tag className="w-3.5 h-3.5" /> },
  { id: "news", label: "📰 أخبار القهوة", icon: <Newspaper className="w-3.5 h-3.5" /> },
  { id: "success", label: "🏆 قصص النجاح", icon: <Trophy className="w-3.5 h-3.5" /> },
  { id: "tips", label: "💡 نصائح سريعة", icon: <Lightbulb className="w-3.5 h-3.5" /> },
  { id: "case-study", label: "📊 دراسات حالة", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "exploration", label: "🌍 رحلات استكشاف", icon: <Globe className="w-3.5 h-3.5" /> },
];

export default function BlogPage() {
  const { articles: dbArticles, loading } = useSupabaseArticles();
  const [activeCategory, setActiveCategory] = useState("all");

  // Use DB articles if available, otherwise fallback to local
  const articles = dbArticles.length > 0 ? dbArticles : fallbackArticles;

  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [articles, activeCategory]);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
          <Newspaper className="w-3.5 h-3.5" />
          المدونة
        </div>
        <h1 className="heading-xl mb-3">نصائح وإرشادات من خبرتنا</h1>
        <p className="body-base text-muted-foreground max-w-xl mx-auto">
          مقالات حصرية: قصص نجاح، نصائح أسبوعية، أخبار صناعة القهوة، ودراسات حالة
        </p>
      </section>

      {/* Category filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-accent text-white border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Loading */}
      {loading && dbArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      )}

      {/* Articles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground">
            {filteredArticles.length} مقال
          </span>
          <h2 className="text-sm font-bold text-foreground">المقالات</h2>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">لا توجد مقالات مطابقة للتصنيف المحدد</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article, i) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                category={article.category}
                categoryLabel={article.category_label}
                subcategory={article.category_label}
                description={article.description}
                readTime={article.read_time}
                date={article.date}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
