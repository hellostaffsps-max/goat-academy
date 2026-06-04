"use client";

import Link from "next/link";
import { ArrowLeft, Star, Quote, TrendingUp, MapPin, Coffee } from "lucide-react";
import { useSupabaseSuccessStories } from "@/hooks/useSupabaseData";

const fallbackStories = [
  {
    id: "1",
    slug: "arabica-cafe-ramallah",
    title: "مقهى البن العربي",
    location: "رام الله، فلسطين",
    description: "بعد استشارة Goat Journey Academy، زادت مبيعاتنا بنسبة 60% خلال 3 أشهر فقط. التوجيهات العملية غيّرت مسار مشروعنا بالكامل.",
    content: "",
    image: null,
    featured: true,
  },
  {
    id: "2",
    slug: "roastery-amman",
    title: "روستري التخصص",
    location: "عمان، الأردن",
    description: "التدريب المكثف في الأكاديمية ساعد فريقنا في رفع جودة التحميص وتحقيق درجات Q Grader ممتازة.",
    content: "",
    image: null,
    featured: true,
  },
  {
    id: "3",
    slug: "nablus-cafe",
    title: "كافيه نابلس الجديد",
    location: "نابلس، فلسطين",
    description: "بدأنا من الصفر بفضل خطة العمل المفصلة. اليوم لدينا مقهى ناجح بأكثر من 200 زبون يومياً.",
    content: "",
    image: null,
    featured: true,
  },
];

export default function SuccessStoriesPage() {
  const { stories: dbStories, loading } = useSupabaseSuccessStories();
  const stories = dbStories.length > 0 ? dbStories : fallbackStories;

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

      {/* Loading */}
      {loading && dbStories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      )}

      {/* Stories Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story, i) => (
            <div
              key={story.id}
              className="card-premium p-6 relative"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Quote className="w-8 h-8 text-accent/20 absolute top-4 right-4" />

              {/* Avatar + Stars */}
              <div className="flex items-center gap-3 mb-4">
                {story.image ? (
                  <img src={story.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {story.title.charAt(0)}
                  </div>
                )}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                &ldquo;{story.description}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div>
                  <div className="text-sm font-bold text-foreground">{story.title}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {story.location}
                  </div>
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
