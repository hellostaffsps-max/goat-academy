import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "دروس القهوة وتدريب الباريستا",
  "تصفح دروس القهوة والإسبريسو وتحضير المشروبات وتشغيل المقاهي، وتعرف على خدمات التدريب العملي مع وائل أرزيقات.",
  "/courses",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
