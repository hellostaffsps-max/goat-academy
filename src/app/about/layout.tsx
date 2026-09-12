import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "وائل أرزيقات | Wael Irzeqat — مدرب واستشاري قهوة في فلسطين",
  "تعرف على وائل أرزيقات، مؤسس Goat Journey، وخبرته في تدريب الباريستا وتطوير المقاهي وتصميم قوائم المشروبات في فلسطين.",
  "/about",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
