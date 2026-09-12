"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { categories } from "@/data/lessonCatalog";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import { Search, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categoryMeta";

export default function ExploreContent({
  query = "",
  category = null,
  extraResults = [],
}: {
  query?: string;
  category?: string | null;
  extraResults?: {
    title: string;
    description: string;
    href: string;
    type: string;
  }[];
}) {
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category,
  );
  const { lessons } = useSupabaseLessons();

  const filteredLessons = useMemo(() => {
    let result = lessons;
    if (selectedCategory) {
      result = result.filter((l) => l.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [lessons, searchQuery, selectedCategory]);

  const otherResults =
    selectedCategory || !searchQuery.trim()
      ? []
      : extraResults.filter((r) =>
          `${r.title} ${r.description}`
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()),
        );

  const handleCategoryClick = (catId: string | null) => {
    setSelectedCategory(catId);
    if (catId) {
      window.history.replaceState(
        null,
        "",
        `/explore?category=${encodeURIComponent(catId)}&q=${encodeURIComponent(searchQuery)}`,
      );
    } else {
      window.history.replaceState(
        null,
        "",
        `/explore?q=${encodeURIComponent(searchQuery)}`,
      );
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-right">
        <h1 className="text-xl font-bold text-foreground">استكشف</h1>
        <p className="text-xs text-muted-foreground mt-1">
          تصفح كل محتوى الأكاديمية
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          aria-label="البحث في محتوى الأكاديمية"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن درس، مشروب، مصطلح..."
          className="w-full bg-card border border-border rounded-xl py-3 pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all text-right"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <span className="text-xs">مسح</span>
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => handleCategoryClick(null)}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
            !selectedCategory
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-secondary-foreground border-border hover:border-primary/20",
          )}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              handleCategoryClick(selectedCategory === cat.id ? null : cat.id)
            }
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-secondary-foreground border-border hover:border-primary/20",
            )}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {filteredLessons.length} درس
        </span>
        <span className="text-[10px] text-muted-foreground font-medium">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.title
            : "جميع الأقسام"}
        </span>
      </div>

      {otherResults.length > 0 && (
        <section
          className="space-y-3"
          aria-label="نتائج المقالات والخدمات والأدلة"
        >
          {otherResults.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="block bg-card border border-border rounded-xl p-4"
            >
              <span className="text-xs text-accent">{r.type}</span>
              <h2 className="font-bold mt-1">{r.title}</h2>
              <p className="text-sm text-muted-foreground">{r.description}</p>
            </Link>
          ))}
        </section>
      )}
      {/* Lessons List */}
      <div className="space-y-3">
        {filteredLessons.map((lesson, i) => {
          const meta = getCategoryMeta(lesson.category);
          const Icon = meta.icon;

          return (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.slug}`}
              className={cn(
                "block w-full bg-card border border-border rounded-xl p-4 text-right flex items-center gap-4 animate-slide-up hover:border-primary/30 transition-all card-premium group",
                `stagger-${(i % 8) + 1}`,
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap justify-end">
                  {lesson.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full border border-border/10"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-[9px] text-accent-foreground bg-accent/10 px-1.5 py-0.5 rounded font-medium">
                    {lesson.subcategory}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-0.5">
                  {lesson.title}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
                <div className="flex items-center gap-3 mt-2 justify-end">
                  {lesson.read_time && (
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {lesson.read_time}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground font-medium">
                    <Star className="w-3 h-3 text-accent" fill="currentColor" />
                    {lesson.rating}
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  "w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                  meta.gradient,
                )}
              >
                <Icon
                  className="w-5 h-5 text-foreground/70"
                  strokeWidth={1.5}
                />
              </div>
            </Link>
          );
        })}

        {filteredLessons.length === 0 && otherResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground">لا توجد نتائج</p>
            <p className="text-xs text-muted-foreground mt-1">
              جرب بحثاً مختلفاً
            </p>
          </div>
        )}
      </div>

      <div className="h-4" />
    </>
  );
}
