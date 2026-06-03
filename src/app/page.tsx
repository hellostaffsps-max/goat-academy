"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { SuccessStoriesSection } from "@/components/sections/SuccessStoriesSection";
import { ResourcesSection } from "@/components/sections/ResourcesSection";
import { ToolsPreviewSection } from "@/components/sections/ToolsPreviewSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <FounderSection />
      <ServicesSection />
      <CoursesSection />
      <BlogSection />
      <SuccessStoriesSection />
      <ToolsPreviewSection />
      <ResourcesSection />
      <NewsletterSection />
    </div>
  );
}
