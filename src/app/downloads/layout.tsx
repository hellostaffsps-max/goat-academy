import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "مصادر وأدلة القهوة وتأسيس المقاهي",
  "اقرأ أدلة تأسيس المقاهي والمعدات وخطط العمل، واحفظها أو اطبعها للاستخدام العملي.",
  "/downloads",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
