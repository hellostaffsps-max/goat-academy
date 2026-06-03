"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, MessageSquare, Sparkles, CheckCircle } from "lucide-react";
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
  "رفح"
];

const services = [
  { id: "setup", label: "المساعدة في تأسيس المقهى وتجهيزه" },
  { id: "consulting", label: "استشارة تشغيلية وتطوير منيو القهوة" },
  { id: "training", label: "تدريب طاقم العمل وموظفي الباريستا" },
  { id: "costing", label: "دراسة تكاليف وجدوى مالية دقيقة" }
];

export default function ConsultantPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cafeName, setCafeName] = useState("");
  const [city, setCity] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getFormattedMessage = () => {
    const servicesText = selectedServices
      .map(id => services.find(s => s.id === id)?.label)
      .filter(Boolean)
      .join("، ");

    return `*طلب استشارة وتأسيس مقهى - أكاديمية GoatJourney*
----------------------------------------
*الاسم الكامل:* ${name}
*رقم الهاتف:* ${phone}
*البريد الإلكتروني:* ${email}
*اسم المقهى/المشروع:* ${cafeName || "غير محدد بعد"}
*المدينة:* ${city}
*الخدمات المطلوبة:* ${servicesText || "استشارة عامة"}
*الميزانية التقديرية:* ${budget || "غير محددة"}
*تفاصيل إضافية:*
${notes || "لا توجد تفاصيل إضافية"}`;
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) {
      alert("الرجاء تعبئة الحقول الأساسية: الاسم، الهاتف، والمدينة.");
      return;
    }

    const message = encodeURIComponent(getFormattedMessage());
    const whatsappUrl = `https://wa.me/970594136723?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) {
      alert("الرجاء تعبئة الحقول الأساسية: الاسم، الهاتف، والمدينة.");
      return;
    }

    const subject = encodeURIComponent("طلب استشارة تأسيس مقهى جديد - فلسطين");
    const body = encodeURIComponent(getFormattedMessage().replace(/\*/g, ""));
    const mailtoUrl = `mailto:gaotjourney.ps@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

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
          خطط لمشروع مقهاك بذكاء ودقة. نحن هنا لمساعدتك في التأسيس، إعداد المنيو، تدريب طاقم الباريستا، وتجهيز دراسات الجدوى المالية بالعملة المحلية (شيكل ₪).
        </p>
      </div>

      {submitted ? (
        <div className="card-premium p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
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
              onClick={() => {
                setSubmitted(false);
                setName("");
                setPhone("");
                setEmail("");
                setCafeName("");
                setCity("");
                setSelectedServices([]);
                setBudget("");
                setNotes("");
              }}
              className="bg-secondary text-secondary-foreground border border-border text-xs font-semibold px-5 py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 hover:bg-secondary/80"
            >
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

          {/* Form */}
          <form className="card-premium p-6 space-y-5 text-right">
            <h3 className="text-sm font-bold text-foreground border-b border-border/50 pb-2">
              نموذج طلب استشارة ودراسة تأسيس
            </h3>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="الاسم الأول والأخير"
                  className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  رقم الهاتف / الواتساب <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="059XXXXXXX"
                  className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  اسم المقهى / المشروع المقترح
                </label>
                <input
                  type="text"
                  value={cafeName}
                  onChange={e => setCafeName(e.target.value)}
                  placeholder="مثال: مقهى كرز"
                  className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  المدينة في فلسطين <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right"
                >
                  <option value="">اختر المدينة</option>
                  {palestinianCities.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  الميزانية التقديرية للتجهيز
                </label>
                <select
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right"
                >
                  <option value="">اختر الميزانية المتوقعة</option>
                  <option value="أقل من 50,000 شيكل ₪">أقل من 50,000 شيكل ₪</option>
                  <option value="50,000 - 100,000 شيكل ₪">50,000 - 100,000 شيكل ₪</option>
                  <option value="100,000 - 200,000 شيكل ₪">100,000 - 200,000 شيكل ₪</option>
                  <option value="أكثر من 200,000 شيكل ₪">أكثر من 200,000 شيكل ₪</option>
                </select>
              </div>
            </div>

            {/* Checkboxes for Services */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-medium text-muted-foreground block">
                الخدمات المطلوبة (يمكن اختيار أكثر من خدمة)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
                {services.map(s => (
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

            {/* Details */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                تفاصيل إضافية عن مشروعك واحتياجاتك
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                placeholder="اكتب هنا أي تفاصيل إضافية مثل المساحة، نوع الموقع، نوع التشغيل المتوقع..."
                className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-right resize-none"
              />
            </div>

            {/* Submission Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
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

            <p className="text-[10px] text-muted-foreground text-center pt-2">
              سيتم توجيه طلبك مباشرة إلى البريد الإلكتروني <strong className="text-foreground">gaotjourney.ps@gmail.com</strong> أو حساب الواتساب.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
