"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  User,
  Phone,
  MailIcon,
  Store,
  MapPin,
  Wallet,
  ClipboardList,
  Send,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const palestinianCities = [
  "القدس",
  "رام الله والبيرة",
  "نابلس",
  "الخليل",
  "بيت لحم",
  "جنين",
  "طولكرم",
  "قلقيلية",
  "أريحا",
  "سلفيت",
  "طوباس",
  "غزة",
  "خان يونس",
  "رفح",
];

const serviceOptions = [
  { id: "setup", label: "المساعدة في تأسيس المقهى وتجهيزه" },
  { id: "consulting", label: "استشارة تشغيلية وتطوير منيو القهوة" },
  { id: "training", label: "تدريب طاقم العمل وموظفي الباريستا" },
  { id: "costing", label: "دراسة تكاليف وجدوى مالية دقيقة" },
];

const budgetOptions = [
  "أقل من 50,000 شيكل ₪",
  "50,000 - 100,000 شيكل ₪",
  "100,000 - 200,000 شيكل ₪",
  "أكثر من 200,000 شيكل ₪",
];

const steps = [
  { id: 1, label: "بياناتك", icon: User },
  { id: 2, label: "مشروعك", icon: Store },
  { id: 3, label: "الخدمات", icon: ClipboardList },
  { id: 4, label: "المراجعة", icon: Send },
];

