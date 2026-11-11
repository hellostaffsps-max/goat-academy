"use client";
import Link from "next/link";
import { ProjectPortfolio } from "@/components/ProjectPortfolio";
import { confirmedProject } from "@/data/projects";
import { ArrowLeft, Coffee } from "lucide-react";
import { useSupabaseSuccessStories } from "@/hooks/useSupabaseData";

export default function SuccessStoriesPage() {
  const { stories } = useSupabaseSuccessStories();
  // Preserve independently added CMS projects without repeating the named portfolio.
  const additional = stories.filter(
    (s) => !confirmedProject(s.title) && !confirmedProject(s.slug),
  );
  return (
    <div className="animate-fade-in space-y-12 pb-10">
      <header className="max-w-3xl py-8 space-y-4">
        <p className="text-sm font-semibold text-accent">أعمال المقاهي</p>
        <h1 className="heading-xl">مشاريع ناجحة بنيناها معاً</h1>
        <p className="body-lg text-muted-foreground">
          تجارب مختلفة يجمعها الاهتمام بالبار والمشروب والفريق.
        </p>
      </header>
      <ProjectPortfolio />
      {additional.length > 0 && (
        <section
          aria-label="مشاريع إضافية"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {additional.map((story) => (
            <article key={story.id} className="card-premium p-6 space-y-3">
              <h2 className="text-xl font-bold">{story.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {story.description}
              </p>
              {story.location && (
                <p className="text-sm text-muted-foreground">
                  {story.location}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
      <section className="card-premium p-8 text-center">
        <Coffee
          aria-hidden="true"
          className="w-10 h-10 text-accent mx-auto mb-4"
        />
        <h2 className="heading-lg mb-3">لنبدأ قصة مشروعك</h2>
        <p className="body-base text-muted-foreground mb-6 max-w-lg mx-auto">
          تخطط لافتتاح مقهى أو تطوير البار والمنيو والفريق؟ احكِ لنا عن مشروعك.
        </p>
        <Link href="/consultant" className="btn-premium inline-flex">
          ناقش مشروعك مع وائل{" "}
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
