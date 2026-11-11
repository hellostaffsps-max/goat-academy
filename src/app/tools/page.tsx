"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Calculator, RotateCcw, CheckCircle2, ArrowUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import RecipeCalculator from "@/components/tools/RecipeCalculator";
import GrindConverter from "@/components/tools/GrindConverter";
import DailyChecklist from "@/components/tools/DailyChecklist";
import ToolRange from "@/components/tools/ToolRange";

const TOOLS = [
  { id: "cafe-cost", label: "تكلفة تأسيس المقهى" },
  { id: "drink-pricing", label: "تسعير المشروبات" },
  { id: "extraction", label: "نسبة الاستخلاص" },
  { id: "recipe-calculator", label: "وصفة القهوة" },
  { id: "grind-converter", label: "دليل الطحن" },
  { id: "daily-checklist", label: "مهام المقهى اليومية" },
  { id: "personality-quiz", label: "اكتشف ذوقك" },
];
const panelClass = "card-premium p-5 sm:p-7";
const resultClass =
  "flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-accent/10 border border-accent/20";
const resetClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground";

function formatShekel(value: number): string {
  return `₪${Math.round(value).toLocaleString("ar-EG-u-nu-latn")}`;
}

// Editable example budgets in ILS, not exchange rates or market quotations.
const INITIAL_BUDGET = [55500, 29600, 18500, 7400, 11100, 37000];
const BUDGET_LABELS = [
  "المعدات",
  "الأثاث والديكور",
  "الإيجار والتأمين",
  "التراخيص",
  "التسويق",
  "رأس المال العامل",
];
function CafeCostCalculator() {
  const [budget, setBudget] = useState(INITIAL_BUDGET);
  const total = budget.reduce((sum, value) => sum + value, 0);
  return (
    <div className={panelClass}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">حاسبة تكلفة فتح المقهى</h2>
        <button
          onClick={() => setBudget([...INITIAL_BUDGET])}
          className={resetClass}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> إعادة تعيين
        </button>
      </div>
      <p className="mb-6 text-sm leading-7 text-muted-foreground">
        الأرقام أمثلة قابلة للتعديل بالشيكل. أدخل ميزانيتك لكل بند؛ لا تمثل
        أسعار السوق أو عرض سعر لمشروعك.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {BUDGET_LABELS.map((label, index) => (
            <ToolRange
              key={label}
              label={label}
              value={budget[index]}
              min={0}
              max={200000}
              step={100}
              format={formatShekel}
              onChange={(value) =>
                setBudget((current) =>
                  current.map((item, i) => (i === index ? value : item)),
                )
              }
            />
          ))}
        </div>
        <div className={resultClass}>
          <p className="mb-2 text-sm text-muted-foreground">
            مجموع البنود المدخلة
          </p>
          <output
            className="mb-3 text-3xl font-bold tabular-nums sm:text-4xl"
            dir="ltr"
          >
            {formatShekel(total)}
          </output>
          <p className="text-sm leading-7 text-muted-foreground">
            راجع البنود الناقصة والضرائب والاحتياطي حسب مشروعك قبل اعتماد
            الميزانية.
          </p>
        </div>
      </div>
    </div>
  );
}

function DrinkPricingCalculator() {
  const [cost, setCost] = useState(8);
  const [targetMargin, setTargetMargin] = useState(65);
  const price = cost / (1 - targetMargin / 100);
  const difference = price - cost;
  return (
    <div className={panelClass}>
      <h2 className="mb-3 text-lg font-bold">حاسبة تسعير المشروبات</h2>
      <p className="mb-6 text-sm leading-7 text-muted-foreground">
        اختر التكلفة والهامش الذي تريد حسابه. الهامش نسبة من سعر البيع، وليس
        زيادة على التكلفة.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <ToolRange
            label="التكلفة المدخلة للكوب (شيكل)"
            min={0.5}
            max={100}
            step={0.5}
            value={cost}
            onChange={setCost}
            format={(value) => `₪${value}`}
          />
          <ToolRange
            label="الهامش المستهدف من سعر البيع"
            min={0}
            max={95}
            value={targetMargin}
            onChange={setTargetMargin}
            format={(value) => `${value}%`}
          />
        </div>
        <div className={resultClass}>
          <p className="mb-2 text-sm text-muted-foreground">
            سعر البيع حسب مدخلاتك
          </p>
          <output
            dir="ltr"
            className="mb-2 text-3xl font-bold tabular-nums sm:text-4xl"
          >
            ₪{price.toFixed(2)}
          </output>
          <p className="mb-2 text-sm font-semibold">
            الفرق عن التكلفة: ₪{difference.toFixed(2)}
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            هذا الفرق ليس صافي الربح؛ أي مصروفات أو ضرائب لم تدخلها تحتاج حسابًا
            منفصلًا.
          </p>
        </div>
      </div>
    </div>
  );
}

