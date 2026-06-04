"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, Coffee, Calculator, GraduationCap, FileText } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Import local data for client-side search
import { lessons } from "@/data/coffeeData";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "lesson" | "tool";
  icon: React.ElementType;
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

const allItems: SearchResult[] = lessons.map((lesson) => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.description.slice(0, 80) + "...",
  category: lesson.category,
  type: "lesson",
  icon: categoryIcons[lesson.category] || BookOpen,
}));

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

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

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((item) => {
      const cat = item.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [results]);

  const handleSelect = useCallback(
    (id: string) => {
      setOpen(false);
      router.push(`/lesson/${id}`);
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
        <CommandInput
          placeholder="ابحث في الدورات والمقالات..."
          value={query}
          onValueChange={setQuery}
          dir="rtl"
        />
        <CommandList dir="rtl">
          {query.length < 2 && (
            <div className="py-6 text-center text-xs text-muted-foreground">
              اكتب حرفين على الأقل للبحث
            </div>
          )}
          {query.length >= 2 && results.length === 0 && (
            <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
              لا توجد نتائج للبحث &ldquo;{query}&rdquo;
            </CommandEmpty>
          )}
          {Object.entries(grouped).map(([category, items]) => (
            <CommandGroup
              key={category}
              heading={categoryLabels[category] || category}
              className="text-right"
            >
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSelect(item.id)}
                    className="text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-foreground truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
