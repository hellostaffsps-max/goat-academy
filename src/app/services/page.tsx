"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap, Store, Users, Headphones, Target, CheckCircle2 } from "lucide-react";

const services = [
  {
    id: "training",
    icon: GraduationCap,
    title: "تدريب الباريستا",
    description: "دورات احترافية تبدأ من الأساسيات وحتى المستويات المتقدمة في تحضير الإسبريسو والميلك رور والتقطير.",
    features: [
      "دورات من المبتدئين إلى المتقدمين",
      "تدريب عملي على المعدات الحقيقية",
      "شهادات معتمدة",
      "متابعة بعد التدريب",
    ],
    price: "ابتداءً من ₪750",
  },
  {
    id: "cafe",
    icon: Store,
    title: "تطوير المقاهي",
    description: "تصميم المقاهي، اختيار المعدات، بناء قائمة المشروبات، وتطوير تجربة العملاء من الصفر.",
    features: [
      "تصميم خطة تشغيل كاملة",
      "اختيار المعدات المناسبة للميزانية",
      "بناء قائمة مشروبات احترافية",
      "تدريب الفريق قبل الافتتاح",
    ],
    price: "ابتداءً من ₪1,850",
  },
  {
    id: "corporate",
    icon: Users,
    title: "تدريب الشركات",
    description: "برامج تدريب مخصصة للفرق والشركات في مجال صناعة القهوة وخدمة العملاء.",
    features: [
      "برامج مخصصة حسب احتياج الشركة",
      "تدريب فرق الخدمة",
      "تطوير معايير الجودة",
      "ورش عمل جماعية",
    ],
    price: "حسب الاتفاق",
  },
  {
    id: "quality",
    icon: Target,
    title: "جودة واختبار",
    description: "اختبار جودة القهوة، تقييم الحبوب، وضمان معايير الجودة وفقاً لمعايير SCA.",
    features: [
      "تقييم حبوب القهوة (Cupping)",
      "ضبط معايير التحميص",
      "تطوير بروفايل المشروبات",
      "تقارير جودة مفصلة",
    ],
    price: "حسب المشروع",
  },
];

export default function ServicesPage() {
  return (
    <div className="animate-fade-in space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <Target className="w-3.5 h-3.5" />
            خدماتنا
          </div>
          <h1 className="heading-xl mb-4">
            حلول متكاملة في
            <span className="block text-accent mt-1">صناعة القهوة</span>
          </h1>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            من التدريب إلى تأسيس المقاهي، نقدم خدمات احترافية تلبي كل احتياجاتك.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              id={service.id}
              className="card-premium p-6 sm:p-8"
            >
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{service.title}</h2>
                      <p className="text-xs text-muted-foreground">{service.price}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/consultant"
                  className="btn-premium whitespace-nowrap"
                >
                  احجز الآن
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="gradient-card rounded-3xl p-8 text-center">
          <Headphones className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="heading-lg mb-3">لديك مشروع خاص؟</h2>
          <p className="body-base text-muted-foreground mb-6 max-w-lg mx-auto">
            تواصل معنا لمناقشة احتياجاتك المحددة وسنبني لك خطة مخصصة.
          </p>
          <Link href="/consultant" className="btn-premium inline-flex">
            احجز استشارة مجانية
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