function ExtractionCalculator() {
  const [dose, setDose] = useState(18);
  const [yield_, setYield] = useState(36);
  const [tds, setTds] = useState(8.5);
  const ratio = (yield_ / dose).toFixed(1);
  const extraction = ((yield_ * tds) / dose).toFixed(1);
  return (
    <div className={panelClass}>
      <h2 className="mb-3 text-lg font-bold">حاسبة نسبة الاستخلاص</h2>
      <p className="mb-6 text-sm leading-7 text-muted-foreground">
        أدخل وزن البن ووزن المشروب وقراءة TDS المقاسة. القيم الافتراضية مثال
        حسابي وليست قياسًا لقهوتك.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <ToolRange
            label="جرعة البن الجاف (غ)"
            min={5}
            max={40}
            step={0.5}
            value={dose}
            onChange={setDose}
            format={(value) => `${value} g`}
          />
          <ToolRange
            label="وزن المشروب في الكوب (غ)"
            min={10}
            max={600}
            value={yield_}
            onChange={setYield}
            format={(value) => `${value} g`}
          />
          <ToolRange
            label="المواد الذائبة TDS (%)"
            min={0.1}
            max={15}
            step={0.1}
            value={tds}
            onChange={setTds}
            format={(value) => `${value}%`}
          />
        </div>
        <div className={resultClass}>
          <p className="mb-2 text-sm text-muted-foreground">
            نسبة الاستخلاص المحسوبة
          </p>
          <output className="mb-2 text-3xl font-bold tabular-nums sm:text-4xl">
            {extraction}%
          </output>
          <p className="mb-3 text-sm font-semibold">
            نسبة البن إلى المشروب <bdi>1:{ratio}</bdi>
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            الرقم يصف الوصفة ولا يحكم وحده على جودة الطعم. إذا تجاوز 100% فتحقق
            من القياسات والوحدات.
          </p>
        </div>
      </div>
    </div>
  );
}

