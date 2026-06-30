"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ResourceCard } from "@/components/cards/ResourceCard";

const defaultResources = [
  { icon: "FileText", title: "دليل فتح مقهى ناجح", description: "دليل شامل يغطي كل مراحل التأسيس", pages: "45 صفحة" },
  { icon: "FileText", title: "قائمة أسعار المعدات", description: "جدول مفصل للمعدات الأساسية والاختيارية", pages: "12 صفحة" },
  { icon: "FileText", title: "نموذج خطة عمل مقهى", description: "نموذج جاهز يمكن تعديله", pages: "28 صفحة" },
];

const defaultContent = {
  badge: "مصادر مجانية",
  heading: "تحميلات مجانية",
  description: "احصل على مصادر قيمة مجاناً لتساعدك في رحلتك في عالم القهوة.",
  resources: defaultResources,
  formTitle: "اشترك في نصائحنا الأسبوعية",
  formDescription: "أدخل بريدك الإلكتروني واحصل على الوصول الفوري لجميع المصادر المجانية.",
  submitText: "احصل على المصادر الآن",
  successText: "تم الإرسال بنجاح!",
  privacyText: "لا نشارك بريدك مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.",
};

export function ResourcesSection() {
  const { content } = useSiteContent("resources_section", defaultContent);
  const resources = content.resources || defaultResources;

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="resources" className="section-padding gradient-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
              <Download className="w-3.5 h-3.5" />
              {content.badge}
            </div>
            <h2 className="heading-lg mb-3">{content.heading}</h2>
            <p className="body-base text-muted-foreground mb-6">{content.description}</p>
 
            <div className="space-y-3">
              {resources.map((resource, i) => (
                <ResourceCard
                  key={resource.title}
                  icon={resource.icon}
                  title={resource.title}
                  description={resource.description}
                  pages={resource.pages}
                  index={i}
                />
              ))}
            </div>
          </div>
 
          <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-lg">
            {submitted ? (
              <div className="text-center space-y-4 animate-fade-in py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">شكرًا لاهتمامك!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تم توفير روابط الوصول الفوري للمصادر المجانية أدناه. اضغط على أي مصدر لفتحه وحفظه كـ PDF:
                </p>
                <div className="space-y-2 mt-4 text-right">
                  <a
                    href="/downloads/cafe-launch-guide?print=true"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all hover:scale-[1.01] duration-200"
                  >
                    <span className="text-xs font-semibold text-foreground">دليل فتح مقهى ناجح في فلسطين</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">تحميل PDF</span>
                  </a>
                  <a
                    href="/downloads/equipment-price-list?print=true"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all hover:scale-[1.01] duration-200"
                  >
                    <span className="text-xs font-semibold text-foreground">قائمة أسعار المعدات (بالشيكل ₪)</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">تحميل PDF</span>
                  </a>
                  <a
                    href="/downloads/cafe-business-plan?print=true"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all hover:scale-[1.01] duration-200"
                  >
                    <span className="text-xs font-semibold text-foreground">نموذج خطة عمل المقهى وهندسة التكاليف</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">تحميل PDF</span>
                  </a>
                  <a
                    href="/downloads/home-roasting-guide?print=true"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all hover:scale-[1.01] duration-200"
                  >
                    <span className="text-xs font-semibold text-foreground">دليل التحميص المنزلي للمبتدئين</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">تحميل PDF</span>
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
                  <h3 className="text-lg font-bold text-foreground mb-2">{content.formTitle}</h3>
                  <p className="text-sm text-muted-foreground">{content.formDescription}</p>
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
                    className="w-full btn-premium justify-center font-semibold"
                  >
                    <Sparkles className="w-4 h-4" />
                    {content.submitText}
                  </button>
                </form>

                <p className="text-[10px] text-muted-foreground text-center mt-4">{content.privacyText}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
