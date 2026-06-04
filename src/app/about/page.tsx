"use client";

import { Award, Target, TrendingUp, Coffee, BookOpen, Users, MapPin } from "lucide-react";
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
  { year: "2015", title: "بداية الرحلة", description: "بدأ يوسف خليل رحلته في عالم القهوة المختصة." },
  { year: "2018", title: "شهادة Q Grader", description: "حصوله على شهادة Coffee Quality Institute معتمدة عالمياً." },
  { year: "2020", title: "أول استشارات", description: "تقديم أول استشارات تأسيس مقاهٍ في فلسطين." },
  { year: "2023", title: "إطلاق الأكاديمية", description: "إطلاق المنصة التعليمية الأولى باللغة العربية في القهوة المختصة." },
  { year: "2024", title: "500+ متدرب", description: "وصول عدد المتدربين والمستفيدين لأكثر من 500 شخص حول العالم." },
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
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-sm mx-auto border border-border/60 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
              <Image
                src="/images/founder.jpg"
                alt="يوسف خليل — مؤسس أكاديمية القهوة"
                fill
                loading="lazy"
                className="object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement?.classList.add("bg-gradient-to-br", "from-accent/20", "to-accent/5", "flex", "items-center", "justify-center");
                  const fallback = document.createElement("div");
                  fallback.className = "text-6xl font-bold text-accent/40 select-none";
                  fallback.textContent = "Y";
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </div>
            <div className="absolute -bottom-4 right-4 sm:right-8 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
                  <Award className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Q Grader معتمد</div>
                  <div className="text-[10px] text-muted-foreground">CQI معتمد</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="heading-lg mb-4">يوسف خليل</h2>
            <p className="text-sm text-accent font-semibold mb-4">مؤسس Goat Journey Academy</p>
            <div className="space-y-3 text-muted-foreground body-base">
              <p>
                يحمل شهادة Q Grader من Coffee Quality Institute، ويملك خبرة واسعة في صناعة القهوة
                المختصة امتدت لأكثر من 15 عاماً.
              </p>
              <p>
                بدأ رحلته من تقديم استشارات للمقاهي الناشئة، إلى بناء منصة تعليمية شاملة تهدف
                لرفع مستوى صناعة القهوة العربية وتقديم المعرفة بأعلى المعايير العالمية.
              </p>
              <p>
                رسالته واضحة: مساعدة كل من يحلم بفتح مقهى أو الاحتراف في القهوة المختصة
                على تحقيق هدفه من خلال تعليم عملي واستشارات مبنية على خبرة حقيقية.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { icon: Award, label: "شهادة Q Grader" },
                { icon: TrendingUp, label: "15+ سنة خبرة" },
                { icon: Coffee, label: "بناء علامات تجارية" },
                { icon: Users, label: "500+ متدرب" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border/60">
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
