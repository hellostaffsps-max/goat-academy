import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "استشارة قهوة وتطوير مقهى في فلسطين",
  "تواصل مع وائل أرزيقات في Goat Journey لمناقشة تأسيس المقهى وتطوير المنيو وتدريب فريق الباريستا في فلسطين.",
  "/consultant",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
