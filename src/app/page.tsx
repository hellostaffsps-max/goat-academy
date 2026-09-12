import { getPublicLessons, getPublicArticles } from "@/lib/public-content";
import { PublicContentProvider } from "@/components/PublicContentProvider";
import { ServicesSection } from "@/components/sections/ServicesSection";

import { HeroSection } from "@/components/sections/HeroSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { PathsSection } from "@/components/sections/PathsSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { SuccessStoriesSection } from "@/components/sections/SuccessStoriesSection";
import { ResourcesSection } from "@/components/sections/ResourcesSection";
import { ToolsPreviewSection } from "@/components/sections/ToolsPreviewSection";

export default async function HomePage() {
  const [lessons, articles] = await Promise.all([
    getPublicLessons(),
    getPublicArticles(),
  ]);
  return (
    <PublicContentProvider
      data={{
        lessons: lessons.slice(0, 3).map((l) => ({ ...l, content: "" })),
        articles: articles.slice(0, 3).map((a) => ({ ...a, content: "" })),
      }}
    >
      <div className="animate-fade-in">
        <HeroSection />
        <FounderSection />
        <ServicesSection />
        <PathsSection />
        <CoursesSection />
        <BlogSection />
        <SuccessStoriesSection />
        <ToolsPreviewSection />
        <ResourcesSection />
      </div>
    </PublicContentProvider>
  );
}
