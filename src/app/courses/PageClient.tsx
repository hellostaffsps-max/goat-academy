"use client";
import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Search,
  RotateCcw,
  Route,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useSupabaseLessons,
  useSupabaseLearningPaths,
} from "@/hooks/useSupabaseData";
import { LessonCard } from "@/components/cards/LessonCard";
import { categories, lessons as catalog } from "@/data/lessonCatalog";
import { getLevelForLesson } from "@/lib/trackMapping";
import {
  matchesLessonDuration,
  normalizeLessonSearch,
} from "@/lib/lesson-filters";
import { useLearningSearchParams } from "@/hooks/useLearningSearchParams";

const pageSize = 12;
const goalPaths: Record<string, string[]> = {
  barista: ["barista", "amateur"],
  startup: ["owner", "costing"],
  growth: ["manager"],
};
const order = new Map(catalog.map((lesson, index) => [lesson.id, index]));
export default function CoursesPageContent({
  initialSearch = "",
}: {
  initialSearch?: string;
}) {
  const { lessons } = useSupabaseLessons();
  const { paths } = useSupabaseLearningPaths();
  const { params, update } = useLearningSearchParams(initialSearch);
  const query = params.get("q") || "";
  const track = Object.hasOwn(goalPaths, params.get("track") || "")
    ? params.get("track")!
    : "all";
  const category = categories.some((item) => item.id === params.get("category"))
    ? params.get("category")!
    : "all";
  const level = ["beginner", "intermediate", "advanced"].includes(
    params.get("level") || "",
  )
    ? params.get("level")!
    : "all";
  const duration = ["short", "medium", "long", "unknown"].includes(
    params.get("duration") || "",
  )
    ? params.get("duration")!
    : "all";
  const hasFilters = Boolean(
    query ||
      track !== "all" ||
      category !== "all" ||
      level !== "all" ||
      duration !== "all",
  );
  const filteredLessons = useMemo(() => {
    const search = normalizeLessonSearch(query);
    const pathSlugs = new Set(
      paths
        .filter((path) => goalPaths[track]?.includes(path.slug))
        .flatMap((path) => path.lessons),
    );
    return lessons
      .filter(
        (lesson) =>
          (track === "all" || pathSlugs.has(lesson.slug)) &&
          (category === "all" || lesson.category === category) &&
          (level === "all" || getLevelForLesson(lesson.difficulty) === level) &&
          matchesLessonDuration(lesson.read_time, duration) &&
          (!search ||
            normalizeLessonSearch(
              [lesson.title, lesson.description, ...lesson.tags].join(" "),
            ).includes(search)),
      )
      .sort(
        (a, b) =>
          (order.get(a.slug) ?? 9999) - (order.get(b.slug) ?? 9999) ||
          a.title.localeCompare(b.title, "ar"),
      );
  }, [lessons, paths, query, track, category, level, duration]);
  const pageCount = Math.max(1, Math.ceil(filteredLessons.length / pageSize));
  const page = Math.min(
    pageCount,
    Math.max(1, Number.parseInt(params.get("page") || "1") || 1),
  );
  const visibleLessons = filteredLessons.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const filter = (key: string, value: string) =>
    update({ [key]: value, page: null });
  const reset = () =>
    update({
      q: null,
      track: null,
      category: null,
      level: null,
      duration: null,
      type: null,
      page: null,
    });
  const changePage = (number: number) => {
    update({ page: number === 1 ? null : String(number) });
    document
      .getElementById("lesson-results")
      ?.scrollIntoView({ block: "start" });
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-7">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-muted-foreground mb-3">
          الأكاديمية · تعلّم على وقتك
        </p>
        <h1 className="heading-xl">مكتبة دروس القهوة</h1>
        <p className="body-base text-muted-foreground mt-4">
          دروس قصيرة وتمارين عملية، من أساسيات التحضير إلى تأسيس المقهى وإدارته.
          ابحث عن موضوعك أو اتبع مساراً منظماً.
        </p>
      </header>
      <section className="rounded-2xl bg-secondary/40 border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Route className="w-6 h-6 shrink-0 mt-1" />
          <div>
            <h2 className="font-bold">
              أول زيارة للأكاديمية؟ ابدأ بخطة واضحة.
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              اختر هدفك وسنرتب لك الدروس خطوة بخطوة.
            </p>
          </div>
        </div>
        <Link href="/paths" className="btn-premium inline-flex shrink-0">
          اختر مسارك <ArrowLeft className="w-4 h-4" />
        </Link>
      </section>

      <section
        className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4"
        aria-label="البحث وتصفية الدروس"
      >
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            aria-label="ابحث في الدروس"
            value={query}
            onChange={(event) => filter("q", event.target.value)}
            placeholder="ابحث عن الإسبريسو، تبخير الحليب، تكلفة الكوب…"
            className="w-full min-h-12 rounded-xl border border-border bg-background pr-12 pl-4 text-base"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="text-sm font-medium space-y-2">
            <span className="block">هدفي من التعلم</span>
            <select
              value={track}
              onChange={(event) => filter("track", event.target.value)}
              className="w-full min-h-12 rounded-xl border border-border bg-background px-3 text-sm"
            >
              <option value="all">كل الأهداف</option>
              <option value="barista">مهارات الباريستا والتحضير</option>
              <option value="startup">تأسيس مقهى</option>
              <option value="growth">إدارة وتطوير مقهى</option>
            </select>
          </label>
          <label className="text-sm font-medium space-y-2">
            <span className="block">الموضوع</span>
            <select
              value={category}
              onChange={(event) => filter("category", event.target.value)}
              className="w-full min-h-12 rounded-xl border border-border bg-background px-3 text-sm"
            >
              <option value="all">كل الموضوعات</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium space-y-2">
            <span className="block">المستوى</span>
            <select
              value={level}
              onChange={(event) => filter("level", event.target.value)}
              className="w-full min-h-12 rounded-xl border border-border bg-background px-3 text-sm"
            >
              <option value="all">كل المستويات</option>
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
          </label>
          <label className="text-sm font-medium space-y-2">
            <span className="block">وقت القراءة</span>
            <select
              value={duration}
              onChange={(event) => filter("duration", event.target.value)}
              className="w-full min-h-12 rounded-xl border border-border bg-background px-3 text-sm"
            >
              <option value="all">كل المدد</option>
              <option value="short">حتى 10 دقائق</option>
              <option value="medium">11–20 دقيقة</option>
              <option value="long">أكثر من 20 دقيقة</option>
              <option value="unknown">غير محدد</option>
            </select>
          </label>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            <RotateCcw className="w-4 h-4" />
            مسح البحث والفلاتر
          </button>
        )}
      </section>

      <section
        id="lesson-results"
        className="scroll-mt-44"
        aria-labelledby="results-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 id="results-title" className="text-lg font-bold">
            {hasFilters ? "نتائج البحث" : "جميع الدروس"}
          </h2>
          <p
            role="status"
            aria-live="polite"
            className="text-sm text-muted-foreground"
          >
            {filteredLessons.length} درس
            {filteredLessons.length > 0 &&
              ` · عرض ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredLessons.length)}`}
          </p>
        </div>
        {visibleLessons.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleLessons.map((lesson) => (
              <LessonCard
                key={lesson.slug}
                id={lesson.slug}
                title={lesson.title}
                category={lesson.category}
                subcategory={lesson.subcategory}
                description={lesson.description}
                readTime={lesson.read_time}
                difficulty={lesson.difficulty}
                image={lesson.image}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold">لم نجد درساً بهذه الخيارات</h3>
            <p className="text-sm text-muted-foreground mt-2">
              جرّب كلمة أقصر أو أزل أحد الفلاتر.
            </p>
            <button type="button" onClick={reset} className="btn-premium mt-5">
              عرض كل الدروس
            </button>
          </div>
        )}
        {pageCount > 1 && (
          <nav
            aria-label="صفحات الدروس"
            className="flex flex-wrap justify-center items-center gap-3 mt-7"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
              className="inline-flex min-h-12 items-center gap-2 border border-border rounded-xl px-4 text-sm disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>
            <span role="status" className="text-sm">
              صفحة {page} من {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => changePage(page + 1)}
              className="inline-flex min-h-12 items-center gap-2 border border-border rounded-xl px-4 text-sm disabled:opacity-40"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          </nav>
        )}
      </section>
      <section className="rounded-2xl border border-border bg-card p-6 text-center">
        <h2 className="text-xl font-bold mb-2">جاهز للتدريب على المعدات؟</h2>
        <p className="text-muted-foreground mb-5">
          تعرّف على التدريب العملي مع وائل أرزيقات، واختر ما يناسب مستواك وهدفك.
        </p>
        <Link
          href="/services/barista-training-palestine"
          className="btn-premium inline-flex"
        >
          استكشف تدريب الباريستا <ArrowLeft className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
