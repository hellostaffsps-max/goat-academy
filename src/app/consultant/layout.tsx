import { Metadata } from "next";

export const metadata: Metadata = {
  title: "استشارات تأسيس المقاهي | احجز استشارتك المجانية",
  description:
    "احصل على استشارة مجانية لتأسيس مقهاك في فلسطين — دراسة جدوى، اختيار المعدات، وتدريب الباريستا مع خبراء متخصصين.",
  keywords: ["استشارة مقهى", "تأسيس مقهى فلسطين", "دراسة جدوى مقهى"],
  alternates: {
    canonical: "/consultant",
  },
  openGraph: {
    title: "استشارات تأسيس المقاهي | احجز استشارتك المجانية",
    description:
      "احصل على استشارة مجانية لتأسيس مقهاك في فلسطين — دراسة جدوى، اختيار المعدات، وتدريب الباريستا.",
    url: "https://www.goatjourney.online/consultant",
    type: "website",
  },
};

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
