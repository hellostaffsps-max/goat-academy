import { Metadata } from "next";

export const metadata: Metadata = {
  title: "دورات القهوة المختصة | تعلم الباريستا من الصفر",
  description:
    "دورات عملية من المبتدئين إلى المتقدمين في عالم القهوة المختصة — تدريب الباريستا، تحضير الإسبريسو، وتأسيس المقاهي. ابدأ رحلتك الآن.",
  keywords: ["دورات قهوة", "تعلم الباريستا", "دورة باريستا فلسطين", "تدريب قهوة"],
  alternates: {
    canonical: "/courses",
  },
  openGraph: {
    title: "دورات القهوة المختصة | تعلم الباريستا من الصفر",
    description:
      "دورات عملية من المبتدئين إلى المتقدمين في عالم القهوة المختصة — تدريب الباريستا، تحضير الإسبريسو، وتأسيس المقاهي.",
    url: "https://www.goatjourney.online/courses",
    type: "website",
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
