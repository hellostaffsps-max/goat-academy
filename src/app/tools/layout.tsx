import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أدوات القهوة المختصة | حاسبات تفاعلية مجانية",
  description:
    "استخدم حاسباتنا التفاعلية — حاسبة تكلفة المقهى، حاسبة تسعير المشروبات، وحاسبة نسبة الاستخلاص.",
  keywords: ["حاسبة مقهى", "تكلفة فتح مقهى", "تسعير مشروبات"],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "أدوات القهوة المختصة | حاسبات تفاعلية مجانية",
    description:
      "استخدم حاسباتنا التفاعلية — حاسبة تكلفة المقهى، حاسبة تسعير المشروبات، وحاسبة نسبة الاستخلاص.",
    url: "https://www.goatjourney.online/tools",
    type: "website",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
