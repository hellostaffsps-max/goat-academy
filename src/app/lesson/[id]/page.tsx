import type { Metadata } from "next";
import { getLessonByIdOrSlug } from "@/actions/lessons";
import { getLessonById } from "@/data/coffeeData";
import LessonPageClient from "./LessonPageClient";

export function generateStaticParams() {
  const { lessons } = require("@/data/coffeeData");
  return lessons.map((lesson: any) => ({
    id: lesson.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  // Try Supabase first
  let lesson = null;
  try {
    lesson = await getLessonByIdOrSlug(id);
  } catch {
    // fallback handled below
  }

  // Fallback to local data
  if (!lesson) {
    try {
      lesson = getLessonById(id);
    } catch {
      // ignore
    }
  }

  if (!lesson) {
    return {
      title: "الدرس غير موجود | GoatJourney Academy",
    };
  }

  const ogImage = `https://www.goatjourney.online/og-${lesson.category || "default"}.jpg`;

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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: lesson.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: lesson.title,
      description: lesson.description,
      images: [ogImage],
    },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Try to get lesson from Supabase first
  let lesson = null;
  try {
    lesson = await getLessonByIdOrSlug(id);
  } catch {
    // fallback
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
