import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "استكشف دروس القهوة",
  "ابحث في دروس القهوة وتحضير المشروبات والمعدات وتشغيل المقاهي مع Goat Journey.",
  "/explore",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
