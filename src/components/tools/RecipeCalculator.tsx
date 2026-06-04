"use client";

import { useState } from "react";
import { ChefHat, RotateCcw, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const BREW_METHODS = [
  { id: "v60", name: "V60", ratio: 16, grind: "متوسط-خشن", temp: "93°C", time: "2:30 - 3:00" },
  { id: "french-press", name: "فرنش برس", ratio: 15, grind: "خشن", temp: "94°C", time: "4:00" },
  { id: "aeropress", name: "أيروبرس", ratio: 15, grind: "ناعم-متوسط", temp: "88°C", time: "2:00" },
  { id: "chemex", name: "كيميكس", ratio: 17, grind: "خشن", temp: "93°C", time: "3:30 - 4:30" },
  { id: "moka", name: "موكا بوت", ratio: 10, grind: "ناعم", temp: "-", time: "3:00 - 5:00" },
  { id: "turkish", name: "تركية", ratio: 10, grind: "ناعم جداً", temp: "-", time: "2:00 - 3:00" },
  { id: "cold-brew", name: "كولد برو", ratio: 10, grind: "خشن", temp: "بارد", time: "12-18 ساعة" },
  { id: "espresso", name: "إسبريسو", ratio: 2, grind: "ناعم", temp: "93°C", time: "25-30 ثانية" },
];

const RATIOS = [10, 12, 14, 15, 16, 17, 18];

export default function RecipeCalculator() {
  const [method, setMethod] = useState(BREW_METHODS[0]);
  const [dose, setDose] = useState(15);
  const [ratio, setRatio] = useState(method.ratio);
  const [saved, setSaved] = useState<{ dose: number; ratio: number; method: string }[]>([]);

  const water = Math.round(dose * ratio);

  const handleMethodChange = (methodId: string) => {
    const m = BREW_METHODS.find((b) => b.id === methodId);
    if (m) {
      setMethod(m);
      setRatio(m.ratio);
    }
  };

  const saveRecipe = () => {
    const recipe = { dose, ratio, method: method.name };
    if (!saved.find((s) => s.dose === recipe.dose && s.ratio === recipe.ratio && s.method === recipe.method)) {
      setSaved((prev) => [...prev, recipe]);
    }
  };

  const reset = () => {
    setMethod(BREW_METHODS[0]);
    setDose(15);
    setRatio(BREW_METHODS[0].ratio);
  };

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={reset}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          إعادة تعيين
        </button>
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-accent" />
          حاسبة وصفة القهوة
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Method */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5 text-right">
              طريقة التحضير
            </label>
            <select
              value={method.id}
              onChange={(e) => handleMethodChange(e.target.value)}
              className="w-full text-right p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {BREW_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dose */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-accent">{dose}g</span>
              <span className="text-xs text-muted-foreground">جرعة البن</span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={0.5}
              value={dose}
              onChange={(e) => setDose(Number(e.target.value))}
              className="w-full h-1.5 rounded-full bg-secondary accent-accent appearance-none cursor-pointer"
            />
          </div>

          {/* Ratio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-accent">1:{ratio}</span>
              <span className="text-xs text-muted-foreground">نسبة البرو</span>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {RATIOS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className={cn(
                    "text-[10px] px-2.5 py-1 rounded-full border transition-all",
                    ratio === r
                      ? "bg-accent text-primary-foreground border-accent"
                      : "bg-secondary text-muted-foreground border-border hover:border-accent/30"
                  )}
                >
                  1:{r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 mb-4">
            <p className="text-xs text-muted-foreground mb-2">كمية الماء المطلوبة</p>
            <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {water}g
            </div>
            <p className="text-[10px] text-muted-foreground">
              بناءً على {dose}g بن بنسبة 1:{ratio}
            </p>
          </div>

          <div className="space-y-2 text-right">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">درجة الطحن المقترحة:</span>
              <span className="font-semibold text-foreground">{method.grind}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">حرارة الماء:</span>
              <span className="font-semibold text-foreground">{method.temp}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">زمن التحضير:</span>
              <span className="font-semibold text-foreground">{method.time}</span>
            </div>
          </div>

          <button
            onClick={saveRecipe}
            className="mt-4 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            حفظ الوصفة
          </button>
        </div>
      </div>

      {/* Saved Recipes */}
      {saved.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-foreground mb-3 text-right">
            الوصفات المحفوظة
          </h4>
          <div className="flex gap-2 flex-wrap">
            {saved.map((s, i) => (
              <div
                key={i}
                className="text-[10px] bg-secondary border border-border px-3 py-1.5 rounded-full text-foreground"
              >
                {s.method} — {s.dose}g × 1:{s.ratio}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
