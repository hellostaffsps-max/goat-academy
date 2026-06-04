/**
 * Maps existing categories to the 3 learning tracks.
 * Used for filtering on /courses page.
 */

export type LearningTrack = "all" | "barista" | "startup" | "growth";

export const trackLabels: Record<LearningTrack, string> = {
  all: "الكل",
  barista: "الباريستا",
  startup: "تأسيس المقاهي",
  growth: "تطوير المقاهي",
};

export const trackDescriptions: Record<LearningTrack, string> = {
  all: "عرض جميع الدورات",
  barista: "دورات تحضير القهوة والمهارات العملية",
  startup: "دورات التخطيط والتكاليف والتأسيس",
  growth: "دورات تحسين الأداء للمقاهي القائمة",
};

/**
 * Maps category IDs to tracks.
 */
export const categoryToTrack: Record<string, LearningTrack> = {
  drinks: "barista",
  homebrew: "barista",
  equipment: "barista",
  beans: "barista",
  terms: "barista",
  costing: "startup",
  cafe: "growth",
};

export function getTrackForCategory(category: string): LearningTrack {
  return categoryToTrack[category] || "barista";
}

/**
 * Level mapping from difficulty/tags.
 */
export type DifficultyLevel = "all" | "beginner" | "intermediate" | "advanced";

export const levelLabels: Record<DifficultyLevel, string> = {
  all: "الكل",
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

export const levelColors: Record<DifficultyLevel, string> = {
  all: "bg-gray-100 text-gray-700 border-gray-200",
  beginner: "bg-green-50 text-green-700 border-green-200",
  intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
};

export function getLevelForLesson(difficulty?: string): DifficultyLevel {
  if (!difficulty) return "beginner";
  const d = difficulty.trim();
  if (d === "أساسي" || d === "سهل" || d === "مبتدئ") return "beginner";
  if (d === "متوسط") return "intermediate";
  if (d === "متقدم") return "advanced";
  // fallback based on common tags
  if (["مهم", "تشغيل", "نموذج", "منيو", "موقع", "موردين", "هوية", "تجربة", "فريق"].includes(d)) return "intermediate";
  return "beginner";
}
