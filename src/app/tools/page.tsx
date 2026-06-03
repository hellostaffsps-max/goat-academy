"use client";

import { useState } from "react";
import { Calculator, FlaskConical, Coffee, BarChart3, ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";

// --- Calculator: Cafe Opening Cost ---
function CafeCostCalculator() {
  const [equipment, setEquipment] = useState(15000);
  const [furniture, setFurniture] = useState(8000);
  const [rent, setRent] = useState(5000);
  const [licenses, setLicenses] = useState(2000);
  const [marketing, setMarketing] = useState(3000);
  const [workingCapital, setWorkingCapital] = useState(10000);

  const total = equipment + furniture + rent + licenses + marketing + workingCapital;

  const reset = () => {
    setEquipment(15000);
    setFurniture(8000);
    setRent(5000);
    setLicenses(2000);
    setMarketing(3000);
    setWorkingCapital(10000);
  };

  const Slider = ({ label, value, set, min, max }: { label: string; value: number; set: (v: number) => void; min: number; max: number }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-accent">${value.toLocaleString()}</span>
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
          <Slider label="المعدات" value={equipment} set={setEquipment} min={5000} max={50000} />
          <Slider label="الأثاث والديكور" value={furniture} set={setFurniture} min={2000} max={30000} />
          <Slider label="الإيجار والتأمين" value={rent} set={setRent} min={1000} max={20000} />
          <Slider label="التراخيص" value={licenses} set={setLicenses} min={500} max={10000} />
          <Slider label="التسويق" value={marketing} set={setMarketing} min={500} max={15000} />
          <Slider label="رأس المال العامل" value={workingCapital} set={setWorkingCapital} min={2000} max={50000} />
        </div>
        <div className="flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-2">التكلفة الإجمالية التقديرية</p>
          <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            ${total.toLocaleString()}
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
  const [cost, setCost] = useState(2);
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
              <span className="text-xs font-bold text-accent">${cost}</span>
              <span className="text-xs text-muted-foreground">تكلفة المشروب</span>
            </div>
            <input type="range" min={0.5} max={10} step={0.1} value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full h-1.5 rounded-full bg-secondary accent-accent appearance-none cursor-pointer" />
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
            ${price.toFixed(2)}
          </div>
          <p className="text-xs text-accent font-semibold mb-1">
            ربح: ${profit.toFixed(2)} ({marginPercent}%)
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
