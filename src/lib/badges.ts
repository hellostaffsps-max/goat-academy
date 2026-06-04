import { learningPaths } from "@/data/coffeeData";

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or lucide name
  color: string;
  condition: "first-step" | "path-progress" | "category-complete" | "quiz" | "tool-usage" | "streak";
  threshold?: number;
  pathId?: string;
  category?: string;
}

export const badges: Badge[] = [
  {
    id: "first-step",
    title: "أول خطوة",
    description: "أكمل أول درس",
    icon: "🏁",
    color: "bg-slate-100 text-slate-700 border-slate-300",
    condition: "first-step",
    threshold: 1,
  },
  {
    id: "barista-beginner",
    title: "باريستا مبتدئ",
    description: "أكمل 10 دروس في مسار الباريستا",
    icon: "☕",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    condition: "path-progress",
    pathId: "barista",
    threshold: 10,
  },
  {
    id: "barista-intermediate",
    title: "باريستا متوسط",
    description: "أكمل 25 درس في مسار الباريستا",
    icon: "🎖️",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    condition: "path-progress",
    pathId: "barista",
    threshold: 25,
  },
  {
    id: "barista-pro",
    title: "باريستا محترف",
    description: "أكمل جميع دروس مسار الباريستا",
    icon: "👑",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    condition: "path-progress",
    pathId: "barista",
  },
  {
    id: "drink-master",
    title: "صانع مشاريب",
    description: "أكمل جميع دروس المشروبات",
    icon: "🍵",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    condition: "category-complete",
    category: "drinks",
  },
  {
    id: "brew-master",
    title: "محترف التحضير",
    description: "أكمل جميع طرق التحضير",
    icon: "🔄",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    condition: "category-complete",
    category: "homebrew",
  },
  {
    id: "cafe-owner",
    title: "صاحب مقهى",
    description: "أكمل مسار تأسيس المقاهي",
    icon: "🏪",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    condition: "path-progress",
    pathId: "owner",
  },
  {
    id: "equipment-expert",
    title: "خبير المعدات",
    description: "أكمل جميع دروس المعدات",
    icon: "⚙️",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    condition: "category-complete",
    category: "equipment",
  },
  {
    id: "bean-expert",
    title: "خبير البن",
    description: "أكمل جميع دروس البن والتحميص",
    icon: "🫘",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    condition: "category-complete",
    category: "beans",
  },
  {
    id: "active-learner",
    title: "متعلم نشط",
    description: "أكمل 5 دروس",
    icon: "📚",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    condition: "first-step",
    threshold: 5,
  },
  {
    id: "quiz-taker",
    title: "المختبر",
    description: "اجتز اختبار مسار",
    icon: "📝",
    color: "bg-pink-50 text-pink-700 border-pink-200",
    condition: "quiz",
    threshold: 1,
  },
  {
    id: "tool-user",
    title: "محترف الحاسبة",
    description: "استخدم 3 أدوات تفاعلية",
    icon: "🧮",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    condition: "tool-usage",
    threshold: 3,
  },
];

export interface BadgeCheckInput {
  completedLessons: string[];
  quizPassed: string[];
  toolsUsed: string[];
}

export function checkBadges(input: BadgeCheckInput): string[] {
  const earned: string[] = [];

  for (const badge of badges) {
    let isEarned = false;

    switch (badge.condition) {
      case "first-step": {
        const threshold = badge.threshold ?? 1;
        if (input.completedLessons.length >= threshold) {
          isEarned = true;
        }
        break;
      }
      case "path-progress": {
        if (badge.pathId) {
          const path = learningPaths.find((p) => p.id === badge.pathId);
          if (path) {
            const completedInPath = path.lessons.filter((lid) =>
              input.completedLessons.includes(lid)
            ).length;
            if (badge.threshold) {
              isEarned = completedInPath >= badge.threshold;
            } else {
              isEarned = completedInPath === path.lessons.length && path.lessons.length > 0;
            }
          }
        }
        break;
      }
      case "category-complete": {
        if (badge.category) {
          const { lessons } = require("@/data/coffeeData");
          const categoryLessons = lessons.filter(
            (l: any) => l.category === badge.category
          );
          const completedInCategory = categoryLessons.filter((l: any) =>
            input.completedLessons.includes(l.id)
          ).length;
          isEarned =
            categoryLessons.length > 0 &&
            completedInCategory === categoryLessons.length;
        }
        break;
      }
      case "quiz": {
        const threshold = badge.threshold ?? 1;
        if (input.quizPassed.length >= threshold) {
          isEarned = true;
        }
        break;
      }
      case "tool-usage": {
        const threshold = badge.threshold ?? 3;
        if (input.toolsUsed.length >= threshold) {
          isEarned = true;
        }
        break;
      }
    }

    if (isEarned) {
      earned.push(badge.id);
    }
  }

  return earned;
}

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
