"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { categories, getRecommendedLessons } from "@/data/coffeeData";
import { useSupabaseLessons } from "@/hooks/useSupabaseData";
import {
  Star,
  Heart,
  Clock,
  ChevronLeft,
  ArrowLeft,
  Sparkles,
  Coffee,
  BookOpen,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categoryMeta";

export default function HomePage() {
  const { toggleFavorite, isFavorite, completedLessons } = useStore();
  const { lessons, loading: lessonsLoading } = useSupabaseLessons();

  const recommended = getRecommendedLessons(lessons);
  const completedCount = completedLessons.length;
  const totalLessons = lessons.length;
  const progressPercent = Math.min(Math.round((completedCount / totalLessons) * 100), 100);

  const cafesCreated = [
    {
      id: "cafe-sabah",
      title: "مقهى الصباح",
      location: "رام الله",
      description: "مقهى متخصص في القهوة المختصة، تم تصميم منيو احترافي وتدريب فريق الباريستا على وصفات ثابتة.",
      menuItems: ["إسبريسو كلاسيك", "لاتيه بالفانيليا", "فلتر اليوم"],
      status: "تدريب مكتمل",
    },
    {
      id: "cafe-diyar",
      title: "مقهى ديار",
      location: "بيرزيت",
      description: "تم تقديم خطة تشغيل وبرنامج تدريبي للفريق مع قائمة مشروبات معدّة للتقديم السريع والثابت.",
      menuItems: ["كابتشينو مميز", "هوت كراميل لاتيه", "آيس لاتيه"],
      status: "قائمة جاهزة",
    },
    {
      id: "cafe-hilal",
      title: "مقهى الهلال",
      location: "الخليل",
      description: "تدريب عملي للطاقم على إعداد القهوة وتقديم منيو بسيط للزبائن مع توجيهات جودة يومية.",
      menuItems: ["موكا تركية", "فلتر كلاسيكي", "مشروبات باردة"],
      status: "إطلاق قريب",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Hero Section — Minimal & Clean */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary/50 border border-border p-8 sm:p-10">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-accent/20" />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-accent/10" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-[11px] font-medium mb-4 border border-accent/20">
            <Sparkles className="w-3 h-3" />
            أكاديمية القهوة التفاعلية
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight tracking-tight">
            من أول رشفة<br />حتى قرار افتتاح المقهى
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            دليل شامل يجمع مشروبات القهوة، طرق التحضير، المعدات، البن،
            المصطلحات، وأدلة صاحب المقهى بأسلوب مبسط.
          </p>
          <Link
            href="/explore"
            className="mt-5 inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:opacity-90 hover:gap-3"
          >
            ابدأ الاستكشاف
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* About Me Section */}
      <section className="grid gap-6 lg:grid-cols-[280px_1fr] items-center">
        <div className="rounded-[35px] overflow-hidden border border-border bg-card shadow-sm">
          <div className="relative h-72 w-full">
            <Image
              src="/profile-placeholder.svg"
              alt="صورة شخصية"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="rounded-[35px] border border-border bg-card p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-foreground mb-5">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              <path d="M6 20c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4" />
            </svg>
            من أنا
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">مرحباً، أنا مدرب القهوة الخاص بك</h2>
          <p className="text-sm leading-7 text-muted-foreground mb-5">
            أقدّم لك محتوى تعليمي عملي ومبسط عن القهوة، من أساسيات التحميص والتخمير إلى إدارة المقهى وتشغيله.
            أساعدك على بناء مهاراتك بثقة وتطبيقها خطوة بخطوة في العالم الحقيقي.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 mb-5">
            <div className="rounded-3xl border border-border bg-background/50 p-4 text-center">
              <p className="text-sm font-semibold text-foreground">10+</p>
              <p className="text-[10px] text-muted-foreground mt-1">سنوات خبرة</p>
            </div>
            <div className="rounded-3xl border border-border bg-background/50 p-4 text-center">
              <p className="text-sm font-semibold text-foreground">150+</p>
              <p className="text-[10px] text-muted-foreground mt-1">دروس ومقالات</p>
            </div>
            <div className="rounded-3xl border border-border bg-background/50 p-4 text-center">
              <p className="text-sm font-semibold text-foreground">4.9</p>
              <p className="text-[10px] text-muted-foreground mt-1">تقييم الطلاب</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/consultant"
              className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
            >
              طلب استشارة
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
            >
              تصفح الدروس
            </Link>
          </div>
        </div>
      </section>

      {/* Created Cafes Section */}
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-2">مشاريع المقاهي</p>
            <h3 className="text-base font-bold text-foreground tracking-tight">المقاهي التي أنشأتها ودربتها وقمت بإعداد قوائمها</h3>
          </div>
          <Link
            href="/consultant"
            className="text-xs text-accent font-semibold uppercase tracking-[0.28em] hover:text-accent/80 transition-colors"
          >
            المزيد من المشاريع
          </Link>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {cafesCreated.map((cafe) => (
            <div key={cafe.id} className="card-premium p-5 text-right group">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{cafe.title}</h4>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {cafe.location}
                  </div>
                </div>
                <span className="rounded-2xl bg-accent/10 px-3 py-1 text-[10px] font-semibold text-accent-foreground">
                  {cafe.status}
                </span>
              </div>
              <p className="text-[11px] leading-6 text-muted-foreground mb-4">{cafe.description}</p>
              <div className="space-y-2 text-sm">
                {cafe.menuItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-foreground">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 text-[10px] text-muted-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-accent" />
                تدريب الفريق وقائمة التشغيل جاهزة
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { value: completedCount, label: "محتوى مكتمل" },
          { value: categories.length, label: "أقسام كاملة" },
          { value: `${totalLessons}+`, label: "محتوى تعليمي" },
        ].map((stat, i) => (
          <div
            key={i}
            className="card-premium p-4 text-center group cursor-default"
          >
            <div className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
              {stat.value}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="card-premium p-6 text-right">
        <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight">
          تفكر تفتح مقهى؟
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          الأكاديمية تعطيك المعلومات العامة مجاناً، أما أرقام مشروعك فتحتاج دراسة مبنية على بلدك ومدينتك.
        </p>
        <Link
          href="/consultant"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 inline-flex items-center gap-1.5 hover:gap-2.5"
        >
          اطلب دراسة خاصة بمشروعك
          <ChevronLeft className="w-3 h-3" />
        </Link>
      </section>

      {/* Daily Plan */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/paths"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-3 h-3" />
          </Link>
          <h3 className="text-base font-bold text-foreground tracking-tight">خطة اليوم</h3>
        </div>
        <Link
          href="/explore"
          className="block w-full card-premium p-5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            <div className="text-right">
              <span className="text-[10px] text-accent font-medium">مقترح لك</span>
              <div className="text-sm font-semibold text-foreground mt-0.5">
                ابدأ من مسار هاوي القهوة
              </div>
            </div>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1.5 text-left">
            {progressPercent}% مكتمل
          </div>
        </Link>
      </section>

      {/* Categories — Icon-based minimal cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/explore"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-3 h-3" />
          </Link>
          <h3 className="text-base font-bold text-foreground tracking-tight">الأقسام</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat, i) => {
            const meta = getCategoryMeta(cat.id);
            const Icon = meta.icon;
            return (
              <Link
                key={cat.id}
                href={`/explore?category=${cat.id}`}
                className={cn(
                  "card-premium p-4 flex items-center gap-4 text-right group animate-slide-up",
                  `stagger-${i + 1}`
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                  meta.gradient
                )}>
                  <Icon className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-0.5">
                    {cat.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-[10px] text-muted-foreground">
                    {cat.count} درس
                  </span>
                  <ChevronLeft className="w-3 h-3 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recommended */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/explore"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-3 h-3" />
          </Link>
          <h3 className="text-base font-bold text-foreground tracking-tight">مقترح لك</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recommended.slice(0, 8).map((lesson, i) => (
            <div
              key={lesson.id}
              className={cn(
                "card-premium overflow-hidden group animate-slide-up",
                `stagger-${i + 1}`
              )}
            >
              <Link
                href={`/lesson/${lesson.id}`}
                className="block w-full text-right"
              >
                {/* Minimal color header instead of image */}
                <div className="aspect-[4/3] relative bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-muted-foreground/30" strokeWidth={1} />
                  <div className="absolute top-2 left-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(lesson.id);
                      }}
                      className="w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
                    >
                      <Heart
                        className={cn(
                          "w-3.5 h-3.5 transition-colors",
                          isFavorite(lesson.id)
                            ? "text-red-500 fill-red-500"
                            : "text-foreground/50"
                        )}
                      />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    <Star className="w-2.5 h-2.5 text-accent" fill="currentColor" />
                    <span className="text-[10px] text-foreground font-medium">
                      {lesson.rating}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {lesson.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                    {lesson.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {lesson.readTime || "5m"}
                    </span>
                    <span className="text-[9px] text-accent-foreground bg-accent/10 px-1.5 py-0.5 rounded font-medium">
                      {lesson.subcategory}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
