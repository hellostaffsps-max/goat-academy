import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "مسارات تعلم القهوة والباريستا",
  "مسارات تعليمية في القهوة وتحضير المشروبات وتأسيس المقاهي، مع دروس مترابطة من Goat Journey.",
  "/paths",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
