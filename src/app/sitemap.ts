import type { MetadataRoute } from "next";
import { lessons } from "@/data/coffeeData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://goatjourney.com";

  const staticRoutes = [
    "",
    "/explore",
    "/paths",
    "/tools",
    "/consultant",
    "/favorites",
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const lessonEntries = lessons.map((lesson) => ({
    url: `${baseUrl}/lesson/${lesson.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...lessonEntries];
}
