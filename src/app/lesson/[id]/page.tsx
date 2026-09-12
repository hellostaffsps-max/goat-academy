import { notFound, permanentRedirect } from "next/navigation";
import {
  getPublicLesson,
  getPublicLessons,
  getPublicPaths,
} from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, organizationId } from "@/lib/site";
import { JsonLd, BreadcrumbSchema } from "@/components/StructuredData";
import { getLessonNavigation } from "@/lib/lessonNavigation";
import LessonPageClient from "./LessonPageClient";
type Props = { params: Promise<{ id: string }> };
export const revalidate = 300;
export async function generateStaticParams() {
  return (await getPublicLessons()).map((l) => ({ id: l.slug }));
}
export async function generateMetadata({ params }: Props) {
  const l = await getPublicLesson((await params).id);
  if (!l) notFound();
  return pageMetadata(l.title, l.description, `/lesson/${l.slug}`, "article");
}
export default async function Page({ params }: Props) {
  const { id } = await params;
  const lesson = await getPublicLesson(id);
  if (!lesson) notFound();
  if (id !== lesson.slug) permanentRedirect(`/lesson/${lesson.slug}`);
  const [lessons, paths] = await Promise.all([
    getPublicLessons(),
    getPublicPaths(),
  ]);
  const relatedLessons = lessons
    .filter((l) => l.category === lesson.category && l.id !== lesson.id)
    .slice(0, 4)
    .map((l) => ({ ...l, content: "" }));
  const nav = getLessonNavigation(lesson.slug, lessons, paths);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: lesson.title,
          description: lesson.description,
          inLanguage: "ar",
          learningResourceType: "Lesson",
          educationalLevel: lesson.difficulty,
          url: absoluteUrl(`/lesson/${lesson.slug}`),
          provider: { "@id": organizationId },
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "الرئيسية", item: "/" },
          { name: "الدروس", item: "/courses" },
          { name: lesson.title },
        ]}
      />
      <LessonPageClient
        lesson={lesson}
        relatedLessons={relatedLessons}
        nav={nav}
      />
    </>
  );
}
