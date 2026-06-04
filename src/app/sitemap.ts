import { MetadataRoute } from "next";
import { lessons } from "@/data/coffeeData";

const BASE_URL = "https://www.goatjourney.online";

export default function sitemap(): MetadataRoute.Sitemap {
  // الصفحات الثابتة
  const staticPages = [
    { route: "", priority: 1.0, changefreq: "weekly" },
    { route: "/courses", priority: 0.9, changefreq: "weekly" },
    { route: "/blog", priority: 0.9, changefreq: "weekly" },
    { route: "/tools", priority: 0.8, changefreq: "monthly" },
    { route: "/about", priority: 0.8, changefreq: "monthly" },
    { route: "/consultant", priority: 0.9, changefreq: "monthly" },
    { route: "/services", priority: 0.9, changefreq: "monthly" },
    { route: "/downloads", priority: 0.7, changefreq: "monthly" },
    { route: "/success-stories", priority: 0.7, changefreq: "monthly" },
    { route: "/explore", priority: 0.8, changefreq: "weekly" },
    { route: "/paths", priority: 0.7, changefreq: "monthly" },
    { route: "/settings", priority: 0.3, changefreq: "yearly" },
  ] as const;

  const staticEntries = staticPages.map((page) => ({
    url: `${BASE_URL}${page.route}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq as MetadataRoute.Sitemap[0]["changeFrequency"],
    priority: page.priority,
  }));

  // صفحات الدروس الديناميكية
  const lessonEntries = lessons.map((lesson) => ({
    url: `${BASE_URL}/lesson/${lesson.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...lessonEntries];
}
