"use client";

import { useRouter } from "next/navigation";
import type { PublicArticle } from "@/lib/public-types";
import Link from "next/link";
import { LessonContent } from "@/components/lesson/LessonContent";
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { SocialShare } from "@/components/SocialShare";

export default function ArticlePage({ article }: { article: PublicArticle }) {
  const router = useRouter();

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Hero */}
      <div className="relative">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-2 text-sm mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمدونة
        </Link>

        {/* Title Card */}
        <div className="border-b border-border pb-8 text-right">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full border border-border/10 flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            <span className="text-xs text-foreground bg-accent/10 px-2 py-0.5 rounded-full font-medium">
              {article.category_label}
            </span>
          </div>
          <h1 className="heading-xl mb-4">{article.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 border-t border-border/50 pt-3">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(article.date).toLocaleDateString("ar-EG-u-nu-latn")}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="w-3 h-3" />
              {["وائل أرزيقات", "Wael Irzeqat", "فريق GoatJourney"].includes(
                article.author,
              ) ? (
                <Link href="/about">{article.author}</Link>
              ) : (
                article.author
              )}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              {article.read_time}
            </span>
            <SocialShare title={article.title} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 space-y-6">
        {article.content ? (
          <div className="text-right">
            <LessonContent content={article.content} />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">
              المحتوى التفصيلي قريباً
            </p>
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
