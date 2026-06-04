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
    description: "أخشن ما يمكن لمنع العكارة",
    feel: "خشن جداً وحبيبات كبيرة",
  },
];

export default function GrindConverter() {
  const [selected, setSelected] = useState(GRIND_DATA[4]); // V60 default

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          محول درجات الطحن
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-muted-foreground block mb-3 text-right">
            اختر طريقة التحضير
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GRIND_DATA.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelected(method)}
                className={cn(
                  "text-[10px] sm:text-xs py-2 px-2 rounded-lg border transition-all text-right",
                  selected.id === method.id
                    ? "bg-accent text-primary-foreground border-accent font-bold"
                    : "bg-secondary text-muted-foreground border-border hover:border-accent/30"
                )}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {/* Visual Slider */}
          <div className="relative h-4 bg-secondary rounded-full mb-6 overflow-hidden">
            <div
              className="absolute top-0 h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${selected.level}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span className="text-[8px] text-muted-foreground">خشن جداً</span>
              <span className="text-[8px] text-muted-foreground">ناعم جداً</span>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-right">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] bg-accent/20 text-accent-foreground border border-accent/10 px-2 py-0.5 rounded-full font-semibold">
                {selected.label}
              </span>
              <h4 className="text-sm font-bold text-foreground">{selected.name}</h4>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">الشكل:</span>
                <span className="font-semibold text-foreground">{selected.description}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">الملمس:</span>
                <span className="font-semibold text-foreground">{selected.feel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
