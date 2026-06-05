"use client";

import Link from "next/link";
import { Clock, Users, ArrowLeft } from "lucide-react";
import { getCategoryMeta } from "@/lib/categoryMeta";
import { levelLabels, levelColors, getLevelForLesson } from "@/lib/trackMapping";
import { getCardImageUrl, getCardSrcSet } from "@/lib/images";

interface LessonCardProps {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  readTime?: string;
  read_time?: string;
  difficulty?: string;
  image?: string | null;
  index?: number;
  lessonIndex?: number;
  totalLessons?: number;
}

export function LessonCard({
  id,
  title,
  category,
  subcategory,
  description,
  readTime,
  read_time,
  difficulty,
  image,
  index = 0,
  lessonIndex,
  totalLessons,
}: LessonCardProps) {
  const meta = getCategoryMeta(category);
  const LevelIcon = meta.icon;
  const level = getLevelForLesson(difficulty);
  const levelClass = levelColors[level];
  const displayCategory = subcategory || category;

  return (
    <Link
      href={`/lesson/${id}`}
      className="card-premium group flex flex-col h-full"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image area */}
      <div className="card-image aspect-[16/10] mx-4 mt-4 mb-3">
        {image ? (
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <img
              src={getCardImageUrl(image)}
              srcSet={getCardSrcSet(image)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ) : (
          <div className={`w-full h-full rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
            <LevelIcon className="w-10 h-10 text-accent/50 group-hover:text-accent/70 transition-colors duration-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-3 flex flex-col">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className="tag tag-accent">{displayCategory}</span>
          <span className={`tag ${levelClass}`}>{levelLabels[level]}</span>
          {typeof lessonIndex === "number" && typeof totalLessons === "number" && (
            <span className="tag bg-slate-50 text-slate-600 border-slate-200">
              درس {lessonIndex} من {totalLessons}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-foreground mb-1.5 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* Meta */}
        <div className="card-meta mt-auto">
          <span className="card-meta-item">
            <Clock className="w-3 h-3" />
            {readTime || read_time || "١٥ دقيقة"}
          </span>
          <span className="card-meta-item">
            <Users className="w-3 h-3" />
            150 متعلم
          </span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between mt-auto">
        <span className="text-xs font-semibold text-accent group-hover:underline">
          ابدأ التعلم
        </span>
        <ArrowLeft className="w-3.5 h-3.5 text-accent transition-transform duration-300 group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}
