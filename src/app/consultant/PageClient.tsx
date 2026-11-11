"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackContact } from "@/lib/analytics";
import { site } from "@/lib/site";
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
import { services } from "@/data/services";

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
  ...services.map((service) => ({ id: service.slug, label: service.name })),
  { id: "setup", label: "المساعدة في تأسيس المقهى وتجهيزه" },
  { id: "costing", label: "دراسة تكاليف التشغيل" },
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

export default function ConsultantPage({
  initialServices = [],
  serviceSlug,
}: {
  initialServices?: string[];
  serviceSlug?: string;
}) {
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cafeName, setCafeName] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedServices, setSelectedServices] =
    useState<string[]>(initialServices);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState("");
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousView = useRef({ step, submitted });
  useEffect(() => {
    if (error && errorField) document.getElementById(errorField)?.focus();
  }, [error, errorField, step]);
  useEffect(() => {
    const changed =
      previousView.current.step !== step ||
      previousView.current.submitted !== submitted;
    previousView.current = { step, submitted };
    if (changed && !error) stepHeadingRef.current?.focus();
  }, [step, submitted, error]);

  const clearError = () => {
    setError("");
    setErrorField("");
  };
  const normalizedPhone = phone
    .trim()
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[\s().-]/g, "");

  const handleServiceChange = (serviceId: string) => {
    clearError();
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const validateStep = (s: number): boolean => {
    const fail = (message: string, field: string) => {
      setError(message);
      setErrorField(field);
      setStep(s);
      return false;
    };
    if (s === 1) {
      if (!name.trim())
        return fail("الرجاء إدخال الاسم الكامل", "consultant-name");
      if (!/^\+?\d{7,15}$/.test(normalizedPhone))
        return fail(
          "أدخل رقم هاتف صحيحاً من 7 إلى 15 رقماً، مع رمز البلد عند الحاجة.",
          "consultant-phone",
        );
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        return fail(
          "تحقق من البريد الإلكتروني، مثل name@example.com، أو اتركه فارغاً.",
          "consultant-email",
        );
    }
    if (s === 2 && !city)
      return fail("الرجاء اختيار المدينة", "consultant-city");
    if (s === 3 && selectedServices.length === 0)
      return fail("الرجاء اختيار خدمة واحدة على الأقل", "consultant-services");
    clearError();
    return true;
  };

  const nextStep = () => {
    if (validateStep(step) && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    clearError();
    if (step > 1) setStep(step - 1);
  };

  const getFormattedMessage = () => {
    const servicesText = selectedServices
      .map((id) => serviceOptions.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join("، ");

    return `*طلب تدريب أو استشارة قهوة - Goat Journey*
----------------------------------------
*الاسم الكامل:* ${name}
*رقم الهاتف:* ${normalizedPhone}
*البريد الإلكتروني:* ${email || "غير متوفر"}
*اسم المقهى/المشروع:* ${cafeName || "غير محدد بعد"}
*المدينة:* ${city}
*الخدمات المطلوبة:* ${servicesText || "استشارة عامة"}
*الميزانية التقديرية:* ${budget || "غير محددة"}
*تفاصيل إضافية:*
${notes || "لا توجد تفاصيل إضافية"}`;
  };

  const handleWhatsAppSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
    trackContact("whatsapp", serviceSlug);
    const message = encodeURIComponent(getFormattedMessage());
    const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${message}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const handleEmailSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
    trackContact("email", serviceSlug);
    const subject = encodeURIComponent("طلب تدريب أو استشارة قهوة - فلسطين");
    const body = encodeURIComponent(getFormattedMessage().replace(/\*/g, ""));
    const mailtoUrl = `mailto:${site.email}?subject=${subject}&body=${body}`;
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
    setSelectedServices(initialServices);
    setNotes("");
    setSubmitted(false);
    clearError();
  };

  const progressPercent = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Back Button */}
      <div className="flex justify-end">
        <Link
          href="/services"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight aria-hidden="true" className="w-4 h-4" />
          <span>استعرض خدمات التدريب والاستشارات</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-right space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-foreground text-xs font-medium border border-accent/20">
          <Sparkles className="w-3 h-3" />
          خدمات الاستشارات وتأسيس المقاهي في فلسطين
        </div>
        <h1 className="heading-xl">طلب تدريب أو استشارة قهوة</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          خطط لمشروع مقهاك بذكاء ودقة. نساعدك في التأسيس، إعداد المنيو، تدريب
          طاقم الباريستا، وتجهيز دراسات الجدوى المالية بالشيكل ₪.
        </p>
      </div>

      {submitted ? (
        <div className="card-premium p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-lg font-bold text-foreground"
          >
            تم إعداد طلبك بنجاح!
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            شكراً لاهتمامك. إذا تم تحويلك لتطبيق واتساب أو البريد الإلكتروني،
            يرجى إرسال الرسالة المجهزة لبدء التواصل فوراً مع المستشار.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-foreground text-sm font-semibold min-h-11 px-5 py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 hover:opacity-90"
            >
              <MessageSquare className="w-4 h-4" />
              محادثة مباشرة عبر واتساب
            </a>
            <button
              onClick={resetForm}
              className="bg-secondary text-secondary-foreground border border-border text-sm font-semibold min-h-11 px-5 py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 hover:bg-secondary/80"
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
              <h3 className="text-sm font-bold text-foreground">
                تواصل سريع ومباشر
              </h3>
              <p className="text-sm text-muted-foreground">
                يمكنك الضغط للتحدث معنا مباشرة عبر الواتساب دون تعبئة النموذج
              </p>
            </div>
            <a
              href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن خدمات الاستشارة وتأسيس المقاهي")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-foreground text-sm font-semibold min-h-11 px-4 py-2 rounded-lg inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity self-end sm:self-center"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              واتساب <bdi>+{site.whatsapp}</bdi>
            </a>
          </div>

          {/* Multi-step Form */}
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (step < 4) nextStep();
            }}
            className="card-premium overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="px-6 pt-6 pb-2">
              <ol
                aria-label="خطوات طلب الاستشارة"
                className="flex items-center justify-between gap-2 mb-3"
              >
                {steps.map((s) => {
                  const Icon = s.icon;
                  const isActive = step >= s.id;
                  const isCurrent = step === s.id;
                  return (
                    <li
                      key={s.id}
                      aria-current={isCurrent ? "step" : undefined}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                          isCurrent
                            ? "bg-accent text-accent-foreground ring-2 ring-accent/30"
                            : isActive
                              ? "bg-accent/20 text-accent"
                              : "bg-secondary text-muted-foreground",
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-medium",
                          isCurrent ? "text-accent" : "text-muted-foreground",
                        )}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <div
                role="progressbar"
                aria-label="تقدم طلب الاستشارة"
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-valuenow={step}
                className="h-1.5 rounded-full bg-secondary overflow-hidden"
              >
                <div
                  className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 text-right space-y-5">
              {error && (
                <div
                  id="consultant-error"
                  role="alert"
                  className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Step 1: Contact Info */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="text-lg font-bold text-foreground flex items-center gap-2 scroll-mt-44"
                  >
                    <User className="w-4 h-4 text-accent" />
                    بيانات التواصل
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="consultant-name"
                        className="text-sm font-medium text-foreground flex items-center gap-1"
                      >
                        <User className="w-3 h-3" />
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        id="consultant-name"
                        name="name"
                        aria-invalid={
                          errorField === "consultant-name" || undefined
                        }
                        aria-describedby={
                          errorField === "consultant-name"
                            ? "consultant-error"
                            : undefined
                        }
                        autoComplete="name"
                        value={name}
                        onChange={(e) => {
                          clearError();
                          setName(e.target.value);
                        }}
                        placeholder="الاسم الأول والأخير"
                        className="w-full min-h-12 bg-secondary/30 border border-input rounded-lg px-3 py-2.5 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring focus:border-accent transition-colors text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="consultant-phone"
                        className="text-sm font-medium text-foreground flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        رقم الهاتف / الواتساب{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        maxLength={30}
                        required
                        id="consultant-phone"
                        name="phone"
                        aria-invalid={
                          errorField === "consultant-phone" || undefined
                        }
                        aria-describedby={
                          errorField === "consultant-phone"
                            ? "consultant-error"
                            : undefined
                        }
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          clearError();
                          setPhone(e.target.value);
                        }}
                        placeholder="059XXXXXXX"
                        className="w-full min-h-12 bg-secondary/30 border border-input rounded-lg px-3 py-2.5 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring focus:border-accent transition-colors text-left"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label
                        htmlFor="consultant-email"
                        className="text-sm font-medium text-foreground flex items-center gap-1"
                      >
                        <MailIcon className="w-3 h-3" />
                        البريد الإلكتروني (اختياري)
                      </label>
                      <input
                        type="email"
                        maxLength={254}
                        id="consultant-email"
                        name="email"
                        aria-invalid={
                          errorField === "consultant-email" || undefined
                        }
                        aria-describedby={
                          errorField === "consultant-email"
                            ? "consultant-error"
                            : undefined
                        }
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          clearError();
                          setEmail(e.target.value);
                        }}
                        placeholder="example@domain.com"
                        className="w-full min-h-12 bg-secondary/30 border border-input rounded-lg px-3 py-2.5 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring focus:border-accent transition-colors text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Project Info */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="text-lg font-bold text-foreground flex items-center gap-2 scroll-mt-44"
                  >
                    <Store className="w-4 h-4 text-accent" />
                    تفاصيل المشروع
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="consultant-cafe"
                        className="text-sm font-medium text-foreground flex items-center gap-1"
                      >
                        <Store className="w-3 h-3" />
                        اسم المقهى / المشروع المقترح
                      </label>
                      <input
                        type="text"
                        id="consultant-cafe"
                        name="cafeName"
                        aria-invalid={
                          errorField === "consultant-cafe" || undefined
                        }
                        aria-describedby={
                          errorField === "consultant-cafe"
                            ? "consultant-error"
                            : undefined
                        }
                        autoComplete="organization"
                        value={cafeName}
                        onChange={(e) => {
                          clearError();
                          setCafeName(e.target.value);
                        }}
                        placeholder="مثال: مقهى كرز"
                        className="w-full min-h-12 bg-secondary/30 border border-input rounded-lg px-3 py-2.5 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring focus:border-accent transition-colors text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="consultant-city"
                        className="text-sm font-medium text-foreground flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        المدينة في فلسطين{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        id="consultant-city"
                        name="city"
                        aria-invalid={
                          errorField === "consultant-city" || undefined
                        }
                        aria-describedby={
                          errorField === "consultant-city"
                            ? "consultant-error"
                            : undefined
                        }
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => {
                          clearError();
                          setCity(e.target.value);
                        }}
                        className="w-full min-h-12 bg-secondary/30 border border-input rounded-lg px-3 py-2.5 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring focus:border-accent transition-colors text-right"
                      >
                        <option value="">اختر المدينة</option>
                        {palestinianCities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label
                        htmlFor="consultant-budget"
                        className="text-sm font-medium text-foreground flex items-center gap-1"
                      >
                        <Wallet className="w-3 h-3" />
                        الميزانية التقديرية للتجهيز
                      </label>
                      <select
                        id="consultant-budget"
                        name="budget"
                        aria-invalid={
                          errorField === "consultant-budget" || undefined
                        }
                        aria-describedby={
                          errorField === "consultant-budget"
                            ? "consultant-error"
                            : undefined
                        }
                        value={budget}
                        onChange={(e) => {
                          clearError();
                          setBudget(e.target.value);
                        }}
                        className="w-full min-h-12 bg-secondary/30 border border-input rounded-lg px-3 py-2.5 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring focus:border-accent transition-colors text-right"
                      >
                        <option value="">اختر الميزانية المتوقعة</option>
                        {budgetOptions.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Services */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="text-lg font-bold text-foreground flex items-center gap-2 scroll-mt-44"
                  >
                    <ClipboardList className="w-4 h-4 text-accent" />
                    الخدمات المطلوبة
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    اختر الخدمات التي تحتاجها (يمكن اختيار أكثر من خدمة)
                  </p>
                  <fieldset
                    id="consultant-services"
                    tabIndex={-1}
                    aria-describedby={
                      errorField === "consultant-services"
                        ? "consultant-error"
                        : undefined
                    }
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    <legend className="sr-only">
                      الخدمات المطلوبة، اختر خدمة واحدة على الأقل
                    </legend>
                    {serviceOptions.map((s) => (
                      <label
                        key={s.id}
                        className={cn(
                          "flex min-h-12 items-center gap-2.5 p-3 rounded-lg border text-sm cursor-pointer transition-colors select-none",
                          selectedServices.includes(s.id)
                            ? "bg-accent/10 border-accent/40 text-foreground"
                            : "bg-secondary/10 border-border/50 text-muted-foreground hover:bg-secondary/20",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(s.id)}
                          onChange={() => handleServiceChange(s.id)}
                          className="size-4 shrink-0 rounded border-border accent-primary focus:ring-accent"
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h3
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="text-lg font-bold text-foreground flex items-center gap-2 scroll-mt-44"
                  >
                    <Send className="w-4 h-4 text-accent" />
                    مراجعة الطلب وتجهيز الرسالة
                  </h3>

                  <div className="space-y-3 text-right">
                    <div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                        <span className="text-muted-foreground">الاسم:</span>
                        <span className="min-w-0 max-w-full font-medium text-foreground break-words [overflow-wrap:anywhere]">
                          {name}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                        <span className="text-muted-foreground">الهاتف:</span>
                        <span
                          className="min-w-0 max-w-full font-medium text-foreground break-words [overflow-wrap:anywhere]"
                          dir="ltr"
                        >
                          {phone}
                        </span>
                      </div>
                      {email && (
                        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                          <span className="text-muted-foreground">البريد:</span>
                          <span
                            className="min-w-0 max-w-full font-medium text-foreground break-words [overflow-wrap:anywhere]"
                            dir="ltr"
                          >
                            {email}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                        <span className="text-muted-foreground">المشروع:</span>
                        <span className="min-w-0 max-w-full font-medium text-foreground break-words [overflow-wrap:anywhere]">
                          {cafeName || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                        <span className="text-muted-foreground">المدينة:</span>
                        <span className="min-w-0 max-w-full font-medium text-foreground break-words [overflow-wrap:anywhere]">
                          {city}
                        </span>
                      </div>
                      {budget && (
                        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                          <span className="text-muted-foreground">
                            الميزانية:
                          </span>
                          <span className="min-w-0 max-w-full font-medium text-foreground break-words [overflow-wrap:anywhere]">
                            {budget}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-border/50 pt-2">
                        <span className="text-muted-foreground block mb-1">
                          الخدمات المطلوبة:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedServices.map((id) => (
                            <span
                              key={id}
                              className="bg-accent/15 text-accent text-xs font-medium px-2 py-0.5 rounded-full"
                            >
                              {serviceOptions.find((s) => s.id === id)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="consultant-notes"
                        className="text-sm font-medium text-foreground"
                      >
                        تفاصيل إضافية عن مشروعك
                      </label>
                      <textarea
                        id="consultant-notes"
                        name="notes"
                        maxLength={3000}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="اكتب هنا أي تفاصيل إضافية..."
                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring focus:border-accent transition-colors text-right resize-y min-h-28"
                      />
                    </div>

                    <p className="text-sm leading-7 text-muted-foreground">
                      سنفتح رسالة جاهزة في التطبيق الذي تختاره. راجعها واضغط
                      إرسال هناك؛ لا يُرسل النموذج تلقائياً.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleWhatsAppSubmit}
                        className="flex-1 bg-accent text-accent-foreground text-sm font-semibold min-h-11 py-3 px-4 rounded-lg inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <MessageSquare className="w-4 h-4" />
                        فتح الطلب في واتساب
                      </button>
                      <button
                        type="button"
                        onClick={handleEmailSubmit}
                        className="flex-1 bg-primary text-primary-foreground text-sm font-semibold min-h-11 py-3 px-4 rounded-lg inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        فتح الطلب في البريد
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={cn(
                  "inline-flex items-center gap-1.5 min-h-11 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  step === 1
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : "text-foreground hover:bg-secondary border border-border",
                )}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                السابق
              </button>

              <span className="text-sm text-muted-foreground">
                الخطوة {step} من {steps.length}
              </span>

              {step < 4 && (
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 min-h-11 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  التالي
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            اختر التواصل عبر البريد الإلكتروني{" "}
            <strong className="text-foreground">
              <bdi>{site.email}</bdi>
            </strong>{" "}
            أو حساب الواتساب.
          </p>
        </div>
      )}
    </div>
  );
}
