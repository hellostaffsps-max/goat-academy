import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نصائح وإرشادات من خبرتنا | GoatJourney Academy",
  description:
    "مقالات تساعدك في اتخاذ قرارات أفضل في رحلتك — نصائح تأسيس المقاهي، ميزانية المعدات، وأخطاء شائعة يجب تجنبها.",
  keywords: ["مدونة قهوة", "نصائح مقهى", "تأسيس مقهى فلسطين"],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "نصائح وإرشادات من خبرتنا | GoatJourney Academy",
    description:
      "مقالات تساعدك في اتخاذ قرارات أفضل في رحلتك — نصائح تأسيس المقاهي، ميزانية المعدات، وأخطاء شائعة.",
    url: "https://www.goatjourney.online/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
