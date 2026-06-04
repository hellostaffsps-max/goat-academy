"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import {
  Heart,
  Star,
  Clock,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categoryMeta";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useStore();
  const { lessons } = useSupabaseLessons();

  const favLessons = favorites
    .map((id) => lessons.find((l) => l.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-right">
        <h2 className="text-xl font-bold text-foreground">المفضلة</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {favLessons.length} درس في المفضلة
        </p>
      </div>

      {favLessons.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-foreground mb-1">
            لا توجد دروس مفضلة
          </p>
          <p className="text-xs text-muted-foreground">
            اضغط على قلب أي درس لإضافته هنا
          </p>
          <Link
            href="/explore"
            className="mt-4 bg-primary text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all inline-block"
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
                  href={`/lesson/${lesson.id}`}
                  className="block w-full p-4 text-right flex items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap justify-end">
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
                  <div className={cn(
                    "w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                    meta.gradient
                  )}>
                    <Icon className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                  </div>
                </Link>
                <div className="px-4 pb-3 flex justify-end">
                  <button
                    onClick={() => toggleFavorite(lesson.id)}
                    className="flex items-center gap-1 text-[10px] text-destructive/80 hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-destructive/10 font-medium"
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
