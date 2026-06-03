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
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const { favorites, completedLessons, settings, updateSettings, clearData } = useStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const supabase = createClient();

  const handleReset = async () => {
    if (typeof window !== "undefined" && confirm("هل أنت متأكد من حذف جميع البيانات؟")) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_favorites").delete().eq("user_id", user.id);
          await supabase.from("user_progress").delete().eq("user_id", user.id);
          await supabase.from("user_settings").delete().eq("user_id", user.id);
        }
      } catch {
        // Ignore errors
      }
      clearData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-right">
        <h2 className="text-xl font-bold text-foreground">الإعدادات</h2>
        <p className="text-xs text-muted-foreground mt-1">
          تخصيص تجربتك في الأكاديمية
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">
            {completedLessons.length}
          </div>
          <div className="text-[10px] text-muted-foreground">دروس مكتملة</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <Heart className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">
            {favorites.length}
          </div>
          <div className="text-[10px] text-muted-foreground">مفضلة</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <Award className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">
            {Math.round((completedLessons.length / 90) * 100)}%
          </div>
          <div className="text-[10px] text-muted-foreground">التقدم</div>
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
                    onClick={() => setTheme(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
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
                  onClick={() => updateSettings({ fontSize: size })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
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
          <h3 className="text-sm font-bold text-foreground">
            إمكانية الوصول
          </h3>
        </div>
        <div className="p-4 flex items-center justify-between">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) =>
                updateSettings({ reducedMotion: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-secondary/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
          <div className="text-right">
            <div className="text-sm text-foreground">تقليل الحركة</div>
            <div className="text-[10px] text-muted-foreground">
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
            className="w-full py-2.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 transition-all"
          >
            إعادة تعيين جميع البيانات
          </button>
          <p className="text-[10px] text-muted-foreground mt-2 text-right">
            هذا سيحذف المفضلة والتقدم والإعدادات
          </p>
        </div>
      </section>

      {/* About */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            عن الأكاديمية
          </h3>
        </div>
        <div className="p-4 text-right">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-[200px] h-[80px] overflow-hidden">
              <BrandLogo className="object-contain object-right w-full h-full" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            أكاديمية تفاعلية متكاملة لعشاق القهوة والباريستا وأصحاب المقاهي.
            تضم أكثر من 90 درساً تعليمياً covering مشروبات القهوة، طرق
            التحضير، المعدات، البن والتحميص، المصطلحات، إنشاء المقاهي، ودراسة
            التكاليف.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
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