const QUESTIONS = [
  {
    q: "كيف تفضل مذاق قهوتك؟",
    options: ["قوية ومركزة", "خفيفة وواضحة", "حلوة وكريمية"],
  },
  { q: "كيف تفضل شربها؟", options: ["ساخنة دون حليب", "مع الحليب", "باردة"] },
  {
    q: "كيف تحب تحضيرها؟",
    options: ["بماكينة الإسبريسو", "بالترشيح اليدوي", "أحب تجربة طرق مختلفة"],
  },
];
function CoffeePersonalityQuiz() {
  const [answers, setAnswers] = useState<number[]>([]);
  const question = QUESTIONS[answers.length];
  const recommendation =
    answers[1] === 1
      ? "جرّب اللاتيه"
      : answers[1] === 2
        ? "جرّب الفلتر المثلج"
        : answers[0] === 0
          ? "جرّب الإسبريسو"
          : "جرّب قهوة الفلتر";
  return (
    <div className={panelClass}>
      <h2 className="mb-2 text-lg font-bold">اكتشف ذوقك في القهوة</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        اختيار ممتع يقترح نقطة بداية للتجربة، وليس تقييمًا لمهاراتك.
      </p>
      {question ? (
        <div key={answers.length} aria-live="polite">
          <p className="mb-2 text-sm text-muted-foreground">
            السؤال {answers.length + 1} من {QUESTIONS.length}
          </p>
          <h3 className="mb-4 text-base font-semibold">{question.q}</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => setAnswers((previous) => [...previous, index])}
                className="min-h-12 rounded-xl border border-border p-3 text-right text-sm hover:border-accent hover:bg-accent/10"
              >
                {option}
              </button>
            ))}
          </div>
          {answers.length > 0 && (
            <button
              onClick={() => setAnswers((previous) => previous.slice(0, -1))}
              className={`${resetClass} mt-4`}
            >
              السؤال السابق
            </button>
          )}
        </div>
      ) : (
        <div className="text-center" role="status">
          <CheckCircle2 className="mx-auto mb-4 h-10 w-10" aria-hidden="true" />
          <h3 className="mb-3 text-xl font-bold">{recommendation}</h3>
          <p className="mb-4 text-sm leading-7 text-muted-foreground">
            ابدأ بوصفة بسيطة وعدّلها حسب تفضيلك. تقدر تتعلم التحضير خطوة بخطوة
            في مكتبة الدروس.
          </p>
          <Link href="/courses" className="btn-premium mb-3">
            تصفح الدروس
          </Link>
          <button
            onClick={() => setAnswers([])}
            className={`${resetClass} mx-auto flex`}
          >
            <RotateCcw className="h-4 w-4" /> إعادة التجربة
          </button>
        </div>
      )}
    </div>
  );
}

function TrackedTool({
  toolId,
  children,
}: {
  toolId: string;
  children: React.ReactNode;
}) {
  const { trackToolUsage } = useStore();
  const [tracked, setTracked] = useState(false);
  const handleInteract = useCallback(() => {
    if (!tracked) {
      trackToolUsage(toolId);
      setTracked(true);
    }
  }, [tracked, toolId, trackToolUsage]);
  return (
    <section
      id={toolId}
      aria-label={TOOLS.find((tool) => tool.id === toolId)?.label}
      className="scroll-mt-44"
      onClick={handleInteract}
      onInput={handleInteract}
    >
      {children}
      <a
        href="#tool-menu"
        className="mt-2 inline-flex min-h-11 items-center gap-2 px-3 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" /> اختيار أداة أخرى
      </a>
    </section>
  );
}

export default function ToolsPage() {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <section className="mx-auto max-w-4xl py-3 sm:py-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium">
          <Calculator className="h-4 w-4" /> أدوات تفاعلية
        </div>
        <h1 className="heading-xl mb-3">أدوات تساعدك في التطبيق</h1>
        <p className="body-base max-w-2xl text-muted-foreground">
          اختر الأداة التي تحتاجها، وعدّل القيم حسب وصفتك أو مشروعك.
        </p>
        <nav
          id="tool-menu"
          aria-label="اختيار أداة"
          className="mt-6 flex scroll-mt-44 flex-wrap gap-2"
        >
          {TOOLS.map((tool) => (
            <a
              key={tool.id}
              href={`#${tool.id}`}
              className="inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:border-accent hover:bg-accent/10"
            >
              {tool.label}
            </a>
          ))}
        </nav>
      </section>
      <div className="mx-auto max-w-4xl space-y-8">
        <TrackedTool toolId="cafe-cost">
          <CafeCostCalculator />
        </TrackedTool>
        <TrackedTool toolId="drink-pricing">
          <DrinkPricingCalculator />
        </TrackedTool>
        <TrackedTool toolId="extraction">
          <ExtractionCalculator />
        </TrackedTool>
        <TrackedTool toolId="recipe-calculator">
          <RecipeCalculator />
        </TrackedTool>
        <TrackedTool toolId="grind-converter">
          <GrindConverter />
        </TrackedTool>
        <TrackedTool toolId="daily-checklist">
          <DailyChecklist />
        </TrackedTool>
        <TrackedTool toolId="personality-quiz">
          <CoffeePersonalityQuiz />
        </TrackedTool>
      </div>
    </div>
  );
}
