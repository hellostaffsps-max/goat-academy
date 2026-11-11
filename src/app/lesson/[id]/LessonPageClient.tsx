"use client";
import Link from "next/link";
import practices from "@/lib/academy-practices.json";
import { useStore } from "@/store/useStore";
import type { PublicLesson } from "@/lib/public-types";
import type { LessonNavigation } from "@/lib/lessonNavigation";
import { LessonContent } from "@/components/lesson/LessonContent";
import {
  LessonProgressBar,
  LessonPrevNext,
  BackToPath,
} from "@/components/lesson/LessonNavigation";
import {
  Heart,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  FlaskConical,
} from "lucide-react";
import { BrewTimer } from "@/components/coffee/BrewTimer";
import { SocialShare } from "@/components/SocialShare";
import { cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categoryMeta";
import { getLevelForLesson, levelLabels } from "@/lib/trackMapping";
import { ContentImage } from "@/components/ContentImage";
import { useLearningSearchParams } from "@/hooks/useLearningSearchParams";

interface LessonPageClientProps {
  lesson: PublicLesson;
  relatedLessons: PublicLesson[];
  nav: LessonNavigation;
  navigationOptions?: LessonNavigation[];
}
export default function LessonPageClient({
  lesson,
  relatedLessons,
  nav: defaultNav,
  navigationOptions = [],
}: LessonPageClientProps) {
  const { params } = useLearningSearchParams();
  const nav =
    navigationOptions.find((option) => option.pathId === params.get("path")) ||
    defaultNav;
  const {
    toggleFavorite,
    isFavorite,
    toggleCompleted,
    isCompleted,
    pendingFavorites,
    pendingLessons,
    accountId,
    saveError,
    initialized,
  } = useStore();
  const lessonId = lesson.slug || lesson.id;
  const completed = isCompleted(lessonId);
  const favorite = isFavorite(lessonId);
  const practice = practices.find((item) => item.slug === lesson.slug);
  const currentMeta = getCategoryMeta(lesson.category);
  const CurrentIcon = currentMeta.icon;
  const isDiagram = lesson.image?.startsWith("/images/lessons/") ?? false;
  const backHref = nav.pathId
    ? `/paths?path=${encodeURIComponent(nav.pathId)}`
    : "/courses";

  return (
    <article className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 min-h-11 text-sm font-medium hover:underline"
        >
          <ArrowRight className="w-4 h-4" />
          {nav.pathName || "مكتبة الدروس"}
        </Link>
        <button
          type="button"
          onClick={() => void toggleFavorite(lessonId)}
          disabled={!initialized || pendingFavorites.includes(lessonId)}
          aria-pressed={favorite}
          aria-label={favorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-3 text-sm hover:bg-secondary disabled:opacity-60"
        >
          <Heart
            className={cn(
              "w-4 h-4",
              favorite && "text-destructive fill-destructive",
            )}
          />
          <span className="hidden sm:inline">
            {favorite ? "في المفضلة" : "احفظ الدرس"}
          </span>
        </button>
      </div>

      <header className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-center rounded-2xl border border-border bg-card p-5 sm:p-7">
        <div>
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <span className="rounded-full bg-secondary px-3 py-1">
              {lesson.subcategory}
            </span>
            <span className="rounded-full bg-accent/20 px-3 py-1">
              {levelLabels[getLevelForLesson(lesson.difficulty)]}
            </span>
          </div>
          <h1 className="heading-lg mb-3">{lesson.title}</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {lesson.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
            {lesson.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {lesson.read_time} قراءة
              </span>
            )}
            <SocialShare title={lesson.title} />
          </div>
        </div>
        <div className="relative aspect-[1200/630] overflow-hidden rounded-xl bg-secondary border border-border/50">
          {lesson.image ? (
            <ContentImage
              src={lesson.image}
              priority
              sizes="(max-width: 768px) 90vw, 420px"
              alt={lesson.title}
              className={cn(
                "w-full h-full",
                isDiagram ? "object-contain bg-brand-offwhite" : "object-cover",
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <CurrentIcon className="w-14 h-14 text-muted-foreground" />
            </div>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-5">
        {nav.totalLessons > 0 && (
          <LessonProgressBar
            lessonIndex={nav.lessonIndex}
            totalLessons={nav.totalLessons}
            pathName={nav.pathName}
            lessonSlugs={nav.lessonSlugs}
          />
        )}
        {lesson.content ? (
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 text-right">
            <LessonContent content={lesson.content} />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p>المحتوى التفصيلي قريباً.</p>
            <Link
              href="/courses"
              className="inline-flex min-h-11 items-center mt-3 underline"
            >
              اختر درساً آخر
            </Link>
          </div>
        )}

        {practice && (
          <section
            className="rounded-2xl border border-border bg-secondary/40 p-5 sm:p-6"
            aria-label="التطبيق العملي في المختبر"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FlaskConical className="w-5 h-5" />
              من الفهم إلى التطبيق
            </div>
            <h2 className="mt-3 text-xl font-bold">
              جرّب {practice.title} بنفسك
            </h2>
            <p className="my-3 leading-relaxed text-muted-foreground">
              {practice.task}
            </p>
            <a
              className="btn-premium inline-flex"
              href={`https://staffps.online/lab/practice?lesson=${practice.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              طبّق في المختبر <ArrowLeft className="w-4 h-4" />
            </a>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              يفتح المختبر في تبويب جديد، ويمكنك العودة إلى درسك هنا. ستحتاج إلى
              حساب المختبر لحفظ التطبيق.
            </p>
          </section>
        )}
        {lesson.category === "homebrew" && (
          <BrewTimer methodName={lesson.title} defaultCoffeeWeight={15} />
        )}

        <section
          className="rounded-2xl border border-border bg-card p-5 space-y-3"
          aria-label="إكمال الدرس"
        >
          <button
            type="button"
            onClick={() => void toggleCompleted(lessonId)}
            disabled={!initialized || pendingLessons.includes(lessonId)}
            aria-pressed={completed}
            className={cn(
              "w-full min-h-12 px-4 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 border disabled:opacity-60",
              completed
                ? "bg-secondary text-foreground border-border hover:bg-secondary/70"
                : "bg-primary text-primary-foreground border-primary hover:opacity-90",
            )}
          >
            {completed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
            {!initialized
              ? "جارٍ تحميل تقدمك…"
              : pendingLessons.includes(lessonId)
                ? "جارٍ الحفظ…"
                : completed
                  ? "الدرس مكتمل · تراجع عن الإكمال"
                  : "أكملت قراءة هذا الدرس"}
          </button>
          <p
            role="status"
            className="text-xs text-muted-foreground text-center leading-relaxed"
          >
            {!initialized
              ? "نستعيد تقدمك قبل متابعة التعلم."
              : accountId
                ? "إكمال الدروس والمفضلة مرتبطان بحسابك."
                : "يُحفظ تقدمك ومفضلتك في هذا المتصفح على هذا الجهاز."}
          </p>
          {saveError && (
            <p role="alert" className="text-sm text-destructive">
              {saveError}
            </p>
          )}
        </section>
        <LessonPrevNext prev={nav.prev} next={nav.next} pathId={nav.pathId} />
        <BackToPath pathId={nav.pathId} />
      </div>

      {relatedLessons.length > 0 && (
        <section className="pt-5 border-t border-border">
          <h2 className="text-xl font-bold mb-4">تابع استكشاف الموضوع</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedLessons.map((related) => (
              <Link
                key={related.id}
                href={`/lesson/${related.slug || related.id}`}
                className="rounded-xl bg-card border border-border p-4 hover:bg-secondary transition-colors"
              >
                <h3 className="font-semibold">{related.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {related.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
