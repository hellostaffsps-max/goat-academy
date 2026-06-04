"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonNavigationProps {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  pathName: string | null;
  lessonIndex: number;
  totalLessons: number;
}

export function LessonProgressBar({
  lessonIndex,
  totalLessons,
  pathName,
}: {
  lessonIndex: number;
  totalLessons: number;
  pathName: string | null;
}) {
  const progress =
    totalLessons > 0 ? Math.round((lessonIndex / totalLessons) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 text-right">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground font-medium">
          {progress}%
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            الدرس {lessonIndex} من {totalLessons}
          </span>
          {pathName && (
            <span className="text-[10px] bg-accent/10 text-accent-foreground border border-accent/20 px-2 py-0.5 rounded-full">
              {pathName}
            </span>
          )}
        </div>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function LessonPrevNext({
  prev,
  next,
}: {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {prev ? (
        <Link
          href={`/lesson/${prev.id}`}
          className={cn(
            "flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-accent/40 hover:bg-accent/5 transition-all text-right",
            !next && "col-span-1"
          )}
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block">
              الدرس السابق
            </span>
            <span className="text-xs font-semibold text-foreground truncate block">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="p-3 rounded-xl border border-border/40 bg-secondary/30 text-right opacity-50">
          <span className="text-[10px] text-muted-foreground block">
            الدرس السابق
          </span>
          <span className="text-xs font-semibold text-muted-foreground truncate block">
            بداية المسار
          </span>
        </div>
      )}

      {next ? (
        <Link
          href={`/lesson/${next.id}`}
          className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-accent/40 hover:bg-accent/5 transition-all text-right flex-row-reverse"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 text-left">
            <span className="text-[10px] text-muted-foreground block">
              الدرس التالي
            </span>
            <span className="text-xs font-semibold text-foreground truncate block">
              {next.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="p-3 rounded-xl border border-border/40 bg-secondary/30 text-right opacity-50">
          <span className="text-[10px] text-muted-foreground block">
            الدرس التالي
          </span>
          <span className="text-xs font-semibold text-muted-foreground truncate block">
            نهاية المسار
          </span>
        </div>
      )}
    </div>
  );
}

export function BackToPath({ pathId }: { pathId: string | null }) {
  if (!pathId) return null;
  return (
    <Link
      href={`/paths`}
      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-accent/40 hover:bg-accent/5 transition-all text-xs font-semibold text-foreground"
    >
      <BookOpen className="w-3.5 h-3.5 text-accent" />
      العودة لمسارات التعلم
    </Link>
  );
}
