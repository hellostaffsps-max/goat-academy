"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const GRIND_DATA = [
  {
    id: "espresso",
    name: "إسبريسو",
    level: 10,
    label: "ناعم جداً",
    description: "يشبه السكر الناعم أو الملح الناعم",
    feel: "مسحوقي وناعم",
  },
  {
    id: "turkish",
    name: "تركية",
    level: 5,
    label: "ناعم جداً",
    description: "أنعم من الإسبريسو، يشبه الدقيق",
    feel: "دقيق وناعم جداً",
  },
  {
    id: "moka",
    name: "موكا بوت",
    level: 25,
    label: "ناعم",
    description: "أخشن قليلاً من الإسبريسو",
    feel: "ناعم لكن لا يتكتل",
  },
  {
    id: "aeropress",
    name: "أيروبرس",
    level: 40,
    label: "ناعم-متوسط",
    description: "بين الإسبريسو والفلتر",
    feel: "ناعم مع بعض الحبيبات",
  },
  {
    id: "v60",
    name: "V60",
    level: 55,
    label: "متوسط-خشن",
    description: "حجم حبيبات السكر العادي",
    feel: "خشن بشكل واضح",
  },
  {
    id: "chemex",
    name: "كيميكس",
    level: 70,
    label: "خشن",
    description: "أخشن من V60، يشبه السكر الخشن",
    feel: "خشن ومُحسوس باللمس",
  },
  {
    id: "french-press",
    name: "فرنش برس",
    level: 85,
    label: "خشن جداً",
    description: "حبيبات كبيرة واضحة",
    feel: "خشن جداً وحبيبات كبيرة",
  },
  {
    id: "cold-brew",
    name: "كولد برو",
    level: 90,
    label: "خشن جداً",
    description: "طحن خشن كنقطة بداية، ويُعدّل حسب طريقة الترشيح",
    feel: "خشن جداً وحبيبات كبيرة",
  },
];

export default function GrindConverter() {
  const [selected, setSelected] = useState(GRIND_DATA[4]); // V60 default

  return (
    <div className="card-premium p-5 sm:p-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          دليل درجات الطحن
        </h2>
      </div>

      <p className="mb-5 text-sm leading-7 text-muted-foreground">
        وصف تقريبي للمقارنة، وليس تحويلًا بين أرقام المطاحن. ابدأ هنا ثم اضبط
        الطحنة حسب الوصفة والطعم.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-muted-foreground block mb-3 text-right">
            اختر طريقة التحضير
          </p>
          <div className="grid grid-cols-2 gap-2">
            {GRIND_DATA.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelected(method)}
                aria-pressed={selected.id === method.id}
                className={cn(
                  "text-sm min-h-11 py-2 px-3 rounded-lg border transition-all text-right",
                  selected.id === method.id
                    ? "bg-accent text-accent-foreground border-accent font-bold"
                    : "bg-secondary text-muted-foreground border-border hover:border-accent/30",
                )}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {/* Visual Slider */}
          <div className="relative h-3 bg-secondary rounded-full mb-2 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${selected.level}%` }}
            />
          </div>
          <div
            dir="ltr"
            className="flex items-center justify-between mb-5 text-sm text-muted-foreground"
          >
            <span className="text-sm text-muted-foreground">ناعم جداً</span>
            <span className="text-sm text-muted-foreground">خشن جداً</span>
          </div>

          {/* Result Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-right">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm bg-accent/20 text-foreground border border-accent/10 px-2 py-0.5 rounded-full font-semibold">
                {selected.label}
              </span>
              <h4 className="text-sm font-bold text-foreground">
                {selected.name}
              </h4>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="text-muted-foreground">الشكل:</span>
                <span className="font-semibold text-foreground">
                  {selected.description}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="text-muted-foreground">الملمس:</span>
                <span className="font-semibold text-foreground">
                  {selected.feel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
