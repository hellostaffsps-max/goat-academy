"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap, Store, Users, Headphones, Target } from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "تدريب الباريستا",
    description: "دورات احترافية تبدأ من الأساسيات وحتى المستويات المتقدمة في تحضير الإسبريسو والميلك رور والتقطير.",
    href: "/services#training",
  },
  {
    icon: Store,
    title: "تطوير المقاهي",
    description: "تصميم المقاهي، اختيار المعدات، بناء قائمة المشروبات، وتطوير تجربة العملاء من الصفر.",
    href: "/services#cafe",
  },
  {
    icon: Users,
    title: "استشارات أعمال",
    description: "استشارات مخصصة لأصحاب المشاريع من التخطيط المالي ونماذج الأعمال إلى التسويق والتوسع.",
    href: "/consultant",
  },
  {
    icon: Headphones,
    title: "تدريب الشركات",
    description: "برامج تدريب مخصصة للفرق والشركات في مجال صناعة القهوة وخدمة العملاء.",
    href: "/services#corporate",
  },
  {
    icon: Target,
    title: "جودة واختبار",
    description: "اختبار جودة القهوة، تقييم الحبوب، وضمان معايير الجودة وفقاً لمعايير SCA.",
    href: "/services#quality",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="section-padding gradient-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <Target className="w-3.5 h-3.5" />
            الخدمات
          </div>
          <h2 className="heading-lg mb-3">خدماتنا المتخصصة</h2>
          <p className="body-base text-muted-foreground">
            نقدم حلولاً متكاملة في صناعة القهوة، من التدريب إلى تأسيس المقاهي وإدارتها.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                href={service.href}
                className="group card-premium p-6 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
                  تعرف أكثر
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="btn-accent inline-flex"
          >
            استعرض جميع الخدمات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
