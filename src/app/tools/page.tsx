"use client";

import React, { useState, useMemo } from "react";
import { Coffee, Coins, Percent, Info, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type BrewMethod = "v60" | "chemex" | "aeropress" | "frenchpress";

const brewMethodsInfo: Record<BrewMethod, { label: string; ratio: number; desc: string }> = {
  v60: { label: "V60", ratio: 15, desc: "استخلاص متوازن يبرز حمضية وحلاوة البن الفردي المصدر." },
  chemex: { label: "كيمكس (Chemex)", ratio: 16, desc: "استخلاص نظيف جداً وخفيف القوام بفضل الفلاتر السميكة." },
  aeropress: { label: "إيروبريس (Aeropress)", ratio: 12, desc: "قوام ممتلئ واستخلاص سريع وقابل للتعديل بشكل واسع." },
  frenchpress: { label: "فرنش بريس (French Press)", ratio: 15, desc: "تحضير بالتنقيط الكامل يعطي قواماً غنياً وزيوتاً واضحة." }
};

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<"brew" | "cost">("brew");

  // --- Brewing Calculator States ---
  const [brewMethod, setBrewMethod] = useState<BrewMethod>("v60");
  const [coffeeWeight, setCoffeeWeight] = useState<number>(15);
  const [customRatio, setCustomRatio] = useState<number>(15);
  const [isCustomRatio, setIsCustomRatio] = useState<boolean>(false);

  // Sync custom ratio when method changes
  const activeRatio = isCustomRatio ? customRatio : brewMethodsInfo[brewMethod].ratio;

  const brewResults = useMemo(() => {
    const totalWater = Math.round(coffeeWeight * activeRatio);
    const bloomWater = Math.round(coffeeWeight * 3);
    const remainingWater = totalWater - bloomWater;
    const firstPour = Math.round(remainingWater * 0.6);
    const secondPour = totalWater - bloomWater - firstPour;

    return {
      totalWater,
      bloomWater,
      firstPour,
      secondPour
    };
  }, [coffeeWeight, activeRatio]);

  // --- Cost-per-Cup Calculator States ---
  const [beanCost, setBeanCost] = useState<string>("80"); // ₪ per kg
  const [doseWeight, setDoseWeight] = useState<string>("18"); // grams
  const [milkCost, setMilkCost] = useState<string>("7"); // ₪ per Liter
  const [milkVolume, setMilkVolume] = useState<string>("150"); // ml
  const [packagingCost, setPackagingCost] = useState<string>("1.2"); // Cup + Lid + Sleeve + Straw
  const [overheadCost, setOverheadCost] = useState<string>("1.5"); // Rent + Water/Electricity + Labor cost per cup
  const [sellingPrice, setSellingPrice] = useState<string>("15"); // Target sale price in ₪

  const financialResults = useMemo(() => {
    const beans = parseFloat(beanCost) || 0;
    const dose = parseFloat(doseWeight) || 0;
    const milkPrice = parseFloat(milkCost) || 0;
    const milkVol = parseFloat(milkVolume) || 0;
    const pkg = parseFloat(packagingCost) || 0;
    const overhead = parseFloat(overheadCost) || 0;
    const price = parseFloat(sellingPrice) || 0;

    // Calculations
    const singleDoseCost = (beans / 1000) * dose;
    const singleMilkCost = (milkPrice / 1000) * milkVol;
    const directCost = singleDoseCost + singleMilkCost + pkg;
    const totalCost = directCost + overhead;
    const profitMargin = price - totalCost;
    const profitPercent = price > 0 ? (profitMargin / price) * 100 : 0;

    return {
      coffeeCost: singleDoseCost.toFixed(2),
      milkCost: singleMilkCost.toFixed(2),
      directCost: directCost.toFixed(2),
      totalCost: totalCost.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
      profitPercent: Math.round(profitPercent)
    };
  }, [beanCost, doseWeight, milkCost, milkVolume, packagingCost, overheadCost, sellingPrice]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="text-right space-y-1">
        <h2 className="text-xl font-bold text-foreground">الأدوات التفاعلية</h2>
        <p className="text-xs text-muted-foreground">
          حاسبات القهوة الذكية لمساعدتك في التحضير المنزلي أو حساب أرقام مشروعك المالي
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-secondary/30 border border-border p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("cost")}
          className={cn(
            "flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
            activeTab === "cost"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Coins className="w-4 h-4" />
          حاسبة تكاليف الكوب للمقاهي
        </button>
        <button
          onClick={() => setActiveTab("brew")}
          className={cn(
            "flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
            activeTab === "brew"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Coffee className="w-4 h-4" />
          حاسبة تحضير القهوة (Ratio)
        </button>
      </div>

      {/* Calculator Body */}
      {activeTab === "brew" ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-right">
          {/* Inputs Section */}
          <div className="md:col-span-3 space-y-5">
            <div className="card-premium p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2 justify-end">
                <span>إعدادات التحضير</span>
                <Coffee className="w-4 h-4 text-accent" />
              </h3>

              {/* Method Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground block">أداة التحضير</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(brewMethodsInfo) as BrewMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        setBrewMethod(method);
                        if (!isCustomRatio) setCustomRatio(brewMethodsInfo[method].ratio);
                      }}
                      className={cn(
                        "py-2 rounded-lg border text-xs font-medium transition-all text-center",
                        brewMethod === method
                          ? "bg-accent/15 border-accent text-foreground font-semibold"
                          : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40"
                      )}
                    >
                      {brewMethodsInfo[method].label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  {brewMethodsInfo[brewMethod].desc}
                </p>
              </div>

              {/* Coffee Weight Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground font-mono">{coffeeWeight}g</span>
                  <label className="text-[11px] font-semibold text-muted-foreground">كمية البن (بالجرام)</label>
                </div>
                <input
                  type="range"
                  min="8"
                  max="40"
                  step="0.5"
                  value={coffeeWeight}
                  onChange={(e) => setCoffeeWeight(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCoffeeWeight(15)}
                    className="text-[9px] text-accent hover:underline flex items-center gap-0.5"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    الوزن الافتراضي (15 جرام)
                  </button>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={coffeeWeight}
                    onChange={(e) => setCoffeeWeight(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-secondary/35 border border-border text-center rounded px-1 py-0.5 text-xs text-foreground font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Ratio Selector */}
              <div className="space-y-2 border-t border-border/50 pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="use-custom-ratio"
                      checked={isCustomRatio}
                      onChange={(e) => {
                        setIsCustomRatio(e.target.checked);
                        if (!e.target.checked) setCustomRatio(brewMethodsInfo[brewMethod].ratio);
                      }}
                      className="rounded border-border text-accent focus:ring-accent w-3 h-3"
                    />
                    <label htmlFor="use-custom-ratio" className="text-[10px] text-muted-foreground cursor-pointer select-none">نسبة مخصصة</label>
                  </div>
                  <label className="text-[11px] font-semibold text-muted-foreground">نسبة الاستخلاص (Ratio)</label>
                </div>

                {isCustomRatio ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>1:{customRatio}</span>
                      <span>تعديل النسبة</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="20"
                      step="0.5"
                      value={customRatio}
                      onChange={(e) => setCustomRatio(parseFloat(e.target.value))}
                      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                ) : (
                  <div className="bg-secondary/20 p-2.5 rounded-lg border border-border/50 text-[10px] text-muted-foreground flex justify-between items-center">
                    <span className="font-mono text-foreground font-semibold">1 : {brewMethodsInfo[brewMethod].ratio}</span>
                    <span>النسبة القياسية المعتمدة للأداة:</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-primary via-[#453c38] to-primary text-primary-foreground rounded-2xl border border-border p-6 space-y-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1">
                <div className="text-[10px] text-accent font-medium tracking-wide uppercase">النتيجة الإجمالية</div>
                <div className="text-3xl font-black font-mono text-accent flex items-baseline justify-end gap-1">
                  <span className="text-sm font-normal text-primary-foreground/80 font-sans">مل من الماء</span>
                  <span>{brewResults.totalWater}</span>
                </div>
                <p className="text-[10px] text-primary-foreground/60 leading-relaxed">
                  الوزن الكلي للقهوة المحضرة جاهز في الكوب.
                </p>
              </div>

              {/* Steps breakdown */}
              <div className="space-y-4 pt-4 border-t border-primary-foreground/10">
                <h4 className="text-xs font-bold text-accent">خطوات ومراحل التحضير:</h4>
                
                <div className="space-y-3 text-xs">
                  {/* Step 1: Bloom */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 text-right space-y-0.5">
                      <div className="font-semibold text-primary-foreground">مرحلة الترطيب (Bloom)</div>
                      <div className="text-[10px] text-primary-foreground/75">
                        صب <strong className="text-accent font-mono">{brewResults.bloomWater} جرام</strong> من الماء واترك البن يتنفس لمدة 30-40 ثانية لطرد غاز ثاني أكسيد الكربون.
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">1</div>
                  </div>

                  {/* Step 2: First Pour */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 text-right space-y-0.5">
                      <div className="font-semibold text-primary-foreground">الصبة الأولى (الدائرية)</div>
                      <div className="text-[10px] text-primary-foreground/75">
                        صب <strong className="text-accent font-mono">{brewResults.firstPour} جرام</strong> من الماء بحركات دائرية بطيئة لترطيب جميع الحبيبات بالتساوي.
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">2</div>
                  </div>

                  {/* Step 3: Second Pour */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 text-right space-y-0.5">
                      <div className="font-semibold text-primary-foreground">الصبة الثانية (النهائية)</div>
                      <div className="text-[10px] text-primary-foreground/75">
                        صب الـ <strong className="text-accent font-mono">{brewResults.secondPour} جرام</strong> الأخيرة في المنتصف ببطء لتثبيت الاستخلاص الكلي للقهوة.
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-right">
          {/* Inputs Section */}
          <div className="md:col-span-3 space-y-5">
            <div className="card-premium p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2 justify-end">
                <span>مدخلات التكاليف الأساسية</span>
                <Coins className="w-4 h-4 text-accent" />
              </h3>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bean Cost */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">سعر كيلو البن (شيكل ₪)</label>
                  <input
                    type="number"
                    min="0"
                    value={beanCost}
                    onChange={(e) => setBeanCost(e.target.value)}
                    placeholder="مثال: 80"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent text-right font-mono"
                  />
                </div>

                {/* Dose Weight */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">جرعة البن للكوب (جرام)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={doseWeight}
                    onChange={(e) => setDoseWeight(e.target.value)}
                    placeholder="مثال: 18"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent text-right font-mono"
                  />
                </div>

                {/* Milk Cost */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">سعر لتر الحليب (شيكل ₪)</label>
                  <input
                    type="number"
                    min="0"
                    value={milkCost}
                    onChange={(e) => setMilkCost(e.target.value)}
                    placeholder="مثال: 7"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent text-right font-mono"
                  />
                </div>

                {/* Milk Volume */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">الحليب المستخدم للكوب (مل)</label>
                  <input
                    type="number"
                    min="0"
                    value={milkVolume}
                    onChange={(e) => setMilkVolume(e.target.value)}
                    placeholder="مثال: 150 (0 للإسبريسو الأسود)"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent text-right font-mono"
                  />
                </div>

                {/* Packaging Cost */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">الملحقات (كوب وغطاء وعلبة.. شيكل)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(e.target.value)}
                    placeholder="مثال: 1.2"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent text-right font-mono"
                  />
                </div>

                {/* Overhead Cost */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">التكاليف التشغيلية للكوب (شيكل)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={overheadCost}
                    onChange={(e) => setOverheadCost(e.target.value)}
                    placeholder="إيجار، كهرباء، عمالة مقسمة لكل كوب"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent text-right font-mono"
                  />
                </div>

                {/* Selling Price */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-muted-foreground">سعر بيع الكوب المتوقع للمستهلك (شيكل ₪)</label>
                  <input
                    type="number"
                    min="0"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="مثال: 15"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-accent text-right font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="card-premium p-6 space-y-5 text-right relative">
              <h3 className="text-xs font-bold text-foreground border-b border-border/50 pb-2">تفصيل التكلفة والأرباح للكوب</h3>
              
              <div className="space-y-3">
                {/* Cost Breakdown */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-foreground font-semibold">{financialResults.coffeeCost} ₪</span>
                  <span className="text-muted-foreground">تكلفة كمية البن المستخدمة:</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-foreground font-semibold">{financialResults.milkCost} ₪</span>
                  <span className="text-muted-foreground">تكلفة كمية الحليب المستخدمة:</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-foreground font-semibold">{packagingCost} ₪</span>
                  <span className="text-muted-foreground">تكلفة الملحقات والتغليف:</span>
                </div>
                
                <div className="h-px bg-border/60 my-2" />

                {/* Direct cost */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-foreground font-semibold">{financialResults.directCost} ₪</span>
                  <span className="text-muted-foreground font-medium">إجمالي التكلفة المباشرة (COGS):</span>
                </div>
                {/* Total Cost with overhead */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-foreground font-semibold">{financialResults.totalCost} ₪</span>
                  <span className="text-muted-foreground font-medium">إجمالي التكلفة الكلية (مع التشغيل):</span>
                </div>

                <div className="h-px bg-border/60 my-2" />

                {/* Net Profit Margin */}
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-500">{financialResults.profitMargin} ₪</span>
                  <span className="text-xs font-bold text-foreground">صافي ربح الكوب التقديري:</span>
                </div>

                {/* Profit Margin Percent */}
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-0.5">
                    <Percent className="w-3.5 h-3.5" />
                    {financialResults.profitPercent}
                  </span>
                  <span className="text-xs font-bold text-foreground">نسبة صافي الربح من السعر الكلي:</span>
                </div>
              </div>

              {/* Profit Evaluation */}
              <div className="mt-4 p-3 bg-secondary/35 rounded-xl border border-border/50 text-[10px] text-muted-foreground leading-relaxed flex gap-2 items-start">
                <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  {financialResults.profitPercent >= 60 ? (
                    <span className="text-emerald-600 dark:text-emerald-500 font-semibold block mb-0.5">أرباح ممتازة جداً!</span>
                  ) : financialResults.profitPercent >= 40 ? (
                    <span className="text-emerald-600 dark:text-emerald-500 font-semibold block mb-0.5">أرباح جيدة ومستدامة.</span>
                  ) : financialResults.profitPercent > 0 ? (
                    <span className="text-amber-600 dark:text-amber-500 font-semibold block mb-0.5">أرباح مقبولة، ولكن يفضل ضبط التكاليف.</span>
                  ) : (
                    <span className="text-red-500 font-semibold block mb-0.5 font-bold">تنبيه: أرقامك الحالية خاسرة!</span>
                  )}
                  هذا التقدير مبني على البيانات المدخلة، ويجب مراجعة الموردين في مدينتك في فلسطين بانتظام لضمان أفضل أسعار شراء للمواد الخام.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
