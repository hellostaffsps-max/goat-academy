"use client";

import Link from "next/link";
import { ArrowLeft, Star, MessageSquare, TrendingUp } from "lucide-react";

const stories = [
  {
    name: "مقهى البن العربي",
    location: "رام الله، فلسطين",
    quote: "بعد استشارة Goat Journey Academy، زادت مبيعاتنا بنسبة 60% خلال 3 أشهر فقط. التوجيهات العملية غيّرت مسار مشروعنا بالكامل.",
    metric: "+60% مبيعات",
  },
  {
    name: "روستري التخصص",
    location: "عمان، الأردن",
    quote: "التدريب المكثف في الأكاديمية ساعد فريقنا في رفع جودة التحميص وتحقيق درجات Q Grader ممتازة.",
    metric: "جودة ممتازة",
  },
  {
    name: "كافيه نابلس الجديد",
    location: "نابلس، فلسطين",
    quote: "بدأنا من الصفر بفضل خطة العمل المفصلة. اليوم لدينا مقهى ناجح بأكثر من 200 زبون يومياً.",
    metric: "200+ زبون/يوم",
  },
];

export function SuccessStoriesSection() {
  return (
    <section id="stories" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <TrendingUp className="w-3.5 h-3.5" />
            قصص النجاح
          </div>
          <h2 className="heading-lg mb-3">مشاريع ناجحة بنيناها معاً</h2>
          <p className="body-base text-muted-foreground">
            قصص حقيقية من أصحاب مقاهٍ ومشاريع استفادوا من خبرتنا.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stories.map((story, i) => (
            <div
              key={story.name}
              className="card-premium relative"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <MessageSquare className="w-8 h-8 text-accent/20 absolute top-4 right-4" />
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                &ldquo;{story.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div>
                  <div className="text-sm font-bold text-foreground">{story.name}</div>
                  <div className="text-[11px] text-muted-foreground">{story.location}</div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {story.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/success-stories" className="btn-accent inline-flex">
            جميع قصص النجاح
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
