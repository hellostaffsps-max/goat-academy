"use client";

import { useState } from "react";
import { ChefHat, RotateCcw, Save } from "lucide-react";
import ToolRange from "@/components/tools/ToolRange";
import { cn } from "@/lib/utils";

const BREW_METHODS = [
  {
    id: "v60",
    name: "V60",
    ratio: 16,
    grind: "متوسط-خشن",
    temp: "93°C",
    time: "2:30 - 3:00",
  },
  {
    id: "french-press",
    name: "فرنش برس",
    ratio: 15,
    grind: "خشن",
    temp: "94°C",
    time: "4:00",
  },
  {
    id: "aeropress",
    name: "أيروبرس",
    ratio: 15,
    grind: "ناعم-متوسط",
    temp: "88°C",
    time: "2:00",
  },
  {
    id: "chemex",
    name: "كيميكس",
    ratio: 17,
    grind: "خشن",
    temp: "93°C",
    time: "3:30 - 4:30",
  },
  {
    id: "moka",
    name: "موكا بوت",
    ratio: 10,
    grind: "ناعم",
    temp: "-",
    time: "3:00 - 5:00",
  },
  {
    id: "turkish",
    name: "تركية",
    ratio: 10,
    grind: "ناعم جداً",
    temp: "-",
    time: "2:00 - 3:00",
  },
  {
    id: "cold-brew",
    name: "كولد برو",
    ratio: 10,
    grind: "خشن",
    temp: "بارد",
    time: "12-18 ساعة",
  },
  {
    id: "espresso",
    name: "إسبريسو",
    ratio: 2,
    grind: "ناعم",
    temp: "93°C",
    time: "25-30 ثانية",
  },
];

const FILTER_RATIOS = [10, 12, 14, 15, 16, 17, 18];
const ESPRESSO_RATIOS = [1, 1.5, 2, 2.5, 3];

export default function RecipeCalculator() {
  const [method, setMethod] = useState(BREW_METHODS[0]);
  const [dose, setDose] = useState(15);
  const [ratio, setRatio] = useState(method.ratio);
  const [saved, setSaved] = useState<
    { dose: number; ratio: number; method: string }[]
  >([]);

  const water = Math.round(dose * ratio * 10) / 10;
  const isEspresso = method.id === "espresso";
  const ratios = isEspresso ? ESPRESSO_RATIOS : FILTER_RATIOS;

  const handleMethodChange = (methodId: string) => {
    const m = BREW_METHODS.find((b) => b.id === methodId);
    if (m) {
      setMethod(m);
      setRatio(m.ratio);
    }
  };

  const saveRecipe = () => {
    const recipe = { dose, ratio, method: method.name };
    if (
      !saved.find(
        (s) =>
          s.dose === recipe.dose &&
          s.ratio === recipe.ratio &&
          s.method === recipe.method,
      )
    ) {
      setSaved((prev) => [...prev, recipe]);
    }
  };

  const reset = () => {
    setMethod(BREW_METHODS[0]);
    setDose(15);
    setRatio(BREW_METHODS[0].ratio);
  };

  return (
    <div className="card-premium p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={reset}
          className="min-h-11 rounded-lg px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          إعادة تعيين
        </button>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-accent" />
          حاسبة وصفة القهوة
        </h2>
      </div>

      <p className="mb-6 text-sm leading-7 text-muted-foreground">
        هذه القيم نقطة بداية للتجربة، وتُعدّل حسب البن والمعدة والطعم. في
        الإسبريسو تشير النسبة إلى وزن المشروب، وفي طرق الترشيح إلى ماء التحضير.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Method */}
          <div>
            <label
              htmlFor="recipe-method"
              className="text-sm text-muted-foreground block mb-1.5 text-right"
            >
              طريقة التحضير
            </label>
            <select
              id="recipe-method"
              value={method.id}
              onChange={(e) => handleMethodChange(e.target.value)}
              className="w-full text-right p-2.5 rounded-lg border border-border bg-background text-base min-h-11 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {BREW_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <ToolRange
            label="جرعة البن للوصفة (غ)"
            min={5}
            max={40}
            step={0.5}
            value={dose}
            onChange={setDose}
            format={(value) => `${value} g`}
          />

          {/* Ratio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-accent">1:{ratio}</span>
              <span className="text-sm text-muted-foreground">
                نسبة التحضير
              </span>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {ratios.map((r) => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  aria-pressed={ratio === r}
                  className={cn(
                    "text-sm min-h-11 min-w-12 px-3 py-2 rounded-xl border transition-all",
                    ratio === r
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-secondary text-muted-foreground border-border hover:border-accent/30",
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
            <p className="text-sm text-muted-foreground mb-2">
              {isEspresso
                ? "وزن المشروب المستهدف في الكوب"
                : "كمية ماء التحضير"}
            </p>
            <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {water}g
            </div>
            <p className="text-sm text-muted-foreground">
              بناءً على {dose}g بن بنسبة 1:{ratio}
            </p>
          </div>

          <div className="space-y-2 text-right">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                درجة الطحن المقترحة:
              </span>
              <span className="font-semibold text-foreground">
                {method.grind}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">حرارة الماء:</span>
              <span className="font-semibold text-foreground">
                {method.temp}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">زمن التحضير:</span>
              <span className="font-semibold text-foreground">
                {method.time}
              </span>
            </div>
          </div>

          <button
            onClick={saveRecipe}
            className="mt-4 min-h-11 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            حفظ الوصفة للجلسة
          </button>
        </div>
      </div>

      {/* Saved Recipes */}
      {saved.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border" role="status">
          <h4 className="text-sm font-bold text-foreground mb-3 text-right">
            وصفات هذه الجلسة
          </h4>
          <div className="flex gap-2 flex-wrap">
            {saved.map((s, i) => (
              <div
                key={i}
                className="text-sm bg-secondary border border-border px-3 py-1.5 rounded-full text-foreground"
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
