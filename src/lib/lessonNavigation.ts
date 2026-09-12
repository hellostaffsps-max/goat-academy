import type { PublicLesson, PublicPath } from "./public-types";
export interface LessonNavigation {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  pathName: string | null;
  lessonIndex: number;
  totalLessons: number;
  pathId: string | null;
}
export function getLessonNavigation(
  slug: string,
  lessons: PublicLesson[],
  paths: PublicPath[],
): LessonNavigation {
  const lesson = lessons.find((l) => l.slug === slug);
  const path = paths.find((p) => p.lessons.includes(slug));
  const sequence = path
    ? path.lessons
        .map((s) => lessons.find((l) => l.slug === s || l.id === s))
        .filter((l): l is PublicLesson => !!l)
    : lessons.filter((l) => l.category === lesson?.category);
  const index = sequence.findIndex((l) => l.slug === slug);
  const item = (i: number) =>
    sequence[i] ? { id: sequence[i].slug, title: sequence[i].title } : null;
  return {
    prev: index > 0 ? item(index - 1) : null,
    next: index >= 0 ? item(index + 1) : null,
    pathName: path?.title || lesson?.subcategory || null,
    lessonIndex: index + 1,
    totalLessons: sequence.length,
    pathId: path?.slug || null,
  };
}
