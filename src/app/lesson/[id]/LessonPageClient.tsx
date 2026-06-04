"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getLessonById } from "@/data/coffeeData";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import { LessonContent } from "@/components/lesson/LessonContent";
import {
  LessonProgressBar,
  LessonPrevNext,
  BackToPath,
} from "@/components/lesson/LessonNavigation";
import { getLessonNavigation } from "@/lib/lessonNavigation";
import {
  Heart,
  Clock,
  Star,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { BrewTimer } from "@/components/coffee/BrewTimer";
import { SocialShare } from "@/components/SocialShare";
import { cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categoryMeta";

interface LessonPageClientProps {
  lessonId: string;
}

export default function LessonPageClient({ lessonId }: LessonPageClientProps) {
  const router = useRouter();
  const { lessons, loading } = useSupabaseLessons();

  const {
    toggleFavorite,
    isFavorite,
    toggleCompleted,
    isCompleted,
  } = useStore();

  const lesson = lessons.find((l) => l.id === lessonId || l.slug === lessonId) || getLessonById(lessonId);

  const nav = lesson ? getLessonNavigation((lesson as any).slug || lesson.id) : null;

  if (!lesson) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-sm text-muted-foreground">الدرس غير موجود</p>
        <button
          onClick={() => router.push("/explore")}
          className="mt-4 text-xs text-primary hover:underline"
        >
          العودة للاستكشاف
        </button>
      </div>
    );
  }

  const completed = isCompleted((lesson as any).slug || lesson.id);
  const fav = isFavorite((lesson as any).slug || lesson.id);

  // Get related lessons from same category
  const relatedLessons = lessons
    .filter((l) => l.category === lesson?.category && l.id !== lesson?.id)
    .slice(0, 4);

  const currentMeta = getCategoryMeta(lesson.category);
  const CurrentIcon = currentMeta.icon;

  return (
    <div className="animate-fade-in -mx-4 -mt-4">
      {/* Hero */}
      <div className="relative">
        <div className="aspect-[21/9] sm:aspect-[16/6] bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden border-b border-border/50 rounded-b-2xl">
          {/* Brand-inspired layout background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-border" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-border/50" />
            <div className="absolute top-1/4 left-12 w-36 h-36 rounded-full bg-accent/5 blur-xl" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-1 bg-gradient-to-br",
                currentMeta.gradient
              )}
            >
              <CurrentIcon className="w-5 h-5 text-foreground/75" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              {lesson.subcategory}
            </span>
          </div>

          {/* Back button */}
          <button
            onClick={() => router.push("/explore")}
            aria-label="العودة للاستكشاف"
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-background transition-all shadow-xs"
          >
            <ArrowRight className="w-4 h-4 text-foreground" />
          </button>
          {/* Favorite */}
          <button
            onClick={() => toggleFavorite((lesson as any).slug || lesson.id)}
            aria-label={fav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-background transition-all shadow-xs"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                fav ? "text-destructive fill-destructive" : "text-foreground"
              )}
            />
          </button>
        </div>

        {/* Title Card */}
        <div className="mx-4 -mt-6 relative z-10 bg-card border border-border rounded-xl p-5 text-right shadow-sm">
          <div className="flex items-center gap-2 mb-2 flex-wrap justify-end">
            {lesson.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full border border-border/10"
              >
                {tag}
              </span>
            ))}
            <span className="text-[9px] text-accent-foreground bg-accent/10 px-2 py-0.5 rounded-full font-medium">
              {lesson.subcategory}
            </span>
            {nav && nav.totalLessons > 0 && (
              <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                درس {nav.lessonIndex} من {nav.totalLessons}
              </span>
            )}
          </div>
          <h1 className="text-base font-bold text-foreground mb-1 leading-tight">
            {lesson.title}
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {lesson.description}
          </p>
          <div className="flex items-center gap-4 mt-3 justify-end border-t border-border/50 pt-3">
            {((lesson as any).read_time || (lesson as any).readTime) && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {(lesson as any).read_time || (lesson as any).readTime}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
              <Star className="w-3 h-3 text-accent" fill="currentColor" />
              {lesson.rating}
            </span>
            <SocialShare title={lesson.title} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-4">
        {/* Progress Bar */}
        {nav && nav.totalLessons > 0 && (
          <LessonProgressBar
            lessonIndex={nav.lessonIndex}
            totalLessons={nav.totalLessons}
            pathName={nav.pathName}
          />
        )}

        {lesson.content ? (
          <div className="bg-card border border-border rounded-xl p-5 text-right">
            <LessonContent content={lesson.content} />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">المحتوى التفصيلي قريباً</p>
          </div>
        )}

        {/* Dynamic Brew Timer for homebrew (brewing methods) */}
        {lesson.category === "homebrew" && (
          <BrewTimer methodName={lesson.title} defaultCoffeeWeight={15} />
        )}

        {/* Mark as Complete */}
        <button
          onClick={() => toggleCompleted(lesson.id)}
          className={cn(
            "w-full py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border",
            completed
              ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
              : "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
          )}
        >
          {completed ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              مكتمل
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              أكملت هذا الدرس
            </>
          )}
        </button>

        {/* Prev / Next Navigation */}
        {nav && (nav.prev || nav.next) && (
          <LessonPrevNext prev={nav.prev} next={nav.next} />
        )}

        {/* Back to Paths */}
        {nav && <BackToPath pathId={nav.pathId} />}

        {/* Related Lessons */}
        {relatedLessons.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-foreground mb-3 text-right">
              دروس ذات صلة
            </h3>
            <div className="space-y-2">
              {relatedLessons.map((rl) => {
                const rlMeta = getCategoryMeta(rl.category);
                const RlIcon = rlMeta.icon;

                return (
                  <button
                    key={rl.id}
                    onClick={() => router.push(`/lesson/${rl.id}`)}
                    className="w-full bg-card border border-border rounded-xl p-3 text-right flex items-center gap-3 hover:border-primary/30 transition-all group"
                  >
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground">
                        {rl.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                        {rl.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br transition-transform duration-300 group-hover:scale-105",
                        rlMeta.gradient
                      )}
                    >
                      <RlIcon className="w-4 h-4 text-foreground/70" strokeWidth={1.5} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}
