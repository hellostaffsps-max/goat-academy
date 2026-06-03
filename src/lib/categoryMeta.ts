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
  drinks:    { icon: Coffee,     gradient: "from-amber-500/10 to-orange-500/5" },
  homebrew:  { icon: Flame,      gradient: "from-rose-500/10 to-pink-500/5" },
  equipment: { icon: Wrench,     gradient: "from-sky-500/10 to-blue-500/5" },
  beans:     { icon: Bean,       gradient: "from-lime-500/10 to-emerald-500/5" },
  terms:     { icon: BookOpen,   gradient: "from-violet-500/10 to-purple-500/5" },
  cafe:      { icon: Store,      gradient: "from-teal-500/10 to-cyan-500/5" },
  costing:   { icon: Calculator, gradient: "from-yellow-500/10 to-amber-500/5" },
};

export function getCategoryMeta(catId: string): CategoryMeta {
  return categoryMeta[catId] || { icon: Coffee, gradient: "from-muted to-muted/50" };
}
