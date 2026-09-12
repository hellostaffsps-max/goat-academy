import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "مقالات القهوة وتطوير المقاهي",
  "مقالات في القهوة المختصة وتدريب الباريستا وتشغيل المقاهي في فلسطين من Goat Journey.",
  "/blog",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
