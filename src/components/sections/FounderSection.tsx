"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  Target,
  GraduationCap,
  Users,
  Store,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSiteContent } from "@/hooks/useSiteContent";

/* ---------- Animated Counter ---------- */
function AnimatedNumber({
  value,
  suffix = "",
  duration = 1500,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ---------- Defaults ---------- */
const defaultAchievements = [
  {
    icon: "Target",
    number: 9,
    suffix: "+",
    title: "سنوات خبرة",
    desc: "في القهوة المختصة والضيافة",
  },
  {
    icon: "GraduationCap",
    number: 1,
    suffix: "",
    title: "شهادات احترافية عالمية",
    desc: "SCA و Espresso Academy Florence",
  },
  {
    icon: "Users",
    number: 1,
    suffix: "",
    title: "تدريب وتطوير الباريستا",
    desc: "وفق معايير عالمية",
  },
  {
    icon: "Store",
    number: 1,
    suffix: "",
    title: "تصميم وتشغيل المقاهي",
    desc: "وبناء أنظمة عمل احترافية",
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  GraduationCap,
  Users,
  Store,
  Award,
  Sparkles,
};

const defaultContent = {
  badge: "من مؤسس الأكاديمية",
  heading: "من مؤسس الأكاديمية",
  name: "وائل أرزيقات",
  description: `وائل أرزيقات، مؤسس Goat Journey Academy، مدرب واستشاري قهوة مختصة حاصل على شهادات احترافية من Specialty Coffee Association (SCA) ودبلوم من Espresso Academy في فلورنسا – إيطاليا.

يمتلك خبرة عملية تزيد عن 9 سنوات في صناعة القهوة المختصة، وتشغيل المقاهي، وتطوير فرق الباريستا، وتصميم المشروبات، وبناء برامج تدريبية احترافية تجمع بين المعرفة الأكاديمية والتطبيق العملي.

كرّس مسيرته المهنية لنشر ثقافة القهوة المختصة وتطوير مهارات العاملين في القطاع من خلال التدريب والاستشارات ونقل أفضل الممارسات العالمية إلى السوق المحلي والعربي.

أؤمن أن نجاح أي مقهى يبدأ من المعرفة الصحيحة، والتدريب المستمر، والاهتمام بالتفاصيل التي تصنع تجربة استثنائية للعميل.`,
  image: "/images/founder.jpg",
  achievements: defaultAchievements,
  cta: { text: "تعرف على وائل", href: "/about" },
};

export function FounderSection() {
  const { content } = useSiteContent("founder_section", defaultContent);
  const achievements = content.achievements || defaultAchievements;

  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ---------- Image Side ---------- */}
          <div className="relative group">
            {/* Decorative ring behind image */}
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/20 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-sm mx-auto md:max-w-none border border-border/60 shadow-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
              <Image
                src={content.image || "/images/founder.jpg"}
                alt={`${content.name || "وائل أرزيقات"} — مدرب واستشاري قهوة مختصة`}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement?.classList.add(
                    "bg-gradient-to-br",
                    "from-accent/20",
                    "to-accent/5",
                    "flex",
                    "items-center",
                    "justify-center"
                  );
                  const fallback = document.createElement("div");
                  fallback.className =
                    "text-6xl font-bold text-accent/40 select-none";
                  fallback.textContent = "و";
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 right-4 sm:right-10 bg-card/95 backdrop-blur-md border border-border rounded-2xl px-5 py-3 shadow-2xl z-20 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center ring-2 ring-accent/20">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground leading-tight">
                    مدرب واستشاري قهوة مختصة
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    SCA Certified Coffee Professional
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Content Side ---------- */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium mb-5 border border-accent/20">
              <Sparkles className="w-3.5 h-3.5" />
              {content.badge}
            </div>

            {/* Heading */}
            <h2 className="heading-lg mb-5">{content.heading}</h2>

            {/* Bio paragraphs */}
            <div className="space-y-4 text-muted-foreground body-base mb-8">
              {content.description.split("\n\n").map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Achievement cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {achievements.map((item) => {
                const Icon = iconMap[item.icon] || Award;
                const num = typeof item.number === "number" ? item.number : 1;
                const showCounter = num > 1;

                return (
                  <div
                    key={item.title}
                    className="group/card flex items-center gap-3 p-4 rounded-xl bg-card border border-border/60 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover/card:bg-accent/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-foreground leading-tight mb-0.5">
                        {showCounter ? (
                          <AnimatedNumber value={num} suffix={item.suffix} />
                        ) : (
                          item.title
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground leading-tight">
                        {showCounter ? item.title : item.desc}
                      </div>
                      {showCounter && (
                        <div className="text-[11px] text-muted-foreground leading-tight">
                          {item.desc}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <Link
              href={content.cta?.href || "/about"}
              className="btn-accent inline-flex"
            >
              {content.cta?.text || "تعرف على وائل"}
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
