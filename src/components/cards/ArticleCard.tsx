"use client";

import Link from "next/link";
import { Clock, BookOpen, ArrowLeft, Calendar } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  category: string;
  categoryLabel?: string;
  subcategory?: string;
  description: string;
  readTime?: string;
  date?: string;
  index?: number;
}

export function ArticleCard({
  id,
  title,
  category,
  categoryLabel,
  subcategory,
  description,
  readTime,
  date,
  index = 0,
}: ArticleCardProps) {
  const displayCategory = categoryLabel || subcategory || category;

  return (
    <Link
      href={`/blog/${id}`}
      className="card-premium group flex flex-col h-full"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="px-5 pt-5 pb-4">
        <BookOpen className="w-7 h-7 text-foreground" />
      </div>
      {/* Content */}
      <div className="flex-1 px-5 pb-5 flex flex-col">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className="tag tag-accent">{displayCategory}</span>
          <span className="tag tag-slate flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime || "١٠ دقيقة"}
          </span>
          {date && (
            <span className="tag tag-slate flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(date).toLocaleDateString("ar-EG-u-nu-latn")}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between mt-auto">
        <span className="text-xs font-semibold text-accent group-hover:underline">
          اقرأ المقال
        </span>
        <ArrowLeft className="w-3.5 h-3.5 text-accent transition-transform duration-300 group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}
