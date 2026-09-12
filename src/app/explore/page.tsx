import { services } from "@/data/services";
import { downloadResources } from "@/data/downloadResources";
import PageClient from "./PageClient";
import { PublicContentProvider } from "@/components/PublicContentProvider";
import { getPublicLessons, getPublicArticles } from "@/lib/public-content";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category } = await searchParams;
  const [lessons, articles] = await Promise.all([
    getPublicLessons(),
    getPublicArticles(),
  ]);
  const extraResults = [
    ...articles.map((a) => ({
      title: a.title,
      description: a.description,
      href: `/blog/${a.slug}`,
      type: "مقال",
    })),
    ...services.map((s) => ({
      title: s.name + " — " + s.englishName,
      description: s.summary,
      href: `/services/${s.slug}`,
      type: "خدمة",
    })),
    ...Object.entries(downloadResources).map(([slug, r]) => ({
      title: r.title,
      description: r.description,
      href: `/downloads/${slug}`,
      type: "دليل",
    })),
    {
      title: "أدوات القهوة وحساب التكاليف",
      description: "حاسبات وأدوات عملية للباريستا وأصحاب المقاهي",
      href: "/tools",
      type: "أدوات",
    },
  ];
  return (
    <PublicContentProvider
      data={{ lessons: lessons.map((l) => ({ ...l, content: "" })) }}
    >
      <PageClient
        key={`${q}:${category}`}
        query={q}
        category={category}
        extraResults={extraResults}
      />
    </PublicContentProvider>
  );
}
