import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدونة القهوة المختصة | مقالات ونصائح احترافية",
  description:
    "اكتشف أحدث المقالات في عالم القهوة المختصة — نصائح تأسيس المقاهي، ميزانية المعدات، وأخطاء شائعة يجب تجنبها.",
  keywords: ["مدونة قهوة", "نصائح مقهى", "تأسيس مقهى فلسطين"],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "مدونة القهوة المختصة | مقالات ونصائح احترافية",
    description:
      "اكتشف أحدث المقالات في عالم القهوة المختصة — نصائح تأسيس المقاهي، ميزانية المعدات، وأخطاء شائعة.",
    url: "https://www.goatjourney.online/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
