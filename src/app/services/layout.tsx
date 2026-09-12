import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "خدمات تدريب الباريستا واستشارات القهوة في فلسطين",
  "خدمات Goat Journey مع وائل أرزيقات: تدريب الباريستا، استشارات المقاهي، تدريب طاقم العمل وتطوير منيو القهوة في فلسطين.",
  "/services",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
