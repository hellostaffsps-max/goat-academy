"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2, Mail } from "lucide-react";

const resources = [
  {
    icon: FileText,
    title: "دليل فتح مقهى ناجح",
    description: "كتاب إلكتروني شامل يغطي كل مراحل تأسيس مقهى من الصفر حتى الافتتاح.",
    pages: "45 صفحة",
  },
  {
    icon: FileText,
    title: "قائمة أسعار المعدات",
    description: "جدول مفصل لأسعار المعدات الأساسية والاختيارية لمقهى القهوة المختصة.",
    pages: "12 صفحة",
  },
  {
    icon: FileText,
    title: "نموذج خطة عمل مقهى",
    description: "نموذج جاهز لخطة عمل مالية وتسويقية يمكن تعديلها حسب مشروعك.",
    pages: "28 صفحة",
  },
];

export function ResourcesSection() {
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
    <section id="resources" className="section-padding gradient-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Resources */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
              <Download className="w-3.5 h-3.5" />
              مصادر مجانية
            </div>
            <h2 className="heading-lg mb-3">تحميلات مجانية</h2>
            <p className="body-base text-muted-foreground mb-6">
              احصل على مصادر قيمة مجاناً لتساعدك في رحلتك في عالم القهوة.
            </p>

            <div className="space-y-3">
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
                      <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                        {resource.description}
                      </p>
                      <span className="text-[10px] text-accent font-medium">
                        {resource.pages}
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-accent transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead capture form */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                اشترك واحصل على المصادر المجانية
              </h3>
              <p className="text-sm text-muted-foreground">
                أدخل بريدك الإلكتروني واحصل على الوصول الفوري لجميع المصادر المجانية.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all text-right"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full btn-premium justify-center"
                disabled={submitted}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    تم الإرسال بنجاح!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    احصل على المصادر الآن
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-muted-foreground text-center mt-4">
              لا نشارك بريدك مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
