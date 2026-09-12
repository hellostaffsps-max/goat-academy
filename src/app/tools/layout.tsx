import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "أدوات وحاسبات القهوة والمقاهي",
  "أدوات لحساب الوصفات والتكاليف والتسعير وتحسين قرارات تشغيل المقهى من Goat Journey.",
  "/tools",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
