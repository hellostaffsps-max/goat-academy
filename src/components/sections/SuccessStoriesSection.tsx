"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { StoryCard } from "@/components/cards/StoryCard";

const defaultStories = [
  { name: "مقهى فران (FARRAN)", location: "رام الله والقدس، فلسطين", quote: "تصميم منيو مشروبات حديث وتقديم تجربة قهوة مختصة متكاملة بنكهات مميزة.", metric: "منيو حديث" },
  { name: "مقهى ريكوفي (RECOFFE)", location: "رام الله، فلسطين", quote: "بفضل تدريب الباريستا المكثف ودراسات الجدوى المالية من الأكاديمية، استطعنا تقديم معايير استخلاص عالمية وثبات لا مثيل له في جودة المشروبات.", metric: "ثبات جودة" },
  { name: "قهوة مريم (QAHWET MARIAM)", location: "رام الله، فلسطين", quote: "بناء المقهى من الصفر مع تطبيق نظام تشغيل (SOP) متكامل، وتوريد كامل للمعدات وتصميم المنيو، وتطوير خلطة إسبريسو خاصة من محمصة سينسيز، مع الإشراف التشغيلي على إدارة المقهى.", metric: "SOP & إدارة" },
  { name: "كافيه كريف (CRAVE)", location: "الخليل، فلسطين", quote: "من مرحلة الفكرة حتى الافتتاح، كانت خطط التشغيل وحسابات تكاليف الأكاديمية هي المرشد الأساسي لنا لضمان استدامة الأرباح ونجاح المشروع.", metric: "أرباح مستدامة" },
  { name: "مقهى ستوريز (STORIES)", location: "رام الله، فلسطين", quote: "تجديد كامل لمنطقة البار وتشغيلها وتصميم منيو جديد كلياً، وتوريد معدات حديثة، مع توظيف طاقم الباريستا وإعداد دراسة تكاليف تشغيلية دقيقة.", metric: "تجديد البار" },
  { name: "كافيه برافوز (BRAVOS)", location: "أريحا، فلسطين", quote: "بناء المقهى من الصفر وتوظيف الطواقم التشغيلية وتدريبهم بالكامل، بالإضافة إلى إنشاء منيو مميز خاص بالمشروبات.", metric: "بناء من الصفر" },
  { name: "إتش كافيه (H CAFE)", location: "رام الله / سردا، فلسطين", quote: "إضافة قسم بار متكامل وتصميم مساحته، وتقديم استشارة لشراء أفضل المعدات، وصياغة SOP كامل وتصميم منيو وتدريب الطاقم من الصفر لضمان الاحترافية وانسيابية العمل (Workflow).", metric: "تصميم & تدريب" },
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
