"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import { Heart, Star, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categoryMeta";

export default function FavoritesPage() {
  const {
    favorites,
    toggleFavorite,
    pendingFavorites,
    saveError,
    initialized,
  } = useStore();
  const { lessons } = useSupabaseLessons();

  const favLessons = favorites
    .map((id) => lessons.find((l) => l.id === id || l.slug === id))
    .filter(Boolean);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-right">
        <h1 className="heading-xl">المفضلة</h1>
        <p className="text-base text-muted-foreground mt-3">
          {favLessons.length} درس في المفضلة
        </p>
      </div>

      {saveError && (
        <p role="alert" className="text-sm text-destructive">
          {saveError}
        </p>
      )}
      {!initialized ? (
        <p role="status" className="text-sm text-muted-foreground">
          جارٍ تحميل المفضلة…
        </p>
      ) : favLessons.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-foreground mb-1">لا توجد دروس مفضلة</p>
          <p className="text-xs text-muted-foreground">
            اضغط على قلب أي درس لإضافته هنا
          </p>
          <Link
            href="/courses"
            className="mt-4 bg-primary text-primary-foreground text-sm font-semibold min-h-12 px-5 py-3 rounded-xl hover:bg-primary/90 transition-all inline-block"
          >
            استكشف الدروس
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favLessons.map((lesson) => {
            if (!lesson) return null;
            const meta = getCategoryMeta(lesson.category);
            const Icon = meta.icon;

            return (
              <div
                key={lesson.id}
                className="card-premium overflow-hidden group"
              >
                <Link
                  href={`/lesson/${lesson.slug || lesson.id}`}
                  className="block w-full p-4 text-right flex items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap justify-end">
                      <span className="text-xs text-foreground bg-accent/10 px-1.5 py-0.5 rounded font-medium">
                        {lesson.subcategory}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-0.5">
                      {lesson.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 justify-end">
                      {lesson.read_time && (
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {lesson.read_time}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground font-medium">
                        <Star
                          className="w-3 h-3 text-accent"
                          fill="currentColor"
                        />
                        {lesson.rating}
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                      meta.gradient,
                    )}
                  >
                    <Icon
                      className="w-5 h-5 text-foreground/70"
                      strokeWidth={1.5}
                    />
                  </div>
                </Link>
                <div className="px-4 pb-3 flex justify-end">
                  <button
                    onClick={() =>
                      void toggleFavorite(
                        favorites.includes(lesson.slug)
                          ? lesson.slug
                          : lesson.id,
                      )
                    }
                    disabled={
                      pendingFavorites.includes(lesson.slug) ||
                      pendingFavorites.includes(lesson.id)
                    }
                    aria-label={`إزالة ${lesson.title} من المفضلة`}
                    className="flex items-center gap-1 min-h-11 text-sm text-destructive hover:text-destructive transition-colors px-3 py-2 rounded-lg hover:bg-destructive/10 font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    إزالة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
