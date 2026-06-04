import type { Metadata } from "next";
import { getLessonBySlug } from "@/actions/lessons";
import { lessons } from "@/data/coffeeData";
import LessonPageClient from "./LessonPageClient";

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    id: lesson.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Try Supabase first
  let lesson = null;
  try {
    lesson = await getLessonBySlug(id);
  } catch {
    // fallback handled below
  }

  if (!lesson) {
    return {
      title: "الدرس غير موجود | GoatJourney Academy",
    };
  }

  return {
    title: `${lesson.title} | GoatJourney Academy`,
    description: lesson.description,
    alternates: {
      canonical: `/lesson/${id}`,
    },
    openGraph: {
      title: lesson.title,
      description: lesson.description,
      type: "article",
      url: `https://www.goatjourney.online/lesson/${id}`,
    },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let lesson = null;
  try {
    lesson = await getLessonBySlug(id);
  } catch {
    // Will fallback in client
  }

  const jsonLd = lesson
    ? {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: lesson.title,
        description: lesson.description,
        inLanguage: "ar",
        educationalLevel: lesson.difficulty || "مبتدئ",
        learningResourceType: "Lesson",
        url: `https://www.goatjourney.online/lesson/${id}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <LessonPageClient lessonId={id} />
    </>
  );
}
