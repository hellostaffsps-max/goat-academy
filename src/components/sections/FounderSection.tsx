"use client";

import { Award, Target, TrendingUp, Coffee } from "lucide-react";
import Image from "next/image";

const achievements = [
  { icon: Award, label: "شهادة CQI Q Grader معتمدة عالمياً" },
  { icon: Target, label: "15+ سنة خبرة في صناعة القهوة" },
  { icon: TrendingUp, label: "بناء وإدارة علامات تجارية ناجحة" },
  { icon: Coffee, label: "تدريب 500+ باريستا ومقهى حول العالم" },
];

export function FounderSection() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-sm mx-auto md:max-w-none border border-border/60 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
              <Image
                src="/images/founder.jpg"
                alt="يوسف خليل — مؤسس أكاديمية القهوة"
                fill
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
            {/* Floating badge */}
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

          {/* Content side */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
              <Target className="w-3.5 h-3.5" />
              قصة التأسيس
            </div>
            <h2 className="heading-lg mb-4">
              من مؤسس الأكاديمية
            </h2>
            <div className="space-y-3 text-muted-foreground body-base mb-6">
              <p>
                يوسف خليل، مؤسس Goat Journey Academy، يحمل شهادة Q Grader من Coffee Quality Institute
                ويملك خبرة واسعة في صناعة القهوة المختصة امتدت لأكثر من 15 عاماً.
              </p>
              <p>
                بدأ رحلته من تقديم استشارات للمقاهي الناشئة، إلى بناء منصة تعليمية شاملة
                تهدف لرفع مستوى صناعة القهوة العربية وتقديم المعرفة بأعلى المعايير العالمية.
              </p>
              <p>
                رسالته واضحة: مساعدة كل من يحلم بفتح مقهى أو الاحتراف في القهوة المختصة
                على تحقيق هدفه من خلال تعليم عملي واستشارات مبنية على خبرة حقيقية.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/60 hover:border-accent/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-xs font-medium text-foreground leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
