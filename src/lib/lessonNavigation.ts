import { lessons, learningPaths } from "@/data/coffeeData";

export interface LessonNavigation {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  pathName: string | null;
  lessonIndex: number;
  totalLessons: number;
  pathId: string | null;
}

export function getLessonNavigation(lessonSlug: string): LessonNavigation {
  // Find which path contains this lesson
  for (const path of learningPaths) {
    const idx = path.lessons.indexOf(lessonSlug);
    if (idx !== -1) {
      const prev =
        idx > 0
          ? {
              id: path.lessons[idx - 1],
              title:
                lessons.find((l) => l.id === path.lessons[idx - 1])?.title ||
                "الدرس السابق",
            }
          : null;
      const next =
        idx < path.lessons.length - 1
          ? {
              id: path.lessons[idx + 1],
              title:
                lessons.find((l) => l.id === path.lessons[idx + 1])?.title ||
                "الدرس التالي",
            }
          : null;
      return {
        prev,
        next,
        pathName: path.title,
        lessonIndex: idx + 1,
        totalLessons: path.lessons.length,
        pathId: path.id,
      };
    }
  }

  // If not in any path, try to find by category order
  const lesson = lessons.find((l) => l.id === lessonSlug || (l as any).slug === lessonSlug);
  if (lesson) {
    const categoryLessons = lessons.filter(
      (l) => l.category === lesson.category
    );
    const idx = categoryLessons.findIndex((l) => l.id === lessonSlug || (l as any).slug === lessonSlug);
    const prev =
      idx > 0
        ? { id: categoryLessons[idx - 1].id, title: categoryLessons[idx - 1].title }
        : null;
    const next =
      idx < categoryLessons.length - 1
        ? { id: categoryLessons[idx + 1].id, title: categoryLessons[idx + 1].title }
        : null;
    return {
      prev,
      next,
      pathName: lesson.subcategory,
      lessonIndex: idx + 1,
      totalLessons: categoryLessons.length,
      pathId: null,
    };
  }

  return {
    prev: null,
    next: null,
    pathName: null,
    lessonIndex: 0,
    totalLessons: 0,
    pathId: null,
  };
}
