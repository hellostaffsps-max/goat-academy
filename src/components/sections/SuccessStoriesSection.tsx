"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { StoryCard } from "@/components/cards/StoryCard";

const defaultStories = [
  { name: "مقهى البن العربي", location: "رام الله، فلسطين", quote: "بعد استشارة Goat Journey Academy، زادت مبيعاتنا بنسبة 60% خلال 3 أشهر فقط. التوجيهات العملية غيّرت مسار مشروعنا بالكامل.", metric: "+60% مبيعات" },
  { name: "روستري التخصص", location: "عمان، الأردن", quote: "التدريب المكثف في الأكاديمية ساعد فريقنا في رفع جودة التحميص وتحقيق درجات Q Grader ممتازة.", metric: "جودة ممتازة" },
  { name: "كافيه نابلس الجديد", location: "نابلس، فلسطين", quote: "بدأنا من الصفر بفضل خطة العمل المفصلة. اليوم لدينا مقهى ناجح بأكثر من 200 زبون يومياً.", metric: "200+ زبون/يوم" },
];

const defaultContent = {
  badge: "قصص النجاح",
  heading: "مشاريع ناجحة بنيناها معاً",
  description: "قصص حقيقية من أصحاب مقاهٍ ومشاريع استفادوا من خبرتنا.",
  stories: defaultStories,
  cta: { text: "جميع قصص النجاح", href: "/success-stories" },
};

export function SuccessStoriesSection() {
  const { content } = useSiteContent("success_stories", defaultContent);
  const stories = content.stories || defaultStories;

  return (
    <section id="stories" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <TrendingUp className="w-3.5 h-3.5" />
            {content.badge}
          </div>
          <h2 className="heading-lg mb-3">{content.heading}</h2>
          <p className="body-base text-muted-foreground">{content.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {stories.map((story, i) => (
            <StoryCard
              key={story.name}
              name={story.name}
              location={story.location}
              quote={story.quote}
              metric={story.metric}
              index={i}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href={content.cta?.href || "/success-stories"} className="btn-accent inline-flex">
            {content.cta?.text || "جميع قصص النجاح"}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
