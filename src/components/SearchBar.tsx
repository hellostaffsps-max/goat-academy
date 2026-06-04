"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Coffee, Calculator, GraduationCap, FileText, Wrench, Route, Trophy, X } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";

// Import local data for client-side search
import { lessons, learningPaths } from "@/data/coffeeData";
import { articles } from "@/data/blogData";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  type: "lesson" | "article" | "path" | "tool" | "success";
  icon: React.ElementType;
  href: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  drinks: Coffee,
  homebrew: Coffee,
  equipment: Calculator,
  beans: Coffee,
  terms: BookOpen,
  cafe: GraduationCap,
  costing: FileText,
};

const categoryLabels: Record<string, string> = {
  drinks: "مشروبات",
  homebrew: "تحضير",
  equipment: "معدات",
  beans: "البن",
  terms: "مصطلحات",
  cafe: "تأسيس مقهى",
  costing: "تكاليف",
};

const typeIcons: Record<SearchResult["type"], React.ElementType> = {
  lesson: BookOpen,
  article: FileText,
  path: Route,
  tool: Wrench,
  success: Trophy,
};

const typeLabels: Record<SearchResult["type"], string> = {
  lesson: "درس",
  article: "مقال",
  path: "مسار",
  tool: "أداة",
  success: "قصة نجاح",
};

const allItems: SearchResult[] = [
  // Lessons
  ...lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description.slice(0, 80) + (lesson.description.length > 80 ? "..." : ""),
    category: lesson.category,
    categoryLabel: categoryLabels[lesson.category] || lesson.category,
    type: "lesson" as const,
    icon: categoryIcons[lesson.category] || BookOpen,
    href: `/lesson/${lesson.id}`,
  })),
  // Articles
  ...articles.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description.slice(0, 80) + (article.description.length > 80 ? "..." : ""),
    category: article.category,
    categoryLabel: article.category_label || article.category,
    type: "article" as const,
    icon: FileText,
    href: `/blog/${article.id}`,
  })),
  // Learning Paths
  ...learningPaths.map((path) => ({
    id: path.id,
    title: path.title,
    description: path.description.slice(0, 80) + (path.description.length > 80 ? "..." : ""),
    category: "paths",
    categoryLabel: "مسار تعليمي",
    type: "path" as const,
    icon: Route,
    href: `/paths`,
  })),
  // Tools
  {
    id: "recipe-calculator",
    title: "حاسبة الوصفات",
    description: "احسب نسب القهوة والماء بدقة",
    category: "tools",
    categoryLabel: "أدوات",
    type: "tool" as const,
    icon: Calculator,
    href: "/tools",
  },
  {
    id: "grind-converter",
    title: "محول الطحن",
    description: "قارن بين درجات الطحن لمختلف المطاحن",
    category: "tools",
    categoryLabel: "أدوات",
    type: "tool" as const,
    icon: Wrench,
    href: "/tools",
  },
  {
    id: "daily-checklist",
    title: "قائمة التحقق اليومية",
    description: "تأكد من جاهزية مقهاك يومياً",
    category: "tools",
    categoryLabel: "أدوات",
    type: "tool" as const,
    icon: FileText,
    href: "/tools",
  },
];

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure dialog is mounted
      const timer = setTimeout(() => {
        const input = document.querySelector("[cmdk-input]") as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase().trim();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((item) => {
      const type = item.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    });
    return groups;
  }, [results]);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/60 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
        aria-label="فتح البحث"
      >
        <Search className="w-3.5 h-3.5" />
        <span>بحث...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border text-[9px] font-mono">
          Ctrl K
        </kbd>
      </button>

      {/* Mobile search icon */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50 border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="فتح البحث"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">البحث</DialogTitle>
        <CommandInput
          placeholder="ابحث في الدورات والمقالات والمسارات..."
          value={query}
          onValueChange={setQuery}
          dir="rtl"
        />
        <CommandList dir="rtl">
          {query.length < 2 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              اكتب حرفين على الأقل للبحث
            </div>
          )}
          {query.length >= 2 && results.length === 0 && (
            <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
              لا توجد نتائج للبحث &ldquo;{query}&rdquo;
            </CommandEmpty>
          )}
          {Object.entries(grouped).map(([type, items]) => {
            const TypeIcon = typeIcons[type as SearchResult["type"]];
            return (
              <CommandGroup
                key={type}
                heading={
                  <span className="flex items-center gap-1.5">
                    <TypeIcon className="w-3 h-3" />
                    {typeLabels[type as SearchResult["type"]]}
                  </span>
                }
                className="text-right"
              >
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={`${item.type}-${item.id}`}
                      value={`${item.type}-${item.id}-${item.title}`}
                      onSelect={() => handleSelect(item.href)}
                      className="text-right cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full" dir="rtl">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <div className="text-sm font-medium text-foreground truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded shrink-0">
                          {item.categoryLabel}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
