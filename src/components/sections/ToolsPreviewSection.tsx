"use client";

import Link from "next/link";
import { ArrowLeft, Calculator, Coffee, TrendingUp } from "lucide-react";

const tools = [
  {
    icon: Calculator,
    title: "حاسبة تكلفة المقهى",
    description: "احسب تكلفة تأسيس مقهاك بدقة.",
    href: "/tools",
  },
  {
    icon: Coffee,
    title: "حاسبة نسبة الاستخلاص",
    description: "احسب نسبة الاستخلاص المثالية للقهوة.",
    href: "/tools",
  },
  {
    icon: Coffee,
    title: "اختبار شخصية القهوة",
    description: "اكتشف أي نوع قهوة يناسبك.",
    href: "/tools",
  },
  {
    icon: TrendingUp,
    title: "حاسبة تسعير المشروبات",
    description: "حدد أسعار مشروباتك بربحية مثالية.",
    href: "/tools",
  },
];

export function ToolsPreviewSection() {
  return (
    <section id="tools" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <Calculator className="w-3.5 h-3.5" />
            أدوات تفاعلية
          </div>
          <h2 className="heading-lg mb-3">أدوات مساعدة</h2>
          <p className="body-base text-muted-foreground">
            استخدم حاسباتنا واختباراتنا التفاعلية لتسهيل قراراتك.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="card-premium group hover:scale-[1.02] transition-all duration-300 text-center"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{tool.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {tool.description}
                </p>
                <span className="text-xs font-semibold text-accent inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  جربها الآن
                  <ArrowLeft className="w-3 h-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
