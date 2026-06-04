import { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | GoatJourney Academy — قصة التأسيس",
  description:
    "تعرف على يوسف خليل مؤسس الأكاديمية — Q Grader معتمد بخبرة 15+ سنة في صناعة القهوة المختصة ورحلة بناء أول أكاديمية عربية.",
  keywords: ["يوسف خليل", "Q Grader فلسطين", "أكاديمية قهوة"],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "من نحن | GoatJourney Academy — قصة التأسيس",
    description:
      "تعرف على يوسف خليل مؤسس الأكاديمية — Q Grader معتمد بخبرة 15+ سنة في صناعة القهوة المختصة.",
    url: "https://www.goatjourney.online/about",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
