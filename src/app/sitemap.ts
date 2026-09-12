import type { MetadataRoute } from "next";
import { getPublicLessons, getPublicArticles } from "@/lib/public-content";
import { downloadResources } from "@/data/downloadResources";
import { services } from "@/data/services";
import { absoluteUrl } from "@/lib/site";
export const revalidate = 300;
function modified(value?: string) {
  return value && !Number.isNaN(Date.parse(value))
    ? new Date(value)
    : undefined;
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [lessons, articles] = await Promise.all([
    getPublicLessons(),
    getPublicArticles(),
  ]);
  const pages = [
    "/",
    "/about",
    "/services",
    "/consultant",
    "/courses",
    "/explore",
    "/paths",
    "/blog",
    "/tools",
    "/downloads",
    "/success-stories",
    ...services.map((s) => `/services/${s.slug}`),
    ...Object.keys(downloadResources).map((s) => `/downloads/${s}`),
  ];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p) })),
    ...lessons.map((l) => ({
      url: absoluteUrl(`/lesson/${l.slug}`),
      lastModified: modified(l.updated_at),
    })),
    ...articles.map((a) => ({
      url: absoluteUrl(`/blog/${a.slug}`),
      lastModified: modified(a.updated_at || a.date),
    })),
  ];
}
