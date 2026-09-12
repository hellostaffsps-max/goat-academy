import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "مشاريع وتجارب في تطوير المقاهي",
  "تعرف على مشاريع وتجارب Goat Journey في تطوير المقاهي وتدريب الطواقم وتصميم قوائم المشروبات.",
  "/success-stories",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
