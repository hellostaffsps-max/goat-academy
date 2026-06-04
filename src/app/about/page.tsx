"use client";

import { Award, Target, GraduationCap, Users, Store, BookOpen, Coffee, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "الجودة أولاً",
    description: "نلتزم بأعلى معايير الجودة في كل محتوى نقدمه، من التدريب إلى الاستشارات.",
  },
  {
    icon: BookOpen,
    title: "تعليم عملي",
    description: "محتوى يعتمد على التجربة العملية وليس النظرية فقط، قابل للتطبيق مباشرة.",
  },
  {
    icon: Coffee,
    title: "محتوى عربي متميز",
    description: "نملأ الفجوة في المحتوى العربي المتخصص في صناعة القهوة بأعلى المعايير.",
  },
  {
    icon: Users,
    title: "مجتمع متعاون",
    description: "نبني مجتمعاً من المحترفين يتبادلون الخبرات ويدعمون بعضهم البعض.",
  },
];

const milestones = [
  { year: "2015", title: "بداية الرحلة", description: "بدأ وائل أرزيقات رحلته في عالم القهوة المختصة والضيافة." },
  { year: "2018", title: "شهادات SCA", description: "حصوله على شهادات احترافية من Specialty Coffee Association." },
  { year: "2020", title: "دبلوم إيطاليا", description: "إتمام دبلوم تخصصي من Espresso Academy في فلورنسا – إيطاليا." },
  { year: "2023", title: "إطلاق الأكاديمية", description: "إطلاق Goat Journey Academy لتقديم تدريب واستشارات احترافية." },
  { year: "2024", title: "تأثير عربي", description: "توسيع نطاق التدريب والاستشارات لتشمل السوق العربي." },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <Target className="w-3.5 h-3.5" />
            من نحن
          </div>
          <h1 className="heading-xl mb-4">
            أكاديمية تغيّر مسار
            <span className="block text-accent mt-1">صناعة القهوة العربية</span>
          </h1>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            نؤمن أن كل شخص يستحق الوصول لمعرفة القهوة بأعلى معاييرها. مهمتنا بناء جيل من المحترفين.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative group">
            {/* Decorative glow */}
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/20 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-sm mx-auto border border-border/60 shadow-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
              <Image
                src="/images/founder.webp"
                alt="وائل أرزيقات — مدرب واستشاري قهوة مختصة"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement?.classList.add("bg-gradient-to-br", "from-accent/20", "to-accent/5", "flex", "items-center", "justify-center");
                  const fallback = document.createElement("div");
                  fallback.className = "text-6xl font-bold text-accent/40 select-none";
                  fallback.textContent = "و";
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </div>

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

          <div>
            <h2 className="heading-lg mb-2">وائل أرزيقات</h2>
            <p className="text-sm text-accent font-semibold mb-5">مؤسس Goat Journey Academy</p>
            <div className="space-y-4 text-muted-foreground body-base">
              <p>
                وائل أرزيقات، مدرب واستشاري قهوة مختصة حاصل على شهادات احترافية من Specialty Coffee Association (SCA) ودبلوم من Espresso Academy في فلورنسا – إيطاليا.
              </p>
              <p>
                يمتلك خبرة عملية تزيد عن 9 سنوات في صناعة القهوة المختصة، وتشغيل المقاهي، وتطوير فرق الباريستا، وتصميم المشروبات، وبناء برامج تدريبية احترافية تجمع بين المعرفة الأكاديمية والتطبيق العملي.
              </p>
              <p>
                كرّس مسيرته المهنية لنشر ثقافة القهوة المختصة وتطوير مهارات العاملين في القطاع من خلال التدريب والاستشارات ونقل أفضل الممارسات العالمية إلى السوق المحلي والعربي.
              </p>
              <p>
                أؤمن أن نجاح أي مقهى يبدأ من المعرفة الصحيحة، والتدريب المستمر، والاهتمام بالتفاصيل التي تصنع تجربة استثنائية للعميل.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { icon: Target, label: "9+ سنوات خبرة" },
                { icon: GraduationCap, label: "شهادات SCA عالمية" },
                { icon: Users, label: "تدريب الباريستا" },
                { icon: Store, label: "تشغيل المقاهي" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border/60 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="heading-lg mb-3">قيمنا</h2>
          <p className="body-base text-muted-foreground">المبادئ التي نبني عليها كل ما نقوم به.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="card-premium text-center p-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="gradient-card py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-lg mb-3">رحلتنا</h2>
            <p className="body-base text-muted-foreground">محطات مهمة في مسيرتنا.</p>
          </div>
          <div className="relative">
            <div className="absolute right-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="relative flex items-start gap-6 pr-10">
                  <div className="absolute right-2.5 top-1 w-3 h-3 rounded-full bg-accent border-2 border-background" />
                  <div>
                    <span className="text-xs font-bold text-accent">{m.year}</span>
                    <h3 className="text-sm font-bold text-foreground mt-0.5">{m.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="card-premium p-8 text-center">
          <h2 className="heading-lg mb-3">انضم إلى رحلتنا</h2>
          <p className="body-base text-muted-foreground mb-6 max-w-lg mx-auto">
            سواء كنت مبتدئاً أو صاحب مقهى، لدينا ما يساعدك على التقدم.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/explore" className="btn-premium w-full sm:w-auto">
              ابدأ التعلم
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/consultant" className="btn-accent w-full sm:w-auto">
              احجز استشارة
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
