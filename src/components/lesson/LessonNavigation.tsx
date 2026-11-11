"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useStore } from "@/store/useStore";

export function LessonProgressBar({
  lessonIndex,
  totalLessons,
  pathName,
  lessonSlugs,
}: {
  lessonIndex: number;
  totalLessons: number;
  pathName: string | null;
  lessonSlugs: string[];
}) {
  const completedLessons = useStore((state) => state.completedLessons);
  const completed = lessonSlugs.filter((slug) =>
    completedLessons.includes(slug),
  ).length;
  const progress = totalLessons
    ? Math.round((completed / totalLessons) * 100)
    : 0;
  return (
    <section
      className="bg-card border border-border rounded-xl p-4 text-right"
      aria-label="تقدمك في التعلم"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <p className="text-sm font-semibold">{pathName || "سلسلة الدروس"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            أنت في الدرس {lessonIndex} من {totalLessons}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          أنجزت {completed} من {totalLessons} · {progress}%
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="الدروس المكتملة"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 bg-secondary rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

export function LessonPrevNext({
  prev,
  next,
  pathId,
}: {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  pathId?: string | null;
}) {
  const href = (id: string) =>
    `/lesson/${id}${pathId ? `?path=${encodeURIComponent(pathId)}` : ""}`;
  return (
    <nav className="grid sm:grid-cols-2 gap-3" aria-label="التنقل بين الدروس">
      {prev && (
        <Link
          href={href(prev.id)}
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-right"
        >
          <ChevronRight className="w-5 h-5 shrink-0" />
          <span>
            <span className="text-xs text-muted-foreground block">
              الدرس السابق
            </span>
            <span className="text-sm font-semibold block mt-1">
              {prev.title}
            </span>
          </span>
        </Link>
      )}
      {next ? (
        <Link
          href={href(next.id)}
          className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-right"
        >
          <span>
            <span className="text-xs text-muted-foreground block">
              الدرس التالي
            </span>
            <span className="text-sm font-semibold block mt-1">
              {next.title}
            </span>
          </span>
          <ChevronLeft className="w-5 h-5 shrink-0" />
        </Link>
      ) : (
        <div className="p-4 rounded-xl border border-border bg-secondary/30 text-sm leading-relaxed">
          وصلت إلى آخر درس. راجع تقدمك في المسار للانتقال إلى الاختبار.
        </div>
      )}
    </nav>
  );
}

export function BackToPath({ pathId }: { pathId: string | null }) {
  return (
    <Link
      href={pathId ? `/paths?path=${encodeURIComponent(pathId)}` : "/courses"}
      className="flex items-center justify-center gap-2 min-h-12 p-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-sm font-semibold"
    >
      <BookOpen className="w-4 h-4" />
      {pathId ? "العودة إلى هذا المسار" : "العودة إلى مكتبة الدروس"}
    </Link>
  );
}
