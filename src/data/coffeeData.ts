import curriculum from "./reviewedCurriculum.json";
export { categories, learningPaths } from "./lessonCatalog";
export interface Lesson {
 id: string;
 title: string;
 category: string;
 subcategory: string;
 description: string;
 rating: number;
 tags: string[];
 readTime? : string;
 difficulty? : string;
 content: string;
 image?: string | null;
}

export interface Category {
 id: string;
 title: string;
 description: string;
 count: number;
}

export interface LearningPath {
 id: string;
 title: string;
 lessonCount: number;
 description: string;
 lessons: string[];
 icon? : string;
 color? : string;
}

export const lessons: Lesson[] = curriculum.lessons.map(l => ({...l, id: l.slug, readTime: l.read_time}));
export const getLessonsByCategory = (categoryId: string) => lessons. filter((l) => l. category === categoryId);
export const getLessonById = (id: string) => lessons. find((l) => l. id === id);
export const getRecommendedLessons = (lessonList: Lesson[] = lessons) => [
 lessonList. find((l) => l. id === "espresso"),
 lessonList. find((l) => l. id === "cappuccino"),
 lessonList. find((l) => l. id === "v60"),
 lessonList. find((l) => l. id === "coffee-grinder"),
 lessonList. find((l) => l. id === "before-opening-cafe"),
 lessonList. find((l) => l. id === "request-cost-study")
]. filter(Boolean) as Lesson[];
