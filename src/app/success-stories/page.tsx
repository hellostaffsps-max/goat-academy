"use client";

import Link from "next/link";
import { ArrowLeft, Star, Quote, TrendingUp, MapPin, Coffee } from "lucide-react";

const stories = [
  {
    name: "مقهى البن العربي",
    location: "رام الله، فلسطين",
    quote: "بعد استشارة Goat Journey Academy، زادت مبيعاتنا بنسبة 60% خلال 3 أشهر فقط. التوجيهات العملية غيّرت مسار مشروعنا بالكامل. كان الفريق محترفاً جداً وقدموا لنا خطة واضحة خطوة بخطوة.",
    metric: "+60% مبيعات",
    metricDetail: "في 3 أشهر",
    services: ["استشارة", "تدريب فريق", "تطوير قائمة"],
  },
  {
    name: "روستري التخصص",
    location: "عمان، الأردن",
    quote: "التدريب المكثف في الأكاديمية ساعد فريقنا في رفع جودة التحميص وتحقيق درجات Q Grader ممتازة. الفرق واضح بين ما قبل وبعد التدريب.",
    metric: "جودة ممتازة",
    metricDetail: "Q Grader",
    services: ["تدريب", "جودة", "اختبار"],
  },
  {
    name: "كافيه نابلس الجديد",
    location: "نابلس، فلسطين",
    quote: "بدأنا من الصفر بفضل خطة العمل المفصلة. اليوم لدينا مقهى ناجح بأكثر من 200 زبون يومياً. الشكر الكبير لفريق Goat Journey على الدعم المستمر.",
    metric: "200+ زبون/يوم",
    metricDetail: "من الصفر",
    services: ["تأسيس", "تصميم", "تدريب"],
  },
  {
    name: "مقهى ديار",
    location: "بيرزيت، فلسطين",
    quote: "تم تقديم خطة تشغيل وبرنامج تدريبي للفريق مع قائمة مشروبات معدّة للتقديم السريع والثابت. النتائج فاقت توقعاتنا بكثير.",
    metric: "قائمة جاهزة",
    metricDetail: "تدريب مكتمل",
    services: ["استشارة", "تطوير قائمة"],
  },
  {
    name: "مقهى الهلال",
    location: "الخليل، فلسطين",
    quote: "تدريب عملي للطاقم على إعداد القهوة وتقديم منيو بسيط للزبائن مع توجيهات جودة يومية. نتطلع للافتتاح قريباً بثقة كبيرة.",
    metric: "إطلاق قريب",
    metricDetail: "تحضيرات نهائية",
    services: ["تدريب", "جودة"],
  },
  {
    name: "كافيه لمسة",
    location: "دبي، الإمارات",
    quote: "الاستشارة المباشرة مع يوسف خليل كانت نقطة تحول. ساعدنا في اختيار المعدات المثالية وتدريب الفريق على أعلى مستوى.",
    metric: "100% رضا",
    metricDetail: "فريق مدرب",
    services: ["استشارة", "تدريب", "اختيار معدات"],
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      {/* Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
          <TrendingUp className="w-3.5 h-3.5" />
          قصص النجاح
        </div>
        <h1 className="heading-xl mb-3">مشاريع ناجحة بنيناها معاً</h1>
        <p className="body-base text-muted-foreground max-w-xl mx-auto">
          قصص حقيقية من أصحاب مقاهٍ ومشاريع استفادوا من خبرتنا في صناعة القهوة.
        </p>
      </section>

      {/* Stories Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story, i) => (
            <div
              key={story.name}
              className="card-premium p-6 relative"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Quote className="w-8 h-8 text-accent/20 absolute top-4 right-4" />
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                &ldquo;{story.quote}&rdquo;
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {story.services.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div>
                  <div className="text-sm font-bold text-foreground">{story.name}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {story.location}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-bold text-accent block">{story.metric}</span>
                  <span className="text-[9px] text-muted-foreground">{story.metricDetail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-premium p-8 text-center">
          <Coffee className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="heading-lg mb-3">كن قصة نجاح التالية</h2>
          <p className="body-base text-muted-foreground mb-6 max-w-lg mx-auto">
            سواء كنت تخطط لفتح مقهى أو تريد تطوير مشروعك الحالي، نحن هنا لمساعدتك.
          </p>
          <Link href="/consultant" className="btn-premium inline-flex">
            احجز استشارتك الآن
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
