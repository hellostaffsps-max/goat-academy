"use client";

import { useParams, useRouter } from "next/navigation";
import { articles } from "@/data/blogData";
import { LessonContent } from "@/components/lesson/LessonContent";
import { ArrowRight, Calendar, Clock, User, Tag, ArrowLeft } from "lucide-react";
import { SocialShare } from "@/components/SocialShare";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-sm text-muted-foreground">المقال غير موجود</p>
        <button
          onClick={() => router.push("/blog")}
          className="mt-4 text-xs text-primary hover:underline"
        >
          العودة للمدونة
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in -mx-4 -mt-4">
      {/* Hero */}
      <div className="relative">
        <div className="aspect-[21/9] sm:aspect-[16/6] bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden border-b border-border/50 rounded-b-2xl">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-border" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-border/50" />
            <div className="absolute top-1/4 left-12 w-36 h-36 rounded-full bg-accent/5 blur-xl" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              {article.categoryLabel}
            </span>
          </div>

          {/* Back button */}
          <button
            onClick={() => router.push("/blog")}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-background transition-all shadow-xs"
          >
            <ArrowRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Title Card */}
        <div className="mx-4 -mt-6 relative z-10 bg-card border border-border rounded-xl p-5 text-right shadow-sm">
          <div className="flex items-center gap-2 mb-2 flex-wrap justify-end">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full border border-border/10 flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            <span className="text-[9px] text-accent-foreground bg-accent/10 px-2 py-0.5 rounded-full font-medium">
              {article.categoryLabel}
            </span>
          </div>
          <h1 className="text-base font-bold text-foreground mb-1 leading-tight">
            {article.title}
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {article.description}
          </p>
          <div className="flex items-center gap-4 mt-3 justify-end border-t border-border/50 pt-3">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(article.date).toLocaleDateString("ar-EG")}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <User className="w-3 h-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
            <SocialShare title={article.title} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-4">
        {article.content ? (
          <div className="bg-card border border-border rounded-xl p-5 text-right">
            <LessonContent content={article.content} />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">المحتوى التفصيلي قريباً</p>
          </div>
        )}

        {/* Back to Blog */}
        <button
          onClick={() => router.push("/blog")}
          className="w-full py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border bg-card text-foreground hover:bg-accent/5 hover:border-accent/30"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للمدونة
        </button>
      </div>

      <div className="h-8" />
    </div>
  );
}
