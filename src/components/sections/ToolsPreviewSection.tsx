"use client";

import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ToolCard } from "@/components/cards/ToolCard";

const defaultTools = [
  { icon: "Calculator", title: "حاسبة تكلفة المقهى", description: "احسب تكلفة تأسيس مقهاك بدقة.", href: "/tools" },
  { icon: "Coffee", title: "حاسبة نسبة الاستخلاص", description: "احسب نسبة الاستخلاص المثالية للقهوة.", href: "/tools" },
  { icon: "Coffee", title: "اختبار شخصية القهوة", description: "اكتشف أي نوع قهوة يناسبك.", href: "/tools" },
  { icon: "TrendingUp", title: "حاسبة تسعير المشروبات", description: "حدد أسعار مشروباتك بربحية مثالية.", href: "/tools" },
];

const defaultContent = {
  badge: "أدوات تفاعلية",
  heading: "أدوات تساعدك في قراراتك",
  description: "استخدم حاسباتنا واختباراتنا التفاعلية لتسهيل قراراتك.",
  tools: defaultTools,
  cta: { text: "جرب جميع الأدوات", href: "/tools" },
};

export function ToolsPreviewSection() {
  const { content } = useSiteContent("tools_section", defaultContent);
  const tools = content.tools || defaultTools;

  return (
    <section id="tools" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <Calculator className="w-3.5 h-3.5" />
            {content.badge}
          </div>
          <h2 className="heading-lg mb-3">{content.heading}</h2>
          <p className="body-base text-muted-foreground">{content.description}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {tools.map((tool, i) => (
            <ToolCard
              key={tool.title}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              index={i}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href={content.cta?.href || "/tools"} className="btn-premium inline-flex">
            {content.cta?.text || "جرب جميع الأدوات"}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
