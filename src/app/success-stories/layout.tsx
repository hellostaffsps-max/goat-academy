import { Metadata } from "next";

export const metadata: Metadata = {
  title: "قصص النجاح | مشاريع مقاهي ناجحة بنيناها معاً",
  description:
    "قصص حقيقية من أصحاب مقاهٍ ومشاريع استفادوا من خبرتنا في صناعة القهوة — نتائج ملموسة وأرقام تتحدث.",
  keywords: ["قصص نجاح", "مشاريع مقاهي", "تأسيس مقهى ناجح"],
  alternates: {
    canonical: "/success-stories",
  },
  openGraph: {
    title: "قصص النجاح | مشاريع مقاهي ناجحة بنيناها معاً",
    description:
      "قصص حقيقية من أصحاب مقاهٍ ومشاريع استفادوا من خبرتنا في صناعة القهوة.",
    url: "https://www.goatjourney.online/success-stories",
    type: "website",
  },
};

export default function SuccessStoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
