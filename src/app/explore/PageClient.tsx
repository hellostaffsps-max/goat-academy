"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { categories } from "@/data/lessonCatalog";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import { LessonCard } from "@/components/cards/LessonCard";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .trim();

export default function ExploreContent({
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
  const params = useSearchParams();
  const searchQuery = params.get("q") ?? "";
  const categoryParam = params.get("category");
  const selectedCategory = categories.some((item) => item.id === categoryParam)
    ? categoryParam
    : null;
  const { lessons, loading } = useSupabaseLessons();
  const resultsRef = useRef<HTMLHeadingElement>(null);

  const updateFilters = (
    next: { q?: string; category?: string | null; page?: number },
    replace = false,
  ) => {
    const values = new URLSearchParams(params.toString());
    if (next.q !== undefined) {
      if (next.q) values.set("q", next.q);
      else values.delete("q");
    }
    if (next.category !== undefined) {
      if (next.category) values.set("category", next.category);
      else values.delete("category");
    }
    if (next.page && next.page > 1) values.set("page", String(next.page));
    else values.delete("page");
    const url = `/explore${values.size ? `?${values.toString()}` : ""}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  };

  const filteredLessons = useMemo(() => {
    const term = normalizeSearch(searchQuery);
    return lessons.filter(
      (lesson) =>
        (!selectedCategory || lesson.category === selectedCategory) &&
        (!term ||
          normalizeSearch(
            `${lesson.title} ${lesson.description} ${lesson.tags.join(" ")}`,
          ).includes(term)),
    );
  }, [lessons, searchQuery, selectedCategory]);
  const otherResults =
    selectedCategory || !searchQuery.trim()
      ? []
      : extraResults.filter((result) =>
          normalizeSearch(`${result.title} ${result.description}`).includes(
            normalizeSearch(searchQuery),
          ),
        );
  const pageCount = Math.max(1, Math.ceil(filteredLessons.length / PAGE_SIZE));
  const pageNumber = Number(params.get("page"));
  const page =
    Number.isInteger(pageNumber) && pageNumber > 0
      ? Math.min(pageNumber, pageCount)
      : 1;
  const visibleLessons = filteredLessons.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const changePage = (nextPage: number) => {
    updateFilters({ page: nextPage });
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">
          مكتبة الأكاديمية
        </p>
        <h1 className="heading-xl">اعثر على ما تريد تعلّمه</h1>
        <p className="text-base leading-8 text-muted-foreground">
          ابحث في الدروس والمقالات والأدلة، أو اختر موضوعاً تبدأ منه.
        </p>
      </div>

      <section
        className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-5"
        aria-label="البحث والتصفية"
      >
        <div className="relative">
          <label htmlFor="explore-search" className="sr-only">
            البحث في محتوى الأكاديمية
          </label>
          <Search
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground"
          />
          <input
            id="explore-search"
            type="search"
            value={searchQuery}
            onChange={(event) => updateFilters({ q: event.target.value }, true)}
            placeholder="جرّب: إسبريسو، تكلفة الكوب، تبخير الحليب"
            className="w-full min-h-14 rounded-xl border border-border bg-background pr-12 pl-14 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => updateFilters({ q: "" }, true)}
              aria-label="مسح البحث"
              className="absolute left-1 top-1/2 -translate-y-1/2 min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg hover:bg-secondary"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold mb-3">موضوع الدرس</legend>
          <div className="flex flex-wrap gap-2">
            {[{ id: "", title: "كل المواضيع" }, ...categories].map((item) => {
              const active = (selectedCategory || "") === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => updateFilters({ category: item.id || null })}
                  className={cn(
                    "min-h-11 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-secondary",
                  )}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </fieldset>
      </section>

      {otherResults.length > 0 && (
        <section className="space-y-4" aria-labelledby="other-results-heading">
          <h2 id="other-results-heading" className="text-lg font-bold">
            مقالات وخدمات وأدلة ذات صلة
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherResults.map((result) => (
              <Link
                key={result.href}
                href={result.href}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-foreground/40"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  {result.type}
                </span>
                <h3 className="mt-2 text-base font-bold">{result.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground line-clamp-3">
                  {result.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section
        className="space-y-5"
        aria-labelledby="lesson-results-heading"
        aria-busy={loading}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            ref={resultsRef}
            tabIndex={-1}
            id="lesson-results-heading"
            className="text-xl font-bold scroll-mt-44"
          >
            الدروس
          </h2>
          <p className="text-sm text-muted-foreground" role="status">
            {loading
              ? "جارٍ تحميل الدروس…"
              : `${filteredLessons.length} درس${filteredLessons.length ? ` · عرض ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredLessons.length)}` : ""}`}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
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
        {!loading && !filteredLessons.length && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center space-y-4">
            <BookOpen
              aria-hidden="true"
              className="size-9 mx-auto text-muted-foreground"
            />
            <h3 className="text-lg font-bold">لم نجد دروساً تطابق بحثك</h3>
            <p className="text-base text-muted-foreground">
              جرّب كلمة أقصر أو ابحث ضمن كل المواضيع.
            </p>
            <button
              type="button"
              onClick={() => updateFilters({ q: "", category: null })}
              className="min-h-11 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              عرض كل الدروس
            </button>
          </div>
        )}
        {pageCount > 1 && (
          <nav
            aria-label="صفحات نتائج الدروس"
            className="flex items-center justify-between gap-3 border-t border-border pt-5"
          >
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowRight aria-hidden="true" className="size-4" />
              السابق
            </button>
            <span className="text-sm text-muted-foreground">
              {page} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page === pageCount}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              التالي
              <ArrowLeft aria-hidden="true" className="size-4" />
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
