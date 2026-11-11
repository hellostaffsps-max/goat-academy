"use client";

import { useSyncExternalStore } from "react";
import { CheckSquare, RotateCcw, Check, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  category: "opening" | "midday" | "closing";
}

const DEFAULT_TASKS: Task[] = [
  {
    id: "o1",
    text: "فحص الإسبريسو عند الافتتاح (طعم ووقت)",
    category: "opening",
  },
  { id: "o2", text: "ضبط الوصفة حسب البن ونتيجة التذوق", category: "opening" },
  { id: "o3", text: "تنظيف البورتافلتر والسلال", category: "opening" },
  { id: "o4", text: "شطف رأس المجموعة", category: "opening" },
  { id: "o5", text: "فحص مستوى الماء في الماكينة", category: "opening" },
  { id: "m1", text: "تنظيف منطقة التبخير", category: "midday" },
  {
    id: "m2",
    text: "مراجعة تواريخ الحليب واستخدام الأقرب انتهاءً أولًا",
    category: "midday",
  },
  { id: "m3", text: "فحص جودة المشروبات بين الحين والآخر", category: "midday" },
  { id: "m4", text: "تنظيف الأسطح ومنطقة البار", category: "midday" },
  { id: "c1", text: "تنظيف البار قبل الإغلاق", category: "closing" },
  { id: "c2", text: "تنظيف الماكينة حسب تعليمات المصنع", category: "closing" },
  { id: "c3", text: "تفريغ صندوق القهوة المستعملة", category: "closing" },
  { id: "c4", text: "تنظيف الثلاجة ومراجعة التواريخ", category: "closing" },
  {
    id: "c5",
    text: "التخلص من بقايا الحليب المبخّر وحفظ الحليب البارد بأمان",
    category: "closing",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  opening: "بداية اليوم",
  midday: "منتصف اليوم",
  closing: "نهاية اليوم",
};

const CHECKLIST_KEY = "goat_daily_checklist";
const CHECKLIST_EVENT = "goat-checklist-change";
const EMPTY_CHECKLIST: string[] = [];
let cachedRaw: string | null | undefined;
let cachedDay = "";
let cachedChecked: string[] = EMPTY_CHECKLIST;
let memoryRaw: string | null = null;
let useMemoryOnly = false;

function checklistSnapshot() {
  const today = new Date().toDateString();
  let raw = memoryRaw;
  try {
    if (!useMemoryOnly) raw = localStorage.getItem(CHECKLIST_KEY);
  } catch {
    /* Use memory when storage is blocked. */
  }
  if (raw === cachedRaw && today === cachedDay) return cachedChecked;
  cachedRaw = raw;
  cachedDay = today;
  cachedChecked = EMPTY_CHECKLIST;
  try {
    const saved = raw ? JSON.parse(raw) : null;
    if (saved?.date === today && Array.isArray(saved.checked)) {
      cachedChecked = [
        ...new Set<string>(
          saved.checked.filter(
            (id: unknown): id is string =>
              typeof id === "string" &&
              DEFAULT_TASKS.some((task) => task.id === id),
          ),
        ),
      ];
    }
  } catch {
    /* Ignore malformed storage. */
  }
  return cachedChecked;
}

function subscribeChecklist(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHECKLIST_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHECKLIST_EVENT, callback);
  };
}

function saveChecklist(checked: string[]) {
  memoryRaw = JSON.stringify({ date: new Date().toDateString(), checked });
  try {
    localStorage.setItem(CHECKLIST_KEY, memoryRaw);
    useMemoryOnly = false;
  } catch {
    useMemoryOnly = true;
  }
  window.dispatchEvent(new Event(CHECKLIST_EVENT));
}

export default function DailyChecklist() {
  const checked = useSyncExternalStore(
    subscribeChecklist,
    checklistSnapshot,
    () => EMPTY_CHECKLIST,
  );
  const toggle = (id: string) => {
    const current = checklistSnapshot();
    saveChecklist(
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };
  const reset = () => saveChecklist([]);

  const progress = Math.round((checked.length / DEFAULT_TASKS.length) * 100);

  const grouped = DEFAULT_TASKS.reduce(
    (acc, task) => {
      if (!acc[task.category]) acc[task.category] = [];
      acc[task.category].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  return (
    <div className="card-premium p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="min-h-11 rounded-lg px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة تعيين
          </button>
          <button
            onClick={() => window.print()}
            className="min-h-11 rounded-lg px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2"
          >
            <Printer className="h-4 w-4" aria-hidden="true" /> طباعة الصفحة
          </button>
        </div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-accent" />
          قائمة مهام يومية للمقهى
        </h2>
      </div>

      <p className="mb-6 text-sm leading-7 text-muted-foreground">
        قائمة متابعة شخصية لهذا اليوم على هذا الجهاز. عدّل إجراءات العمل الفعلية
        حسب معدات مقهاك وتعليماتها.
      </p>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {checked.length} من {DEFAULT_TASKS.length}
          </span>
          <span className="text-sm font-semibold text-foreground">
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
            <h4 className="text-sm font-bold text-foreground mb-2 text-right">
              {CATEGORY_LABELS[category]}
            </h4>
            <div className="space-y-2">
              {tasks.map((task) => {
                const isChecked = checked.includes(task.id);
                return (
                  <button
                    key={task.id}
                    onClick={() => toggle(task.id)}
                    role="checkbox"
                    aria-checked={isChecked}
                    className={cn(
                      "w-full min-h-12 flex items-center gap-3 p-3 rounded-xl border text-right transition-all",
                      isChecked
                        ? "bg-accent/10 border-accent/40 text-foreground"
                        : "bg-card border-border hover:border-accent/30",
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all",
                        isChecked
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {isChecked && (
                        <Check
                          className="h-3 w-3 text-primary-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm transition-all",
                        isChecked
                          ? "text-muted-foreground line-through"
                          : "text-foreground",
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
