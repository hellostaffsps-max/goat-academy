"use client";

import * as React from "react";
import { useStore } from "@/store/useStore";
import { useTheme } from "next-themes";
import {
  Heart,
  BookOpen,
  Award,
  RotateCcw,
  Moon,
  Type,
  Info,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { lessons } from "@/data/lessonCatalog";
import { resetUserLearningData } from "@/actions/user-data";

const subscribe = () => () => {};
export default function SettingsPage() {
  const {
    favorites,
    completedLessons,
    settings,
    updateSettings,
    clearData,
    saveError,
    accountId,
    pendingLessons,
    pendingFavorites,
  } = useStore();
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const [resetError, setResetError] = React.useState<string | null>(null);
  const [resetting, setResetting] = React.useState(false);
  const completedCount = lessons.filter((lesson) =>
    completedLessons.includes(lesson.id),
  ).length;
  const handleReset = async () => {
    if (
      !window.confirm(
        "هل تريد مسح المفضلة والتقدم وإعدادات التعلم؟ لا يمكن التراجع عن هذه الخطوة.",
      )
    )
      return;
    setResetting(true);
    setResetError(null);
    try {
      if (accountId) await resetUserLearningData(accountId);
      clearData();
    } catch {
      setResetError(
        "تعذّر إكمال إعادة التعيين. قد تكون بعض البيانات قد مُسحت؛ أعد تحميل الصفحة للتحقق ثم حاول مرة أخرى.",
      );
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div className="text-right">
        <h1 className="heading-xl">الإعدادات</h1>
        <p className="text-base text-muted-foreground mt-3">
          تخصيص تجربتك في الأكاديمية
        </p>
      </div>

      {saveError && (
        <p role="alert" className="text-sm text-destructive">
          {saveError}
        </p>
      )}
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">
            {completedCount}
          </div>
          <div className="text-xs text-muted-foreground">دروس مكتملة</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <Heart className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">
            {favorites.length}
          </div>
          <div className="text-xs text-muted-foreground">مفضلة</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <Award className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">
            {Math.round((completedCount / lessons.length) * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">التقدم</div>
        </div>
      </div>

      {/* Appearance */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Moon className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">المظهر</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block text-right">
              سمة التطبيق (الوضع الداكن / الفاتح)
            </label>
            {mounted && (
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    aria-pressed={theme === t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 min-h-11 py-2 rounded-lg text-sm font-medium transition-all border ${
                      theme === t
                        ? "bg-primary text-primary-foreground border border-primary"
                        : "bg-secondary/20 text-muted-foreground border border-border hover:border-primary/20"
                    }`}
                  >
                    {t === "light" && "فاتح"}
                    {t === "dark" && "داكن"}
                    {t === "system" && "تلقائي"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block text-right">
              حجم الخط
            </label>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  aria-pressed={settings.fontSize === size}
                  onClick={() => updateSettings({ fontSize: size })}
                  className={`flex-1 min-h-11 py-2 rounded-lg text-sm font-medium transition-all border ${
                    settings.fontSize === size
                      ? "bg-primary text-primary-foreground border border-primary"
                      : "bg-secondary/20 text-muted-foreground border border-border hover:border-primary/20"
                  }`}
                >
                  {size === "small" && "صغير"}
                  {size === "medium" && "متوسط"}
                  {size === "large" && "كبير"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Type className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">إمكانية الوصول</h3>
        </div>
        <div className="p-4 flex items-center justify-between">
          <button
            type="button"
            role="switch"
            aria-label="تقليل الحركة"
            aria-checked={settings.reducedMotion}
            onClick={() =>
              updateSettings({ reducedMotion: !settings.reducedMotion })
            }
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg"
          >
            <span
              aria-hidden="true"
              className={`relative h-6 w-11 rounded-full ${settings.reducedMotion ? "bg-primary" : "bg-secondary border border-border"}`}
            >
              <span
                className={`absolute right-1 top-1 h-4 w-4 rounded-full transition-transform ${settings.reducedMotion ? "-translate-x-5 bg-primary-foreground" : "bg-foreground"}`}
              />
            </span>
          </button>
          <div className="text-right">
            <div className="text-sm text-foreground">تقليل الحركة</div>
            <div className="text-xs text-muted-foreground">
              إيقاف التأثيرات المتحركة
            </div>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">البيانات</h3>
        </div>
        <div className="p-4">
          <button
            onClick={handleReset}
            disabled={
              resetting ||
              pendingLessons.length > 0 ||
              pendingFavorites.length > 0
            }
            className="w-full py-2.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 transition-all"
          >
            {resetting ? "جارٍ إعادة التعيين…" : "مسح تقدم التعلم والمفضلة"}
          </button>
          {resetError && (
            <p role="alert" className="text-sm text-destructive mt-3">
              {resetError}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2 text-right">
            هذا سيحذف المفضلة والتقدم والإعدادات
          </p>
        </div>
      </section>

      {/* About */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">عن الأكاديمية</h3>
        </div>
        <div className="p-4 text-right">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-[200px] h-[80px] overflow-hidden">
              <BrandLogo className="object-contain object-right w-full h-full" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            أكاديمية تفاعلية متكاملة لعشاق القهوة والباريستا وأصحاب المقاهي. تضم
            دروساً تعليمية تغطي مشروبات القهوة، طرق التحضير، المعدات، البن
            والتحميص، المصطلحات، إنشاء المقاهي، ودراسة التكاليف.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>الإصدار 1.0</span>
            <span className="mx-1">|</span>
            <span>2026</span>
          </div>
        </div>
      </section>

      <div className="h-4" />
    </div>
  );
}