export default function ConsultantPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cafeName, setCafeName] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const validateStep = (s: number): boolean => {
    setError("");
    if (s === 1) {
      if (!name.trim()) { setError("الرجاء إدخال الاسم الكامل"); return false; }
      if (!phone.trim()) { setError("الرجاء إدخال رقم الهاتف"); return false; }
    }
    if (s === 2) {
      if (!city) { setError("الرجاء اختيار المدينة"); return false; }
    }
    if (s === 3) {
      if (selectedServices.length === 0) { setError("الرجاء اختيار خدمة واحدة على الأقل"); return false; }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step) && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const getFormattedMessage = () => {
    const servicesText = selectedServices
      .map((id) => serviceOptions.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join("، ");

    return `*طلب استشارة وتأسيس مقهى - أكاديمية GoatJourney*
----------------------------------------
*الاسم الكامل:* ${name}
*رقم الهاتف:* ${phone}
*البريد الإلكتروني:* ${email || "غير متوفر"}
*اسم المقهى/المشروع:* ${cafeName || "غير محدد بعد"}
*المدينة:* ${city}
*الخدمات المطلوبة:* ${servicesText || "استشارة عامة"}
*الميزانية التقديرية:* ${budget || "غير محددة"}
*تفاصيل إضافية:*
${notes || "لا توجد تفاصيل إضافية"}`;
  };

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptcha = useCallback(async (): Promise<string | null> => {
    if (!executeRecaptcha) return null;
    try {
      const token = await executeRecaptcha("consultation_submit");
      return token;
    } catch {
      return null;
    }
  }, [executeRecaptcha]);

  const handleWhatsAppSubmit = async () => {
    await handleReCaptcha(); // Validate human
    const message = encodeURIComponent(getFormattedMessage());
    const whatsappUrl = `https://wa.me/970594136723?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
  };

  const handleEmailSubmit = async () => {
    await handleReCaptcha(); // Validate human
    const subject = encodeURIComponent("طلب استشارة تأسيس مقهى جديد - فلسطين");
    const body = encodeURIComponent(getFormattedMessage().replace(/\*/g, ""));
    const mailtoUrl = `mailto:gaotjourney.ps@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const resetForm = () => {
    setStep(1);
    setName("");
    setPhone("");
    setEmail("");
    setCafeName("");
    setCity("");
    setBudget("");
    setSelectedServices([]);
    setNotes("");
    setSubmitted(false);
    setError("");
  };

  const progressPercent = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Back Button */}
      <div className="flex justify-end">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>الرجوع</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Header */}
      <div className="text-right space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-[10px] font-medium border border-accent/20">
          <Sparkles className="w-3 h-3" />
          خدمات الاستشارات وتأسيس المقاهي في فلسطين
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          طلب استشارة وإشراف تشغيلي لمشروعك
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          خطط لمشروع مقهاك بذكاء ودقة. نساعدك في التأسيس، إعداد المنيو، تدريب طاقم الباريستا، وتجهيز دراسات الجدوى المالية بالشيكل ₪.
        </p>
      </div>

      {submitted ? (
        <div className="card-premium p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-foreground">تم إعداد طلبك بنجاح!</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            شكراً لاهتمامك. إذا تم تحويلك لتطبيق واتساب أو البريد الإلكتروني، يرجى إرسال الرسالة المجهزة لبدء التواصل فوراً مع المستشار.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="https://wa.me/970594136723"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-foreground text-xs font-semibold px-5 py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 hover:opacity-90"
            >
              <MessageSquare className="w-4 h-4" />
              محادثة مباشرة عبر واتساب
            </a>
            <button
              onClick={resetForm}
              className="bg-secondary text-secondary-foreground border border-border text-xs font-semibold px-5 py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 hover:bg-secondary/80"
            >
              <RotateCcw className="w-4 h-4" />
              تقديم طلب جديد
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick WhatsApp Contact */}
          <div className="card-premium p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-right">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-foreground">تواصل سريع ومباشر</h3>
              <p className="text-[10px] text-muted-foreground">
                يمكنك الضغط للتحدث معنا مباشرة عبر الواتساب دون تعبئة النموذج
              </p>
            </div>
            <a
              href="https://wa.me/970594136723?text=مرحباً،%20أود%20الاستفسار%20عن%20خدمات%20الاستشارة%20وتأسيس%20المقاهي"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-foreground text-xs font-semibold px-4 py-2 rounded-lg inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity self-end sm:self-center"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              واتساب: 970594136723+
            </a>
          </div>

          {/* Multi-step Form */}
          <div className="card-premium overflow-hidden">
            {/* Progress Bar */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between mb-3">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = step >= s.id;
                  const isCurrent = step === s.id;
                  return (
                    <div key={s.id} className="flex flex-col items-center gap-1.5">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                          isCurrent
                            ? "bg-accent text-accent-foreground ring-2 ring-accent/30"
                            : isActive
                            ? "bg-accent/20 text-accent"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-medium hidden sm:block",
                          isCurrent ? "text-accent" : "text-muted-foreground"
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 text-right space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Step 1: Contact Info */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    بيانات التواصل
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="الاسم الأول والأخير"
                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        رقم الهاتف / الواتساب <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="059XXXXXXX"
                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <MailIcon className="w-3 h-3" />
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@domain.com"
                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Project Info */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Store className="w-4 h-4 text-accent" />
                    تفاصيل المشروع
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        اسم المقهى / المشروع المقترح
                      </label>
                      <input
                        type="text"
                        value={cafeName}
                        onChange={(e) => setCafeName(e.target.value)}
                        placeholder="مثال: مقهى كرز"
                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        المدينة في فلسطين <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right"
                      >
                        <option value="">اختر المدينة</option>
                        {palestinianCities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Wallet className="w-3 h-3" />
                        الميزانية التقديرية للتجهيز
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right"
                      >
                        <option value="">اختر الميزانية المتوقعة</option>
                        {budgetOptions.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Services */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-accent" />
                    الخدمات المطلوبة
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    اختر الخدمات التي تحتاجها (يمكن اختيار أكثر من خدمة)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {serviceOptions.map((s) => (
                      <label
                        key={s.id}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-colors select-none",
                          selectedServices.includes(s.id)
                            ? "bg-accent/10 border-accent/40 text-foreground"
                            : "bg-secondary/10 border-border/50 text-muted-foreground hover:bg-secondary/20"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(s.id)}
                          onChange={() => handleServiceChange(s.id)}
                          className="rounded border-border text-accent focus:ring-accent"
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Send className="w-4 h-4 text-accent" />
                    مراجعة وإرسال
                  </h3>

                  <div className="space-y-3 text-right">
                    <div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الاسم:</span>
                        <span className="font-medium text-foreground">{name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الهاتف:</span>
                        <span className="font-medium text-foreground" dir="ltr">{phone}</span>
                      </div>
                      {email && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">البريد:</span>
                          <span className="font-medium text-foreground" dir="ltr">{email}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المشروع:</span>
                        <span className="font-medium text-foreground">{cafeName || "غير محدد"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المدينة:</span>
                        <span className="font-medium text-foreground">{city}</span>
                      </div>
                      {budget && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الميزانية:</span>
                          <span className="font-medium text-foreground">{budget}</span>
                        </div>
                      )}
                      <div className="border-t border-border/50 pt-2">
                        <span className="text-muted-foreground block mb-1">الخدمات المطلوبة:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedServices.map((id) => (
                            <span
                              key={id}
                              className="bg-accent/15 text-accent text-[10px] font-medium px-2 py-0.5 rounded-full"
                            >
                              {serviceOptions.find((s) => s.id === id)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">
                        تفاصيل إضافية عن مشروعك
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="اكتب هنا أي تفاصيل إضافية..."
                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleWhatsAppSubmit}
                        className="flex-1 bg-accent text-accent-foreground text-xs font-semibold py-3 px-4 rounded-lg inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <MessageSquare className="w-4 h-4" />
                        إرسال الطلب للواتساب
                      </button>
                      <button
                        type="button"
                        onClick={handleEmailSubmit}
                        className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-3 px-4 rounded-lg inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        إرسال للبريد الإلكتروني
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all",
                  step === 1
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : "text-foreground hover:bg-secondary border border-border"
                )}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                السابق
              </button>

              <span className="text-[10px] text-muted-foreground">
                الخطوة {step} من {steps.length}
              </span>

              {step < 4 && (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  التالي
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            سيتم توجيه طلبك مباشرة إلى البريد الإلكتروني <strong className="text-foreground">gaotjourney.ps@gmail.com</strong> أو حساب الواتساب.
          </p>
        </div>
      )}
    </div>
  );
}
