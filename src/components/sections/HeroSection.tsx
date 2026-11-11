"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  MessageSquare,
  Coffee,
  Award,
  Clock,
  BookOpen,
  Wrench,
} from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultFeatures = [
  {
    icon: "Award",
    title: "تدريب عملي",
    description: "مهارات التحضير وضبط الجودة وتنظيم البار",
  },
  {
    icon: "Clock",
    title: "خطة تناسب احتياجك",
    description: "تحديد النطاق والمواعيد قبل البدء",
  },
  {
    icon: "BookOpen",
    title: "محتوى عربي",
    description: "دروس ومراجع للقهوة وتشغيل المقاهي",
  },
  {
    icon: "Wrench",
    title: "استشارات المقاهي",
    description: "من قرارات التجهيز إلى المنيو وتدريب الفريق",
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Clock,
  BookOpen,
  Wrench,
  Coffee,
};

const defaultContent = {
  badge: "تدريب واستشارات قهوة في فلسطين",
  heading: "من شغف القهوة",
  headingAccent: "إلى الاحتراف",
  description:
    "مع وائل أرزيقات — Wael Irzeqat، مؤسس Goat Journey. تعلم القهوة المختصة، وطوّر مهارات الباريستا وطريقة عمل مقهاك.",
  ctaPrimary: { text: "ابدأ التعلم", href: "/paths" },
  ctaSecondary: { text: "احجز استشارة", href: "/consultant" },
  ctaTertiary: { text: "تصفح الدروس", href: "/courses" },
  features: defaultFeatures,
};

export function HeroSection() {
  const { content } = useSiteContent("hero_section", defaultContent);
  const features = content.features || defaultFeatures;

  return (
    <section className="academy-hero relative overflow-hidden rounded-xl bg-brand-charcoal text-brand-offwhite">
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-center px-6 sm:px-10 py-10 sm:py-16">
        <div className="lg:col-span-7 text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 text-brand-yellow text-sm font-medium mb-5 border border-accent/20 animate-fade-in">
            <Coffee className="w-3.5 h-3.5" />
            {content.badge}
          </div>

          <h1 className="heading-xl text-brand-offwhite mb-4 animate-slide-up stagger-1">
            {content.heading}
            <span className="block text-brand-yellow mt-1">
              {content.headingAccent}
            </span>
          </h1>

          <p className="text-base sm:text-lg leading-[1.9] text-brand-offwhite/75 mb-6 max-w-2xl animate-slide-up stagger-2">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 mb-8 animate-slide-up stagger-3">
            <Link
              href={
                !content.ctaPrimary?.href ||
                content.ctaPrimary.href === "/explore"
                  ? "/paths"
                  : content.ctaPrimary.href
              }
              className="btn-accent w-full sm:w-auto"
            >
              {content.ctaPrimary?.text || "ابدأ التعلم"}
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href={content.ctaSecondary?.href || "/consultant"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10 w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4" />
              {content.ctaSecondary?.text || "احجز استشارة"}
            </Link>
            <Link
              href={content.ctaTertiary?.href || "/courses"}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/25 hover:border-accent/40 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
            >
              <Play className="w-4 h-4" />
              {content.ctaTertiary?.text?.replace("الدورات", "الدروس") ||
                "تصفح الدروس"}
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6 animate-slide-up stagger-5">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Award;
              return (
                <div
                  key={feature.title}
                  className="text-right"
                  style={{ animationDelay: `${0.6 + i * 0.05}s` }}
                >
                  <Icon className="w-5 h-5 text-brand-yellow mb-2" />
                  <div className="text-sm font-semibold text-brand-offwhite">
                    {feature.title}
                  </div>
                  <div className="text-sm leading-relaxed text-brand-offwhite/70 mt-0.5">
                    {feature.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <figure className="lg:col-span-5 hidden lg:block">
          <Image
            src="/images/founder.webp"
            alt="وائل أرزيقات، مؤسس Goat Journey"
            width={700}
            height={900}
            className="w-full rounded-lg object-cover aspect-[4/5]"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <figcaption className="mt-4 text-sm text-brand-offwhite/75">
            وائل أرزيقات · تدريب واستشارات القهوة
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
