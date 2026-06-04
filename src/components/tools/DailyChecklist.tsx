"use client";

import { useState, useEffect } from "react";
import { CheckSquare, RotateCcw, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  category: "opening" | "midday" | "closing";
}

const DEFAULT_TASKS: Task[] = [
  { id: "o1", text: "فحص الإسبريسو عند الافتتاح (طعم ووقت)", category: "opening" },
  { id: "o2", text: "معايرة الطحن حسب الطقس والبن", category: "opening" },
  { id: "o3", text: "تنظيف البورتافلتر والسلال", category: "opening" },
  { id: "o4", text: "شطف رأس المجموعة", category: "opening" },
  { id: "o5", text: "فحص مستوى الماء في الماكينة", category: "opening" },
  { id: "m1", text: "تنظيف منطقة التبخير", category: "midday" },
  { id: "m2", text: "تدوير الحليب (FIFO)", category: "midday" },
  { id: "m3", text: "فحص جودة المشروبات بين الحين والآخر", category: "midday" },
  { id: "m4", text: "تنظيف الأسطح ومنطقة البار", category: "midday" },
  { id: "c1", text: "تنظيف البار قبل الإغلاق", category: "closing" },
  { id: "c2", text: "تنظيف الماكينة والباك فلاش", category: "closing" },
  { id: "c3", text: "تفريغ صندوق القهوة المستعملة", category: "closing" },
  { id: "c4", text: "تنظيف الثلاجة ومراجعة التواريخ", category: "closing" },
  { id: "c5", text: "حفظ الحليب المتبقي أو التخلص منه", category: "closing" },
];

const CATEGORY_LABELS: Record<string, string> = {
  opening: "☀️ بداية اليوم",
  midday: "🌤️ منتصف اليوم",
  closing: "🌙 نهاية اليوم",
};

export default function DailyChecklist() {
  const [checked, setChecked] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("goat_daily_checklist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only restore if same day
        if (parsed.date === new Date().toDateString()) {
          setChecked(parsed.checked);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem(
      "goat_daily_checklist",
      JSON.stringify({
        date: new Date().toDateString(),
        checked,
      })
    );
  }, [checked, isClient]);

  const toggle = (id: string) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const reset = () => setChecked([]);

  const printChecklist = () => {
    window.print();
  };

  const progress = Math.round((checked.length / DEFAULT_TASKS.length) * 100);

  const grouped = DEFAULT_TASKS.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة تعيين
          </button>
          <button
            onClick={printChecklist}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Printer className="w-3 h-3" />
            طباعة
          </button>
        </div>
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-accent" />
          قائمة مهام يومية للمقهى
        </h3>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground">
            {checked.length} من {DEFAULT_TASKS.length}
          </span>
          <span className="text-xs font-semibold text-foreground">
            {progress}%
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks by category */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([category, tasks]) => (
          <div key={category}>
            <h4 className="text-xs font-bold text-foreground mb-2 text-right">
              {CATEGORY_LABELS[category]}
            </h4>
            <div className="space-y-2">
              {tasks.map((task) => {
                const isChecked = checked.includes(task.id);
                return (
                  <button
                    key={task.id}
                    onClick={() => toggle(task.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-right transition-all",
                      isChecked
                        ? "bg-emerald-50/40 border-emerald-200 text-emerald-800"
                        : "bg-card border-border hover:border-accent/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all",
                        isChecked
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isChecked && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs transition-all",
                        isChecked
                          ? "text-emerald-700 line-through opacity-70"
                          : "text-foreground"
                      )}
                    >
                      {task.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
