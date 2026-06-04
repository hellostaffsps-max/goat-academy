"use client";

import Link from "next/link";
import { ArrowLeft, Play, MessageSquare, Coffee, Award, Clock, BookOpen, Wrench } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultFeatures = [
  { icon: "Award", title: "Q Grader معتمد", description: "مؤسس الأكاديمية حاصل على شهادة Coffee Quality Institute العالمية" },
  { icon: "Clock", title: "15+ سنة خبرة", description: "خبرة عملية في صناعة القهوة المختصة والاستشارات" },
  { icon: "BookOpen", title: "محتوى عربي متخصص", description: "أول منصة عربية تجمع التعليم العملي والاستشارات في مكان واحد" },
  { icon: "Wrench", title: "تعليم عملي", description: "محتوى مبني على تجربة حقيقية وليس نظريات عامة" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award, Clock, BookOpen, Wrench, Coffee,
};

const defaultContent = {
  badge: "أكاديمية القهوة المختصة الأولى بالعربية",
  heading: "من شغف القهوة",
  headingAccent: "إلى الاحتراف",
  description: "تعلم القهوة المختصة، تطوير المقاهي، تدريب الباريستا، وبناء مشاريع ناجحة من خلال خبرة عملية ومعايير عالمية.",
  ctaPrimary: { text: "ابدأ التعلم", href: "/explore" },
  ctaSecondary: { text: "احجز استشارة", href: "/consultant" },
  ctaTertiary: { text: "تصفح الدورات", href: "/courses" },
  features: defaultFeatures,
};

export function HeroSection() {
  const { content } = useSiteContent("hero_section", defaultContent);

  const features = content.features || defaultFeatures;

  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 text-accent-foreground text-xs font-medium mb-6 border border-accent/20 animate-fade-in">
            <Coffee className="w-3.5 h-3.5" />
            {content.badge}
          </div>

          <h1 className="heading-xl text-foreground mb-6 animate-slide-up stagger-1">
            {content.heading}
            <span className="block text-accent mt-1">{content.headingAccent}</span>
          </h1>

          <p className="body-lg mb-8 max-w-2xl mx-auto animate-slide-up stagger-2">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 animate-slide-up stagger-3">
            <Link href={content.ctaPrimary?.href || "/explore"} className="btn-premium w-full sm:w-auto">
              {content.ctaPrimary?.text || "ابدأ التعلم"}
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href={content.ctaSecondary?.href || "/consultant"} className="btn-accent w-full sm:w-auto">
              <MessageSquare className="w-4 h-4" />
              {content.ctaSecondary?.text || "احجز استشارة"}
            </Link>
            <Link href={content.ctaTertiary?.href || "/courses"} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-border hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 w-full sm:w-auto">
              <Play className="w-4 h-4" />
              {content.ctaTertiary?.text || "تصفح الدورات"}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-slide-up stagger-4">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Award;
              return (
                <div
                  key={feature.title}
                  className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-4 text-center hover:border-accent/30 transition-colors"
                  style={{ animationDelay: `${0.4 + i * 0.05}s` }}
                >
                  <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-sm font-bold text-foreground">{feature.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{feature.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
