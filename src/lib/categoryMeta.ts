import {
  Coffee,
  Flame,
  Wrench,
  Bean,
  BookOpen,
  Store,
  Calculator,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CategoryMeta {
  icon: LucideIcon;
  gradient: string;
}

export const categoryMeta: Record<string, CategoryMeta> = {
  drinks: { icon: Coffee, gradient: "from-secondary to-muted" },
  homebrew: { icon: Flame, gradient: "from-secondary to-muted" },
  equipment: { icon: Wrench, gradient: "from-secondary to-muted" },
  beans: { icon: Bean, gradient: "from-secondary to-muted" },
  terms: { icon: BookOpen, gradient: "from-secondary to-muted" },
  cafe: { icon: Store, gradient: "from-secondary to-muted" },
  costing: { icon: Calculator, gradient: "from-secondary to-muted" },
};

export function getCategoryMeta(catId: string): CategoryMeta {
  return (
    categoryMeta[catId] || { icon: Coffee, gradient: "from-secondary to-muted" }
  );
}
