"use client";

import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ToolCard } from "@/components/cards/ToolCard";

const defaultTools = [
  {
    icon: "Calculator",
    title: "حاسبة تكلفة المقهى",
    description: "اجمع ميزانية التأسيس حسب بنود مشروعك.",
    href: "/tools#cafe-cost",
  },
  {
    icon: "Coffee",
    title: "حاسبة نسبة الاستخلاص",
    description: "احسب الاستخلاص باستخدام قراءة TDS.",
    href: "/tools#extraction",
  },
  {
    icon: "Coffee",
    title: "اكتشف ذوقك في القهوة",
    description: "اكتشف أي نوع قهوة يناسبك.",
    href: "/tools#personality-quiz",
  },
  {
    icon: "TrendingUp",
    title: "حاسبة تسعير المشروبات",
    description: "جرّب سعر البيع حسب التكلفة والهامش.",
    href: "/tools#drink-pricing",
  },
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
  const tools = (content.tools || defaultTools).map((tool) => {
    const fallback = defaultTools.find(
      (entry) =>
        entry.title === tool.title ||
        (tool.title === "اختبار شخصية القهوة" &&
          entry.href === "/tools#personality-quiz"),
    );
    return tool.href === "/tools" && fallback
      ? { ...tool, href: fallback.href }
      : tool;
  });

  return (
    <section id="tools" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="text-right max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <Calculator className="w-3.5 h-3.5" />
            {content.badge}
          </div>
          <h2 className="heading-lg mb-3">{content.heading}</h2>
          <p className="body-base text-muted-foreground">
            {content.description}
          </p>
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
          <Link
            href={content.cta?.href || "/tools"}
            className="btn-premium inline-flex"
          >
            {content.cta?.text || "جرب جميع الأدوات"}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
