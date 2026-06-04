"use client";

import { useMemo, useState } from "react";
import { BookOpen, Tag, Newspaper, Trophy, Lightbulb, BarChart3, Globe } from "lucide-react";
import { articles, blogCategories } from "@/data/blogData";
import { ArticleCard } from "@/components/cards/ArticleCard";

const categoryIcons: Record<string, React.ReactNode> = {
  all: <Tag className="w-3.5 h-3.5" />,
  news: <Newspaper className="w-3.5 h-3.5" />,
  success: <Trophy className="w-3.5 h-3.5" />,
  tips: <Lightbulb className="w-3.5 h-3.5" />,
  "case-study": <BarChart3 className="w-3.5 h-3.5" />,
  exploration: <Globe className="w-3.5 h-3.5" />,
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory]);

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
          {blogCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-accent text-white border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {categoryIcons[cat.id]}
              {cat.label}
            </button>
          ))}
        </div>
      </section>

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
                categoryLabel={article.categoryLabel}
                subcategory={article.categoryLabel}
                description={article.description}
                readTime={article.readTime}
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
