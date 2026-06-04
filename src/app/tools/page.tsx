"use client";

import { useState } from "react";
import { Calculator, Coffee, BarChart, ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";

// Exchange rate: 1 USD ≈ 3.7 ILS
const USD_TO_ILS = 3.7;

function formatShekel(value: number): string {
  return `₪${Math.round(value).toLocaleString("ar-EG")}`;
}

// --- Calculator: Cafe Opening Cost ---
function CafeCostCalculator() {
  const [equipment, setEquipment] = useState(Math.round(15000 * USD_TO_ILS));
  const [furniture, setFurniture] = useState(Math.round(8000 * USD_TO_ILS));
  const [rent, setRent] = useState(Math.round(5000 * USD_TO_ILS));
  const [licenses, setLicenses] = useState(Math.round(2000 * USD_TO_ILS));
  const [marketing, setMarketing] = useState(Math.round(3000 * USD_TO_ILS));
  const [workingCapital, setWorkingCapital] = useState(Math.round(10000 * USD_TO_ILS));

  const total = equipment + furniture + rent + licenses + marketing + workingCapital;

  const reset = () => {
    setEquipment(Math.round(15000 * USD_TO_ILS));
    setFurniture(Math.round(8000 * USD_TO_ILS));
    setRent(Math.round(5000 * USD_TO_ILS));
    setLicenses(Math.round(2000 * USD_TO_ILS));
    setMarketing(Math.round(3000 * USD_TO_ILS));
    setWorkingCapital(Math.round(10000 * USD_TO_ILS));
  };

  const Slider = ({ label, value, set, min, max }: { label: string; value: number; set: (v: number) => void; min: number; max: number }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-accent">{formatShekel(value)}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={100}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-secondary accent-accent appearance-none cursor-pointer"
      />
    </div>
  );

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <RotateCcw className="w-3 h-3" />
          إعادة تعيين
        </button>
        <h3 className="text-sm font-bold text-foreground">حاسبة تكلفة فتح المقهى</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Slider label="المعدات" value={equipment} set={setEquipment} min={Math.round(5000 * USD_TO_ILS)} max={Math.round(50000 * USD_TO_ILS)} />
          <Slider label="الأثاث والديكور" value={furniture} set={setFurniture} min={Math.round(2000 * USD_TO_ILS)} max={Math.round(30000 * USD_TO_ILS)} />
          <Slider label="الإيجار والتأمين" value={rent} set={setRent} min={Math.round(1000 * USD_TO_ILS)} max={Math.round(20000 * USD_TO_ILS)} />
          <Slider label="التراخيص" value={licenses} set={setLicenses} min={Math.round(500 * USD_TO_ILS)} max={Math.round(10000 * USD_TO_ILS)} />
          <Slider label="التسويق" value={marketing} set={setMarketing} min={Math.round(500 * USD_TO_ILS)} max={Math.round(15000 * USD_TO_ILS)} />
          <Slider label="رأس المال العامل" value={workingCapital} set={setWorkingCapital} min={Math.round(2000 * USD_TO_ILS)} max={Math.round(50000 * USD_TO_ILS)} />
        </div>
        <div className="flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-2">التكلفة الإجمالية التقديرية</p>
          <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {formatShekel(total)}
          </div>
          <p className="text-[10px] text-muted-foreground">
            هذه التقديرات تقريبية وتختلف حسب الموقع والحجم
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Calculator: Drink Pricing ---
function DrinkPricingCalculator() {
  const [cost, setCost] = useState(8);
  const [targetMargin, setTargetMargin] = useState(65);

  const price = cost / (1 - targetMargin / 100);
  const profit = price - cost;
  const marginPercent = ((profit / price) * 100).toFixed(1);

  return (
    <div className="card-premium p-6">
      <h3 className="text-sm font-bold text-foreground mb-6">حاسبة تسعير المشروبات</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-accent">₪{cost}</span>
              <span className="text-xs text-muted-foreground">تكلفة المشروب</span>
            </div>
            <input type="range" min={2} max={40} step={1} value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full h-1.5 rounded-full bg-secondary accent-accent appearance-none cursor-pointer" />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-accent">{targetMargin}%</span>
              <span className="text-xs text-muted-foreground">نسبة الربح المستهدفة</span>
            </div>
            <input type="range" min={30} max={85} step={1} value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))} className="w-full h-1.5 rounded-full bg-secondary accent-accent appearance-none cursor-pointer" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-2">السعر المقترح</p>
          <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
            ₪{price.toFixed(2)}
          </div>
          <p className="text-xs text-accent font-semibold mb-1">
            ربح: ₪{profit.toFixed(2)} ({marginPercent}%)
          </p>
          <p className="text-[10px] text-muted-foreground">
            السعر النهائي يعتمد على السوق المستهدف
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Calculator: Extraction Ratio ---
function ExtractionCalculator() {
  const [dose, setDose] = useState(18);
  const [yield_, setYield_] = useState(36);
  const [tds, setTds] = useState(8.5);

  const ratio = (yield_ / dose).toFixed(1);
  const extractionYield = ((yield_ * (tds / 100)) / dose * 100).toFixed(1);

  const getStatus = () => {
    const ey = Number(extractionYield);
    if (ey >= 18 && ey <= 22) return { text: "مثالي ✓", color: "text-green-600" };
    if (ey < 18) return { text: "استخلاص منخفض", color: "text-yellow-600" };
    return { text: "استخلاص مرتفع", color: "text-red-500" };
  };
  const status = getStatus();

  return (
    <div className="card-premium p-6">
      <h3 className="text-sm font-bold text-foreground mb-6">حاسبة نسبة الاستخلاص</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-accent">{dose}g</span>
              <span className="text-xs text-muted-foreground">الجرعة (Dose)</span>
            </div>
            <input type="range" min={10} max={25} step={0.5} value={dose} onChange={(e) => setDose(Number(e.target.value))} className="w-full h-1.5 rounded-full bg-secondary accent-accent appearance-none cursor-pointer" />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-accent">{yield_}g</span>
              <span className="text-xs text-muted-foreground">الإنتاج (Yield)</span>
            </div>
            <input type="range" min={20} max={60} step={0.5} value={yield_} onChange={(e) => setYield_(Number(e.target.value))} className="w-full h-1.5 rounded-full bg-secondary accent-accent appearance-none cursor-pointer" />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-accent">{tds}%</span>
              <span className="text-xs text-muted-foreground">TDS</span>
            </div>
            <input type="range" min={5} max={15} step={0.1} value={tds} onChange={(e) => setTds(Number(e.target.value))} className="w-full h-1.5 rounded-full bg-secondary accent-accent appearance-none cursor-pointer" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-2">نسبة الاستخلاص</p>
          <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
            {extractionYield}%
          </div>
          <p className="text-xs font-semibold mb-1">نسبة 1:{ratio}</p>
          <p className={`text-xs font-semibold ${status.color}`}>{status.text}</p>
          <p className="text-[10px] text-muted-foreground mt-2">
            المثالي: 18% - 22%
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Quiz: Coffee Personality ---
function CoffeePersonalityQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    {
      q: "ما هو الوقت المفضل لشرب القهوة؟",
      options: ["الصباح الباكر", "بعد الظهر", "المساء", "أي وقت"],
    },
    {
      q: "كيف تفضل مذاق قهوتك؟",
      options: ["قوية ومركزة", "ناعمة ومتزنة", "حامضية وفاكهية", "حلوة وكريمية"],
    },
    {
      q: "ما أسلوب تحضيرك المفضل؟",
      options: ["إسبريسو", "فلتر / تقطير", "فرنش بريس", "لا أهتم بالأسلوب"],
    },
  ];

  const results = [
    { title: "عاشق الإسبريسو", desc: "تحب القهوة القوية والمركزة. أنت تقدر الكفاءة والتركيز." },
    { title: "محترف التقطير", desc: "تستمتع بالتفاصيل والتحكم. القهوة بالنسبة لك هي فن." },
    { title: "باريستا المبتدئ", desc: "تحب تجربة أشياء جديدة. رحلتك في القهوة بدأت للتو!" },
    { title: "محبي القهوة الناعمة", desc: "تفضل التوازن والنعومة. القهوة لديك هي لحظة استرخاء." },
  ];

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (newAnswers.length < questions.length) {
      setStep(newAnswers.length);
    } else {
      setStep(questions.length);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); };

  if (step >= questions.length) {
    const resultIdx = answers.reduce((a, b) => a + b, 0) % results.length;
    const result = results[resultIdx];
    return (
      <div className="card-premium p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">{result.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{result.desc}</p>
        <button onClick={reset} className="btn-accent">
          <RotateCcw className="w-4 h-4" />
          إعادة الاختبار
        </button>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground">{step + 1} / {questions.length}</span>
        <h3 className="text-sm font-bold text-foreground">اختبار شخصية القهوة</h3>
      </div>
      <p className="text-sm text-foreground mb-4 font-medium">{q.q}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => handleAnswer(i)}
            className="w-full text-right p-3 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 transition-all text-sm text-foreground"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      {/* Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
          <Calculator className="w-3.5 h-3.5" />
          أدوات تفاعلية
        </div>
        <h1 className="heading-xl mb-3">أدوات مساعدة</h1>
        <p className="body-base text-muted-foreground max-w-xl mx-auto">
          استخدم حاسباتنا واختباراتنا التفاعلية لتسهيل قراراتك في عالم القهوة.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <CafeCostCalculator />
        <DrinkPricingCalculator />
        <ExtractionCalculator />
        <CoffeePersonalityQuiz />
      </section>
    </div>
  );
}
