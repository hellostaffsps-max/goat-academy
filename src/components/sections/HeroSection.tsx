"use client";

import Link from "next/link";
import { ArrowLeft, Play, MessageSquare } from "lucide-react";
import { Coffee, GraduationCap, Store, Users } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "90+", label: "درس تعليمي" },
  { icon: Coffee, value: "150+", label: "مقال متخصص" },
  { icon: Store, value: "25+", label: "مشروع مقهى" },
  { icon: Users, value: "500+", label: "متدرب" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 text-accent-foreground text-xs font-medium mb-6 border border-accent/20 animate-fade-in">
            <Coffee className="w-3.5 h-3.5" />
            أكاديمية القهوة المختصة الأولى بالعربية
          </div>

          {/* Heading */}
          <h1 className="heading-xl text-foreground mb-6 animate-slide-up stagger-1">
            من شغف القهوة
            <span className="block text-accent mt-1">إلى الاحتراف</span>
          </h1>

          {/* Description */}
          <p className="body-lg mb-8 max-w-2xl mx-auto animate-slide-up stagger-2">
            تعلم القهوة المختصة، تطوير المقاهي، تدريب الباريستا، وبناء مشاريع ناجحة
            من خلال خبرة عملية ومعايير عالمية.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 animate-slide-up stagger-3">
            <Link
              href="/explore"
              className="btn-premium w-full sm:w-auto"
            >
              ابدأ التعلم
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/consultant"
              className="btn-accent w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4" />
              احجز استشارة
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-border hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 w-full sm:w-auto"
            >
              <Play className="w-4 h-4" />
              تصفح الدورات
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-slide-up stagger-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-4 text-center hover:border-accent/30 transition-colors"
                  style={{ animationDelay: `${0.4 + i * 0.05}s` }}
                >
                  <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
