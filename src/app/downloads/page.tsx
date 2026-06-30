"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2, Mail, BookOpen, Calculator, Store } from "lucide-react";

const resources = [
  {
    icon: BookOpen,
    title: "دليل فتح مقهى ناجح",
    description: "كتاب إلكتروني شامل يغطي كل مراحل تأسيس مقهى من الصفر حتى الافتتاح.",
    pages: "45 صفحة",
    format: "PDF",
  },
  {
    icon: Calculator,
    title: "قائمة أسعار المعدات",
    description: "جدول مفصل لأسعار المعدات الأساسية والاختيارية لمقهى القهوة المختصة.",
    pages: "12 صفحة",
    format: "PDF",
  },
  {
    icon: Store,
    title: "نموذج خطة عمل مقهى",
    description: "نموذج جاهز لخطة عمل مالية وتسويقية يمكن تعديلها حسب مشروعك.",
    pages: "28 صفحة",
    format: "PDF",
  },
  {
    icon: FileText,
    title: "دليل التحميص المنزلي",
    description: "دليل عملي لتحميص القهوة في المنزل باستخدام أدوات بسيطة.",
    pages: "18 صفحة",
    format: "PDF",
  },
];

export default function DownloadsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      {/* Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
          <Download className="w-3.5 h-3.5" />
          مصادر مجانية
        </div>
        <h1 className="heading-xl mb-3">تحميلات مجانية</h1>
        <p className="body-base text-muted-foreground max-w-xl mx-auto">
          احصل على مصادر قيمة مجاناً لتساعدك في رحلتك في عالم القهوة.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resources list */}
          <div className="space-y-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-accent/30 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {resource.format}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {resource.pages}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lead capture */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-lg h-fit">
            {submitted ? (
              <div className="text-center space-y-4 animate-fade-in py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h2 className="text-lg font-bold text-foreground">شكرًا لاهتمامك!</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تم توفير روابط الوصول الفوري للمصادر المجانية أدناه. اضغط على أي مصدر لفتحه وطباعته أو حفظه كـ PDF:
                </p>
                <div className="space-y-2 mt-4 text-right">
                  <a
                    href="/downloads/cafe-launch-guide"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all hover:scale-[1.01] duration-200"
                  >
                    <span className="text-xs font-semibold text-foreground">دليل فتح مقهى ناجح في فلسطين</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">تحميل A4 PDF</span>
                  </a>
                  <a
                    href="/downloads/equipment-price-list"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all hover:scale-[1.01] duration-200"
                  >
                    <span className="text-xs font-semibold text-foreground">قائمة أسعار المعدات (بالشيكل ₪)</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">تحميل A4 PDF</span>
                  </a>
                  <a
                    href="/downloads/cafe-business-plan"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all hover:scale-[1.01] duration-200"
                  >
                    <span className="text-xs font-semibold text-foreground">نموذج خطة عمل المقهى وهندسة التكاليف</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">تحميل A4 PDF</span>
                  </a>
                  <a
                    href="/downloads/home-roasting-guide"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all hover:scale-[1.01] duration-200"
                  >
                    <span className="text-xs font-semibold text-foreground">دليل التحميص المنزلي للمبتدئين</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">تحميل A4 PDF</span>
                  </a>
                </div>
                
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-[10px] text-muted-foreground hover:underline mt-4 block mx-auto"
                >
                  استخدام بريد إلكتروني آخر
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-accent" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    احصل على المصادر مجاناً
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    أدخل بريدك الإلكتروني واحصل على الوصول الفوري لجميع المصادر.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all text-right"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full btn-premium justify-center font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    احصل على المصادر الآن
                  </button>
                </form>

                <p className="text-[10px] text-muted-foreground text-center mt-4">
                  لا نشارك بريدك مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
